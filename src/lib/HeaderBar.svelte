<script lang="ts">
  import { appWindow } from "@tauri-apps/api/window";
  import { onMount } from "svelte";
  let maximized = false;

  appWindow.onResized(async () => {
    maximized = await appWindow.isMaximized();
  });

  onMount(async () => {
    maximized = await appWindow.isMaximized();
  });
</script>

<div class="header-bar">
  <div data-tauri-drag-region class="title">
    <span class="title-text">Hitsound Copier v0.0.1</span>
  </div>
  <div
    class="titlebar-button"
    id="titlebar-minimize"
    on:click={appWindow.minimize}
    on:keypress={appWindow.minimize}
  >
    <img alt="minimize" src="/window-icons/minimize.svg" />
  </div>
  {#if maximized}
    <div
      class="titlebar-button"
      id="titlebar-unmaximize"
      on:click={appWindow.unmaximize}
      on:keypress={appWindow.unmaximize}
    >
      <img alt="unmaximize" src="/window-icons/unmaximize.svg" />
    </div>
  {:else}
    <div
      class="titlebar-button"
      id="titlebar-maximize"
      on:click={appWindow.maximize}
      on:keypress={appWindow.maximize}
    >
      <img alt="maximize" src="/window-icons/maximize.svg" />
    </div>
  {/if}
  <div
    class="titlebar-button"
    id="titlebar-close"
    on:click={appWindow.close}
    on:keypress={appWindow.close}
  >
    <img alt="close" src="/window-icons/close.svg" />
  </div>
</div>

<style>
  .titlebar-button > img {
    fill: #000;
  }
  .title {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: start;
    padding-left: 10px;
  }
  .title-text {
    text-shadow: #323232;
    font-size: 12px;
    font-weight: bold;
    width: auto;
  }
  .header-bar {
    background-color: rgb(87, 87, 87);
    color: #f2f2f2;
    user-select: none;
    display: flex;
    justify-content: flex-end;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
  .titlebar-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
  }

  .titlebar-button:hover {
    background: #434343;
  }
</style>
