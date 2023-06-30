<script lang="ts">
  import { appWindow } from "@tauri-apps/api/window";
  import { getVersion } from "@tauri-apps/api/app";
  import { onMount } from "svelte";
  let maximized = false;
  let appVersion = "0.0.1";

  appWindow.onResized(async () => {
    maximized = await appWindow.isMaximized();
  });

  const openNav = () => {
    ui("#nav-main");
  };

  onMount(async () => {
    await ui("theme", "#c43b80");

    appVersion = await getVersion();
    maximized = await appWindow.isMaximized();
  });
</script>

<header class="fixed top surface-variant">
  <nav data-tauri-drag-region>
    <button on:click={openNav} class="circle transparent">
      <i>menu</i>
    </button>
    <div class="max" />

    <div class="max" />
    <div class="button-bar">
      <button on:click={appWindow.minimize} class="circle transparent">
        <img width="10px" alt="minimize" src="/window-icons/minimize.svg" />
      </button>
      {#if maximized}
        <button on:click={appWindow.unmaximize} class="circle transparent">
          <img
            width="10px"
            alt="unmaximize"
            src="/window-icons/unmaximize.svg"
          />
        </button>
      {:else}
        <button on:click={appWindow.maximize} class="circle transparent">
          <img width="10px" alt="maximize" src="/window-icons/maximize.svg" />
        </button>
      {/if}
      <button on:click={appWindow.close} class="circle transparent">
        <img width="10px" alt="close" src="/window-icons/close.svg" />
      </button>
    </div>
  </nav>
</header>

<style>
</style>
