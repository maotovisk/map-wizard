<script lang="ts">
  let label = "";
  let value: string | number = "";
  let description: string = null;
  let size = 10;
  let checkbox = false;
  let checked = false;
  let tags = false;

  export { label, value, size, checkbox, checked, description, tags };
</script>

<div class="row">
  {#if !checkbox}
    <div class="field label max" class:textarea={tags}>
      {#if tags}
        <textarea bind:value />
      {:else}
        <input bind:value type="text" />
      {/if}
      <label class:active={value.toString().length > 0}>
        {label}
      </label>
    </div>
  {:else}
    <div class="field middle-align max">
      <nav>
        <div class="max">
          <strong>{label}</strong>
          {#if description}
            <div>{description}</div>
          {/if}
        </div>
        <label class="switch">
          <input type="checkbox" bind:checked />
          <span />
        </label>
      </nav>
    </div>
  {/if}
</div>
