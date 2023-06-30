<script lang="ts">
  import { open } from "@tauri-apps/api/dialog";
  import { homeDir } from "@tauri-apps/api/path";

  let isUnique: boolean = true;
  let selected: string[] = [];
  let textLabel: string = "Choose a file";

  let defaultFilePath: string[] = null;

  const selectFrom = async () => {
    let defaultPath = await homeDir();

    if (defaultPath && defaultFilePath && defaultFilePath.length > 0) {
      defaultPath = defaultFilePath[0].substring(
        0,
        defaultFilePath[0].lastIndexOf("/")
      );
    }
    const selectedFiles = await open({
      multiple: !isUnique,
      directory: false,
      defaultPath: defaultPath,
      filters: [
        {
          name: "osu! beatmap",
          extensions: ["osu"],
        },
      ],
    });

    if (selectedFiles === null) {
      selected = [];
      return;
    }

    if (Array.isArray(selectedFiles)) {
      selected = selectedFiles;
      return;
    }

    selected = [selectedFiles];
  };

  const appendToSelection = async () => {
    const rawSelect = await open({
      multiple: true,
      directory: false,
      filters: [
        {
          name: "osu! beatmap",
          extensions: ["osu"],
        },
      ],
    });

    if (!rawSelect) return;

    const selectedFiles = Array.isArray(rawSelect) ? rawSelect : [rawSelect];

    const uniqueSelectedFiles = new Set([...selected, ...selectedFiles]);
    selected = [...uniqueSelectedFiles];
  };

  const removeFromList = (elementToRemove: string) => {
    selected = selected.filter((elem) => elem !== elementToRemove);

    return true;
  };

  export { isUnique, selected, defaultFilePath, textLabel };
</script>

{#if selected.length <= 1}
  <div class="row">
    <div class="field label max">
      <input type="text" bind:value={selected[0]} />
      <label>{textLabel}</label>
    </div>
    <button class="transparent circle" on:click={selectFrom}>
      <i>file_open</i>
    </button>
  </div>
{:else}
  <div class="row">
    <span>{textLabel}</span>
  </div>
  {#each selected as selected_file, i}
    <div class="row">
      <div class="field max">
        <input type="text" bind:value={selected[i]} />
      </div>
      <button
        class="transparent circle"
        on:click={() => removeFromList(selected_file)}
      >
        <i>close</i>
      </button>
    </div>
  {/each}
{/if}

{#if selected.length > 0 && !isUnique}
  <div class="row">
    <span>Selected {selected.length} file(s)</span>
    {#if selected.length > 1}
      <div class="max" />
      <button class="circle extra" on:click={appendToSelection}>
        <i>add</i>
      </button>
    {/if}
  </div>
{/if}

<style>
</style>
