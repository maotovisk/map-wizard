<script lang="ts">
  import FooterBar from "./lib/FooterBar.svelte";
  import HeaderBar from "./lib/HeaderBar.svelte";
  import FileInput from "./lib/FileInput.svelte";
  import Checkbox from "@smui/checkbox";
  import { exists, readTextFile, writeFile } from "@tauri-apps/api/fs";
  import { message } from "@tauri-apps/api/dialog";
  import { copy } from "./copier/main";

  const DEBUG = true;

  let selectedFrom: string[] = [];
  let selectedTo: string[] = [];

  let removeMutingOption: boolean = true;
  let copySamplesOption: boolean = true;
  let copyVolumesOption: boolean = true;
  let overwriteNotDefinedOption: boolean = true;
  let timingThresholdOption: number = 5;

  const copyHitsounds = async () => {
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

      //aq aocntece algo
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

<main class="container">
  <div class="main-grid">
    <HeaderBar />
    <div class="content">
      <FileInput
        bind:selected={selectedFrom}
        bind:defaultFilePath={selectedTo}
      />
      <FileInput
        bind:selected={selectedTo}
        isFrom={false}
        bind:defaultFilePath={selectedFrom}
      />
      <div class="options-field">
        <span>Options</span>
        <hr class="header" />
        <ul class="options">
          <li>
            <input type="checkbox" bind:checked={removeMutingOption} />
            <span>Remove muting (5% volumes)</span>
          </li>
          <li>
            <input type="checkbox" bind:checked={copySamplesOption} />
            <span>Copy sampleset changes (greenlines)</span>
          </li>
          <li>
            <input type="checkbox" bind:checked={copyVolumesOption} />
            <span>Copy volumes changes (greenlines)</span>
          </li>
          <li>
            <input type="checkbox" bind:checked={overwriteNotDefinedOption} />
            <span>Ovewrite not defined hitsounds</span>
          </li>
          <li>
            <input type="range" bind:value={timingThresholdOption} />
            <span>Timing threshould ({timingThresholdOption}ms)</span>
          </li>
        </ul>
      </div>
      <div class="action-field">
        <button class="btn" on:click={copyHitsounds}>Copy Hitsound</button>
      </div>
      <FooterBar />
    </div>
  </div>
</main>

<style>
  .container {
    height: 100vh;
  }
  .main-grid {
    margin: 0px;
    padding: 0px;
    margin-top: 40px;
    margin-bottom: 25px;
    height: 100%;
    display: grid;
    grid-template:
      "content" 100%
      / 1fr;
  }

  .content {
    background-color: rgb(66, 66, 66);
    grid-area: content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: auto;
    height: 100%;
    min-width: 340px;
  }
  .action-field {
    display: flex;
    width: 100%;
    max-width: 600px;
    justify-content: end;
  }

  .action-field > .btn {
    border: none;
    border-radius: 0.5em;
    background-color: #5bcd81;
    color: rgb(255, 255, 255);
    font-weight: bold;
    padding: 10px 8px;
  }
  .action-field > .btn:hover {
    background-color: #42995f;
  }

  .options-field {
    min-height: 120px;
    width: 100%;
    max-width: 600px;
  }
  .options-field > span {
    font-size: 12px;
    color: #8d8d8d;
  }
  .options-field > .header {
    border: 0;
    border-bottom: 1px solid #8d8d8d;
    margin-bottom: 5px;
  }

  .options {
    color: #f2f2f2;
  }
  .options > li {
    list-style: none;
  }
</style>
