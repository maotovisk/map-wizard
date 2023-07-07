<script lang="ts">
  import FileInput from "../lib/FileInput.svelte";
  import { exists, readTextFile, writeFile } from "@tauri-apps/api/fs";
  import {
    importMetadata,
    exportMetadata,
  } from "../../tools/metadata-manager/main";
  import InputLine from "../lib/InputLine.svelte";
  import ComboColorsSelector from "../lib/ComboColorsSelector.svelte";
  import ColorPicker from "../lib/ColorPicker.svelte";
  import type {
    BeatmapMetadata,
    BeatmapMetadataExporterOptions,
  } from "src/tools/metadata-manager/types";
  import { LineEnding, NormalizedString } from "@igor.dvlpr/normalized-string";
  import { Color4 } from "osu-classes";

  let selectedOriginPaths: string[] = [];
  let selectedDestinationPaths: string[] = [];

  let toastIcon: string = "";
  let toastMessage: string = "";
  let toastColor: string = "";

  // values of the metadata fields
  let metadataFields: BeatmapMetadata = {
    metadata: {
      artist: "",
      artistRomanized: "",
      creator: "",
      source: "",
      tags: [],
      title: "",
      titleRomanized: "",
    },
    generalMetadata: {
      audioFileName: "",
      epilepsyWarning: false,
      previewTime: 0,
      samplesMatchPlaybackRate: false,
      widescreenStoryboard: false,
    },
    beatmapColours: {
      sliderBorderColour: new Color4(255, 255, 255, 1),
      sliderTrackColour: new Color4(255, 255, 255, 1),
      comboColours: [],
    },
  };

  let options: BeatmapMetadataExporterOptions = {
    removeDuplicates: true,
    resetBeatmapIDs: false,
  };

  // tags
  let tagsValue: string = "";

  let enableBorderColour = false;
  let enableTrackColour = false;

  // This is a hack to make sure that the toast notification is triggered in the first time it is called;
  let hasNotification: boolean = false;

  const sendNotification = async ({
    notificationColor,
    notificationIcon,
    notificationMessage,
  }: {
    notificationIcon;
    notificationMessage;
    notificationColor;
  }) => {
    // Hack mentioned above
    hasNotification = true;
    await ui("#notificacao");

    toastIcon = notificationIcon;
    toastMessage = notificationMessage;
    toastColor = notificationColor;
  };

  const importMetadataAction = async () => {
    if (
      selectedOriginPaths.length == 0 ||
      !(await exists(selectedOriginPaths[0]))
    )
      return await sendNotification({
        notificationColor: "error",
        notificationMessage: "Selected origin beatmap file not found",
        notificationIcon: "error",
      });

    const originBeatmapContent: string = await readTextFile(
      selectedOriginPaths[0]
    );

    metadataFields = await importMetadata(originBeatmapContent);

    enableBorderColour =
      metadataFields.beatmapColours.sliderBorderColour != undefined;
    enableTrackColour =
      metadataFields.beatmapColours.sliderTrackColour != undefined;

    tagsValue = metadataFields.metadata.tags.join(" ");
    return null;
  };

  const exportMetadataAction = async () => {
    try {
      console.log(metadataFields);
      const destinationPathExists = await Promise.all(
        selectedDestinationPaths.map((path) => exists(path))
      );

      if (destinationPathExists.includes(false)) {
        return await sendNotification({
          notificationColor: "error",
          notificationMessage:
            "Selected destination beatmap(s) file(s) not found",
          notificationIcon: "error",
        });
      }

      const destinationBeatmaps: string[] = await Promise.all(
        selectedDestinationPaths.map((path) => readTextFile(path))
      );

      metadataFields.metadata.tags = tagsValue.split(" ");

      const copiedMetadataBeatmaps = await exportMetadata({
        destinationBeatmaps,
        metadata: metadataFields,
        options,
      });

      copiedMetadataBeatmaps.forEach(async (copiedMetadataBeatmap, key) => {
        // This encodes the beatmap to the windows CRLF formal.
        const crlfBeatmap = new NormalizedString(
          copiedMetadataBeatmap,
          LineEnding.crlf
        );
        await writeFile(selectedDestinationPaths[key], crlfBeatmap.value);
      });

      return await sendNotification({
        notificationColor: "primary",
        notificationMessage: `Metadata exported successfully to ${copiedMetadataBeatmaps.length} beatmaps!`,
        notificationIcon: "check",
      });
    } catch (e) {
      console.log(e);
      return await sendNotification({
        notificationColor: "error",
        notificationMessage:
          "An error occourred while copying hitosunds: " + e.getMessage(),
        notificationIcon: "error",
      });
    }
  };
</script>

<div>
  <header class="responsive fixed top" id="top-app-bar1">
    <h6 class="row max">
      Metadata Manager
      <div class="max" />
      <button
        on:click={exportMetadataAction}
        class="extend square round small-elevate"
      >
        <i>upload</i>
        <span>Export Metadata</span>
      </button>
    </h6>
    <div class="small-divider" />
  </header>
  <div class="responsive padding scroll">
    <FileInput
      textLabel="Beatmap you want to import the metadata from"
      bind:selected={selectedOriginPaths}
      bind:defaultFilePath={selectedDestinationPaths}
    >
      <button class="small-round" on:click={importMetadataAction}>
        <i>download</i>
        <span>Import</span>
      </button>
    </FileInput>
    <FileInput
      textLabel="Beatmap(s) you want to export the metadata to"
      bind:selected={selectedDestinationPaths}
      isUnique={false}
      bind:defaultFilePath={selectedOriginPaths}
    />
    <div class="grid">
      <div class="surface-variant l7 m12 padding small-round elevate">
        <div class="row">
          <span>Metadata</span>
        </div>
        <div class="small-divider" />
        <div class="padding">
          <InputLine
            label="Artist"
            bind:value={metadataFields.metadata.artist}
          />
          <InputLine
            label="Romanized Artist"
            bind:value={metadataFields.metadata.artistRomanized}
          />
          <InputLine label="Title" bind:value={metadataFields.metadata.title} />
          <InputLine
            label="Romanized Title"
            bind:value={metadataFields.metadata.titleRomanized}
          />
          <InputLine
            label="Source"
            bind:value={metadataFields.metadata.source}
          />
          <InputLine
            label="Creator"
            bind:value={metadataFields.metadata.creator}
          />
          <InputLine label="Tags" bind:value={tagsValue} tags />
        </div>
      </div>
      <div class="surface-variant l5 m12 padding small-round elevate">
        <div class="row">
          <span>General</span>
        </div>
        <div class="small-divider" />
        <div class="padding">
          <InputLine
            bind:value={metadataFields.generalMetadata.previewTime}
            label="Preview Time"
            size={7}
          />
          <InputLine
            bind:value={metadataFields.generalMetadata.audioFileName}
            label="Audio Filename"
            size={7}
          />
          <InputLine
            bind:checked={metadataFields.generalMetadata.epilepsyWarning}
            checkbox
            label="Epilepsy warning"
            size={7}
          />
          <InputLine
            bind:checked={metadataFields.generalMetadata.widescreenStoryboard}
            checkbox
            label="Widescreen storyboard"
            size={7}
          />
          <InputLine
            bind:checked={metadataFields.generalMetadata
              .samplesMatchPlaybackRate}
            checkbox
            label="Samples match playback rate"
            size={7}
          />
        </div>
      </div>
    </div>
    <article class="surface-variant">
      <div class="row">
        <span>Colours</span>
      </div>
      <div class="small-divider" />
      <div class="padding">
        <InputLine
          bind:checked={enableBorderColour}
          description="This is an optional setting to override the default colour of the slider borders."
          checkbox
          label="Enable slider body override"
        />
        {#if enableBorderColour}
          <div class="row">
            <div class="field middle-align max">
              <nav>
                <div class="max">
                  <strong>Slider border colour</strong>
                </div>
                <span>
                  <ColorPicker
                    bind:value={metadataFields.beatmapColours
                      .sliderBorderColour}
                  />
                </span>
              </nav>
            </div>
          </div>
        {/if}
        <InputLine
          bind:checked={enableTrackColour}
          description="This is an optional setting to override the default colour of the slider tracks."
          checkbox
          label="Enable slider track override"
        />
        {#if enableTrackColour}
          <div class="row">
            <div class="field middle-align max">
              <nav>
                <div class="max">
                  <strong>Slider track colour</strong>
                </div>
                <span>
                  <ColorPicker
                    bind:value={metadataFields.beatmapColours.sliderTrackColour}
                  />
                </span>
              </nav>
            </div>
          </div>
        {/if}
        <div class="row">
          <span>Combos</span>
        </div>
        <div class="small-divider" />

        <div class="row">
          <ComboColorsSelector
            bind:colourArray={metadataFields.beatmapColours.comboColours}
          />
        </div>
      </div>
    </article>
    <article class="surface-variant">
      <div class="row">
        <span>Options</span>
      </div>
      <div class="small-divider" />
      <div class="padding">
        <InputLine
          bind:checked={options.removeDuplicates}
          checkbox
          label="Remove duplicate tags"
          description="Search for duplicate tags and remove them."
        />
        <InputLine
          bind:checked={options.resetBeatmapIDs}
          checkbox
          label="Reset beatmap IDs"
          description="Useful for resetting the ids of the beatmap so you can submit it as a new beatmap."
        />
      </div>
    </article>
  </div>
  <div
    class="toast {toastColor}"
    class:active={hasNotification}
    id="notificacao"
  >
    <i>{toastIcon}</i>
    <span>{toastMessage}</span>
  </div>
</div>

<style>
</style>
