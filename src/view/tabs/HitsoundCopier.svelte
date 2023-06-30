<script lang="ts">
  import FileInput from "../lib/FileInput.svelte";

  import { exists, readTextFile, writeFile } from "@tauri-apps/api/fs";
  import { message } from "@tauri-apps/api/dialog";
  import { copy } from "../../tools/hitsound-copier/main";

  let selectedFrom: string[] = [];
  let selectedTo: string[] = [];

  let removeMutingOption: boolean = true;
  let copySamplesOption: boolean = true;
  let copyVolumesOption: boolean = true;
  let overwriteNotDefinedOption: boolean = true;
  let timingThresholdOption: number = 5;

  const copyHitsoundsAction = async () => {
    try {
      if (selectedFrom.length == 0 || !(await exists(selectedFrom[0])))
        return message("Origin beatmap file not found", {
          title: "Hitsound Copier",
          type: "error",
        });

      const fromContent: string = await readTextFile(selectedFrom[0]);

      const arrayToPathExists = await Promise.all(
        selectedTo.map((path) => exists(path))
      );

      if (arrayToPathExists.includes(false)) {
        return message("Selected destination beatmap not found", {
          title: "Hitsound Copier",
          type: "error",
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

      await message(
        `Hitsounds copied successfully to ${copiedHitsound.length} beatmaps!`,
        {
          title: "Done!",
        }
      );

      copiedHitsound.forEach(async (hitsoundedBeatmap, key) => {
        await writeFile(selectedTo[key], hitsoundedBeatmap);
      });
    } catch (e) {
      console.log(e);
      return message(e, { title: "Hitsound Copier", type: "error" });
    }
  };
</script>

<div class="padding">
  <h6>Hitsound Copier</h6>
  <div class="small-divider" />
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
  <div class="row">
    <span>Options</span>
  </div>
  <div class="small-divider" />
  <article class="surface-variant">
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
  <div class="row">
    <div class="max" />
    <button class="extend square round" on:click={copyHitsoundsAction}>
      <i>check</i>
      <span>Copy Hitsound</span>
    </button>
  </div>
</div>

<style>
</style>
