<script lang="ts">
  import { Link } from "svelte-routing";

  let currentUrl = "";

  const updateUrl = (toRoute: string) => {
    currentUrl = toRoute;
  };
</script>

<nav class="m l left secondary">
  <header class="fixed" />
  <Link
    class="row round {currentUrl.includes('/home') ? 'active' : ''}"
    to="/home"
    on:click={() => updateUrl("/home")}
  >
    <i>home</i>
    <span>Start</span>
  </Link>
  <Link
    class="row round {currentUrl.includes('/hs-copier') ? 'active' : ''}"
    to="/hs-copier"
    on:click={() => updateUrl("/hs-copier")}
  >
    <i>file_copy</i>
    <span>Hitsound Copier</span>
  </Link>
  <Link
    class="row round {currentUrl.includes('/settings') ? 'active' : ''}"
    to="/settings"
    on:click={() => updateUrl("/settings")}
  >
    <i>settings</i>
    <span>Settings</span>
  </Link>
</nav>
