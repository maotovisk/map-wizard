<script lang="ts">
  import { Color4 } from "osu-classes";
  import hexRgb from "hex-rgb";

  let value: Color4 = new Color4(255, 255, 255, 1);
  let colorIndex: number = undefined;
  let colorHex: string = value.hex;

  let colorInput: HTMLElement;
  const changeColor = () => {
    colorInput.click();
  };

  $: convertColour(value);

  const convertColour = (value: Color4) => {
    if (value) colorHex = value.hex;
  };

  const transferValue = () => {
    let convertedRgb = hexRgb(colorHex);

    value.red = convertedRgb.red;
    value.green = convertedRgb.green;
    value.blue = convertedRgb.blue;
    value.alpha = convertedRgb.alpha;
  };

  export { value, colorIndex };
</script>

<button
  on:click={changeColor}
  class="{colorIndex != undefined
    ? 'round surface elevate'
    : 'circle transparent'} margin extra"
>
  <div>
    <svg viewBox="450 0 900 900" class="circle small elevate">
      <rect fill={colorHex} width="1600" height="900" />
    </svg>
  </div>
  {#if colorIndex != undefined}
    <span class="">Combo {colorIndex}</span>
  {/if}
  {#if value !== null && value !== undefined}
    <input
      type="color"
      name="color"
      id="color"
      on:change={transferValue}
      bind:value={colorHex}
      bind:this={colorInput}
      style="width: 0; height: 0; padding: 0; position: fixed; top: 0; left: 0;"
    />
  {/if}
</button>
