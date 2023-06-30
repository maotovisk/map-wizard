<script lang="ts">
  import { Route, Router } from "svelte-routing";
  import HeaderBar from "./lib/HeaderBar.svelte";
  import SideBar from "./lib/SideBar.svelte";
  import HitsoundCopier from "./tabs/HitsoundCopier.svelte";
  import Changelog from "./tabs/Changelog.svelte";
</script>

<HeaderBar />
<SideBar />
<main class="surface responsive max">
  <Router>
    <Route path="/">
      <Changelog />
    </Route>
    <Route path="/hs-copier">
      <HitsoundCopier />
    </Route>
  </Router>
</main>
