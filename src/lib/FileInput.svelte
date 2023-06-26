<script lang="ts">
  import { message, open } from "@tauri-apps/api/dialog";
  import { homeDir } from "@tauri-apps/api/path";

  let isFrom: boolean = true;
  let selected: string[] = [];

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
      multiple: !isFrom,
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

  export { isFrom, selected, defaultFilePath };
</script>

<div class="input-field">
  <span class="label">Copy HS {isFrom ? "from" : "to"}:</span>

  {#if selected.length <= 1}
    <div class="input-line">
      <input bind:value={selected[0]} type="text" />
      <button class="btn" on:click={selectFrom}>
        <span class="material-icons-round">file_open</span>
      </button>
    </div>
  {:else}
    {#each selected as selected_file, i}
      <div class="input-line">
        <input bind:value={selected[i]} type="text" />
        <span
          on:keydown={() => removeFromList(selected_file)}
          on:click={() => removeFromList(selected_file)}
        >
          <span class="material-icons-round">close</span>
        </span>
      </div>
    {/each}
  {/if}

  {#if selected.length > 0 && !isFrom}
    <span class="file-count">Selected {selected.length} file(s)</span>
    {#if selected.length > 1}
      <div class="btn-container">
        <button class="btn" on:click={appendToSelection}>
          <span class="material-icons-round">note_add</span> Add Files
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .input-field {
    color: #f2f2f2;
    flex-direction: column;
    display: flex;
    gap: 5px;
    padding-bottom: 10px;
  }
  .input-field > .label {
    font-size: 14px;
  }
  .input-line {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .input-line > span {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 7px 8px;
    margin-left: 5px;
    height: 100%;
  }
  .input-line > span > span {
    font-size: 18px;
  }
  .input-line > span:hover {
    color: #a7a7a7;
  }

  .input-line > input[type="text"] {
    border: none;
    border-radius: 0.5em;
    background-color: #2f2f2f;
    color: #b4b4b4;
    font-size: 14px;
    height: 35px;
    width: 600px;
    padding: 8px 5px;
  }
  .input-line > input[type="text"]:focus {
    outline: none;
  }

  .input-line > button > span {
    font-size: 16px;
  }

  .file-count {
    font-size: 12px;
    color: rgb(156, 156, 156);
  }
  .btn-container {
    margin-top: 10px;
    display: flex;
    justify-content: end;
  }

  .btn {
    border: none;
    border-radius: 0.5em;
    background-color: #585858;
    color: #f2f2f2;
    padding: 7px 8px;
    height: 35px;
    margin-left: 5px;
    display: flex;
    align-items: center;
  }
  .btn:hover {
    background-color: #515151;
  }
</style>
