<script lang="ts">
  import { Route, Router } from "svelte-routing";
  import SideBar from "./lib/SideBar.svelte";
  import HitsoundCopier from "./tabs/HitsoundCopier.svelte";
  import Changelog from "./tabs/Changelog.svelte";
  import { onMount } from "svelte";
  import Settings from "./tabs/Settings.svelte";
  import { appWindow } from "@tauri-apps/api/window";

  onMount(async () => {
    await ui("theme", "#c43b80");
    const mode = await appWindow.theme();
    await ui("mode", mode);
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
    <Route path="/settings">
      <div class="page active"><Settings /></div>
    </Route>
  </main>
</Router>
