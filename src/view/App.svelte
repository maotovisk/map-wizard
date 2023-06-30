<script lang="ts">
  import { Route, Router } from "svelte-routing";
  import SideBar from "./lib/SideBar.svelte";
  import HitsoundCopier from "./tabs/HitsoundCopier.svelte";
  import Changelog from "./tabs/Changelog.svelte";
  import { onMount, setContext, tick } from "svelte";

  onMount(async () => {
    await ui("theme", "#c43b80");
  });
</script>

<Router>
  <SideBar />
  <main class="surface responsive max">
    <Route path="/home">
      <Changelog />
    </Route>
    <Route path="/hs-copier">
      <HitsoundCopier />
    </Route>
    <Route path="/settings" />
  </main>
</Router>
