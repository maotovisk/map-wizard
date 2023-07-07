<script lang="ts">
  import FileInput from "../lib/FileInput.svelte";

  import { exists, readTextFile, writeFile } from "@tauri-apps/api/fs";
  import { NormalizedString, LineEnding } from "@igor.dvlpr/normalized-string";
  import { copy } from "../../tools/hitsound-copier/main";

  let selectedFrom: string[] = [];
  let selectedTo: string[] = [];

  let removeMutingOption: boolean = true;
  let copySamplesOption: boolean = true;
  let copyVolumesOption: boolean = true;
  let overwriteNotDefinedOption: boolean = true;
  let timingThresholdOption: number = 5;

  let toastIcon: string = "";
  let toastMessage: string = "";
  let toastColor: string = "";

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

  const copyHitsoundsAction = async () => {
    try {
      if (selectedFrom.length == 0 || !(await exists(selectedFrom[0])))
        return await sendNotification({
          notificationColor: "error",
          notificationMessage: "Selected origin beatmap file not found",
          notificationIcon: "error",
        });

      const fromContent: string = await readTextFile(selectedFrom[0]);

      const arrayToPathExists = await Promise.all(
        selectedTo.map((path) => exists(path))
      );

      if (arrayToPathExists.includes(false)) {
        return await sendNotification({
          notificationColor: "error",
          notificationMessage:
            "Selected destination beatmap(s) file(s) not found",
          notificationIcon: "error",
        });
      }

      const toContent: string[] = await Promise.all(
        selectedTo.map((path) => readTextFile(path))
      );

      const copiedHitsound = await copy(fromContent, toContent, {
        timingThreshold: timingThresholdOption,
        removeMuting: removeMutingOption,
        copySamplesetChanges: copySamplesOption,
        copyVolumes: copyVolumesOption,
        overwriteNotDefined: overwriteNotDefinedOption,
      });

      copiedHitsound.forEach(async (hitsoundedBeatmap, key) => {
        // This encodes the beatmap to the windows CRLF formal.
        const crlfBeatmap = new NormalizedString(
          hitsoundedBeatmap,
          LineEnding.crlf
        );
        await writeFile(selectedTo[key], crlfBeatmap.value);
      });

      return await sendNotification({
        notificationColor: "primary",
        notificationMessage: `Hitsounds copied successfully to ${copiedHitsound.length} beatmaps!`,
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

<header class="responsive fixed top" id="top-app-bar1">
  <h6 class="row max">
    Hitsound Copier
    <div class="max" />
    <button
      class="extend square round small-elevate"
      on:click={copyHitsoundsAction}
    >
      <i>content_copy</i>
      <span>Copy Hitsound</span>
    </button>
  </h6>
  <div class="small-divider" />
</header>
<div class="padding">
  <FileInput
    textLabel="Beatmap you want to copy the hitsound from"
    bind:selected={selectedFrom}
    bind:defaultFilePath={selectedTo}
  />
  <FileInput
    textLabel="Beatmap(s) you want to copy the hitsound to"
    bind:selected={selectedTo}
    isUnique={false}
    bind:defaultFilePath={selectedFrom}
  />
  <article class="surface-variant">
    <div class="row">
      <span>Options</span>
    </div>
    <div class="small-divider" />
    <div class="row">
      <div class="field middle-align max">
        <nav>
          <div class="max">
            <strong>Remove muting</strong>
            <div>Removes the 5% volume greenlines</div>
          </div>
          <label class="switch">
            <input type="checkbox" bind:checked={removeMutingOption} />
            <span />
          </label>
        </nav>
      </div>
    </div>
    <div class="row">
      <div class="field middle-align max">
        <nav>
          <div class="max">
            <strong>Copy sampleset changes</strong>
            <div>Copy all the sampleset changes in greenlines</div>
          </div>
          <label class="switch">
            <input type="checkbox" bind:checked={copySamplesOption} />
            <span />
          </label>
        </nav>
      </div>
    </div>
    <div class="row">
      <div class="field middle-align max">
        <nav>
          <div class="max">
            <strong>Copy volumes changes</strong>
            <div>Copy all the volumes changes in greenlines</div>
          </div>
          <label class="switch">
            <input type="checkbox" bind:checked={copyVolumesOption} />
            <span />
          </label>
        </nav>
      </div>
    </div>
    <div class="row">
      <div class="field middle-align max">
        <nav>
          <div class="max">
            <strong>Ovewrite all hitsounds</strong>
            <div>
              All hitsounds not defined in the origin beatmap will also be not
              defined in the target
            </div>
          </div>
          <label class="switch">
            <input type="checkbox" bind:checked={overwriteNotDefinedOption} />
            <span />
          </label>
        </nav>
      </div>
    </div>
    <div class="row">
      <div class="field middle-align max">
        <nav>
          <div class="max">
            <strong>Timing threshould</strong>
            <div>
              Current threshould: {timingThresholdOption}ms
            </div>
          </div>
          <label class="slider">
            <input type="range" bind:value={timingThresholdOption} />
            <span />
          </label>
        </nav>
      </div>
    </div>
  </article>
</div>
<div class="toast {toastColor}" class:active={hasNotification} id="notificacao">
  <i>{toastIcon}</i>
  <span>{toastMessage}</span>
</div>

<style>
</style>
