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
</script>

<header class="fixed top surface-variant">
  <nav data-tauri-drag-region>
    <button on:click={openNav} class="circle transparent">
      <i>menu</i>
    </button>
    <div class="max" />

    <div class="max" />
    <div class="button-bar">
      <button class="circle transparent">
        <img width="10px" alt="close" src="/window-icons/close.svg" />
      </button>
    </div>
  </nav>
</header>

<style>
</style>
