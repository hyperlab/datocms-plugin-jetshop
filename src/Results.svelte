<script>
  import { items } from "./store";

  export let results = [];
  let active;

  $: if (results) {
    active = results[0];
  }

  function handleKeyDown(event) {
    const { keyCode } = event;
    const activeIndex = results.findIndex((result) => result.id === active);

    if (keyCode === 38) {
      // Arrow up
      if (activeIndex > 0) {
        active = results[activeIndex - 1];
      } else {
        active = results[results.length - 1];
      }
    } else if (keyCode === 40) {
      // Arrow down
      if (activeIndex + 1 < results.length) {
        active = results[activeIndex + 1];
      } else {
        active = results[0];
      }
    } else if (keyCode === 13) {
      // Enter
      items.update((val) =>
        val.concat({
          source: 'jetshop',
          type: active.type,
          id: active.id,
        })
      );
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

{#if results.length > 0}
  <ul>
    {#each results as result (result.id)}
      <li
        class:active={active === result}
        class:selected={$items.find((item) => item.id === result.id)}
        on:mouseenter={() => (active = result)}
        on:click={() =>
          items.update((val) =>
            val.concat({
              source: 'jetshop',
              type: result.type,
              id: result.id,
            })
          )}
      >
        {#if result.image}<img
            src={`${result.image}?extend=copy&width=32&method=crop&height=32&quality=100`}
            alt="Summary"
          />{/if}
        <h3>{result.title}</h3>
        <span>{result.type}</span>
      </li>
    {/each}
  </ul>
{:else}
  No results were found.
{/if}

<style>
  ul {
    display: block;
    list-style-type: none;
    margin-top: 4px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0.1) 0px 4px 11px;
    padding: 4px 0;
  }

  li {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 12px;
    line-height: 1.5;
  }

  li img {
    margin: -0.5em 0.5em -0.5em -0.3em;
    width: 32px;
    height: 32px;
  }

  li span {
    text-transform: capitalize;
    margin-left: 1em;
    font-size: 0.75em;
    color: #848484;
  }

  li.active {
    background-color: var(--semi-transparent-accent-color);
  }

  li.selected {
    background-color: var(--accent-color);
    color: #fff;
  }
</style>
