<script lang="ts">
  import { Color4 } from "osu-classes";

  import ColorPicker from "./ColorPicker.svelte";

  const COLOUR_GROUP_MAX_SIZE = 8;

  const addColour = () => {
    console.log(colourArray);
    if (colourArray.length === 0) {
      colourArray = [new Color4(255, 255, 255, 1)];
      return;
    }
    if (colourArray.length < 8)
      colourArray = [
        new Color4(255, 255, 255, 1),
        ...colourArray.splice(1, colourArray.length - 1),
        colourArray[0],
      ];
  };

  const removeColour = () => {
    if (colourArray.length > 1) {
      colourArray = [
        colourArray[colourArray.length - 1],
        ...colourArray.splice(1, colourArray.length - 2),
      ];
    } else {
      colourArray = [];
    }
  };

  let colourArray: Color4[] = [];

  export { colourArray };
</script>

<div class="grid max">
  <div class="s11 max">
    {#each colourArray as color, i}
      {#if i > 0}
        <ColorPicker colorIndex={i} value={color} />
      {/if}
    {/each}
    {#if colourArray.length > 0}
      <ColorPicker
        colorIndex={colourArray.length}
        bind:value={colourArray[0]}
      />
    {/if}
  </div>
  <div class="s1 max right-align">
    <button class="circle transparent" on:click={addColour}>
      <i>add</i>
    </button>
    <button class="circle transparent" on:click={removeColour}>
      <i>remove</i>
    </button>
  </div>
</div>
