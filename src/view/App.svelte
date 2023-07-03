<script lang="ts">
  import { Route, Router } from "svelte-routing";
  import SideBar from "./lib/SideBar.svelte";
  import HitsoundCopier from "./tabs/HitsoundCopier.svelte";
  import Changelog from "./tabs/Changelog.svelte";
  import { onMount } from "svelte";
  import Settings from "./tabs/Settings.svelte";
  import { appWindow } from "@tauri-apps/api/window";
  import MetadataManager from "./tabs/MetadataManager.svelte";

  onMount(async () => {
    const mode = await appWindow.theme();
    await ui("mode", mode);
    await ui("theme", "#046494");
  });
</script>

<Router url={"/home"}>
  <SideBar />
  <main class="surface responsive max">
    <Route path="/home">
      <div class="page active"><Changelog /></div>
    </Route>
    <Route path="/hs-copier">
      <div class="page active"><HitsoundCopier /></div>
    </Route>
    <Route path="/metadata-manager">
      <div class="page active"><MetadataManager /></div>
    </Route>
    <Route path="/settings">
      <div class="page active"><Settings /></div>
    </Route>
  </main>
</Router>
