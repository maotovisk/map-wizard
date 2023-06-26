<script lang="ts">
  import FooterBar from "./lib/FooterBar.svelte";
  import HeaderBar from "./lib/HeaderBar.svelte";
  import FileInput from "./lib/FileInput.svelte";
  import { exists, readTextFile, writeFile } from "@tauri-apps/api/fs";
  import { message } from "@tauri-apps/api/dialog";
  import { copy } from "./copier/main";

  const DEBUG = true;

  let selectedFrom: string[] = [
    "/home/maot/.local/share/osu-wine/osu!/Songs/1950809 SiM - UNDER THE TREE(1)/SiM - UNDER THE TREE (Stixy) [Dream].osu",
  ];
  let selectedTo: string[] = [
    "/home/maot/.local/share/osu-wine/osu!/Songs/1950809 SiM - UNDER THE TREE(1)/SiM - UNDER THE TREE (Stixy) [ROSIIE'S INSANE].osu",
  ];

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
        timingThreshold: 5,
        removeMuting: true,
        copySamplesetChanges: true,
        copyVolumes: true,
        overwriteNotDefined: true,
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
</style>
