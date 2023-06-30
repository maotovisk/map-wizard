<script lang="ts">
  import { onMount } from "svelte";
  import SvelteMarkdown from "svelte-markdown";
  import Handler from "../lib/Handler.svelte";

  let releases: unknown = null;
  onMount(async () => {
    let request = await fetch(
      "https://api.github.com/repos/maotovisk/hitsound-copier/releases"
    );
    releases = await request.json();
  });
</script>

<div class="padding">
  <h6>Latest updates</h6>
  <div class="small-divider" />
  {#if releases && Array.isArray(releases)}
    {#each releases as release}
      <article class="surface-variant">
        <details>
          <summary class="none">
            <div class="row">
              <i>update</i>
              <div class="max">
                <h6>{release.name}</h6>
              </div>
              <i>arrow_drop_down</i>
            </div>
            <div class="row">
              <p>{release.tag_name}</p>
            </div>
          </summary>
          <p class="padding">
            <SvelteMarkdown
              source={release.body}
              renderers={{ heading: Handler, link: Handler }}
            />
          </p>
        </details>
      </article>
    {/each}
  {:else}
    <div class="row center-align middle-align"><a class="loader" /></div>
  {/if}
</div>
