<script>
  import { link } from "svelte-routing";

  const closeNav = () => {
    ui("#nav-main");
  };
</script>

<dialog class="left surface" id="nav-main">
  <header class="fixed">
    <nav>
      <button class="transparent circle large" on:click={closeNav}>
        <i>close</i>
      </button>
    </nav>
  </header>
  <a use:link let:active class="row round" href="/" on:click={closeNav}>
    <i>home</i>
    <span>Start</span>
  </a>
  <a use:link class="row round" href="/hs-copier" on:click={closeNav}>
    <i>file_copy</i>
    <span>Hitsound Copier</span>
  </a>
  <div class="small-divider" />
  <div class="row">Settings</div>
  <a a use:link class="row round" href="/settings" on:click={closeNav}>
    <i>settings</i>
    <span>Settings</span>
  </a>
</dialog>
