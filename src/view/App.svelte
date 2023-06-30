<script lang="ts">
  import { Route, Router } from "svelte-routing";
  import SideBar from "./lib/SideBar.svelte";
  import HitsoundCopier from "./tabs/HitsoundCopier.svelte";
  import Changelog from "./tabs/Changelog.svelte";
  import { onMount } from "svelte";
  import Toast from "./lib/Toast.svelte";
  import Settings from "./tabs/Settings.svelte";

  onMount(async () => {
    await ui("theme", "#c43b80");
  });
</script>

<Router url={"/home"}>
  <SideBar />
  <main class="surface responsive max">
    <Route path="/home" component={Changelog} />
    <Route path="/hs-copier" component={HitsoundCopier} />
    <Route path="/settings" component={Settings} />
  </main>
</Router>
<Toast />
