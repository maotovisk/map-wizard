<script lang="ts">
  import { onMount } from "svelte";

  let darkMode: boolean = true;
  const onChange = async () => {
    ui("mode", darkMode ? "dark" : "light");
    await ui("theme", "#046494");
  };

  onMount(async () => {
    darkMode = ui("mode") == "dark" ? true : false;
  });
</script>

<div class="padding">
  <h6>Settings</h6>
  <div class="small-divider" />
  <div class="row max">
    <div class="row max">
      <div class="field middle-align max">
        <nav>
          <div class="max">
            <strong>Dark mode</strong>
            <div>Enable dark mode for the applicaiton</div>
          </div>
          <label class="switch">
            <input
              type="checkbox"
              bind:checked={darkMode}
              on:change={onChange}
            />
            <span />
          </label>
        </nav>
      </div>
    </div>
  </div>
</div>
