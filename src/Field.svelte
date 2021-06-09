<script>
  import Results from "./Results.svelte";
  import { search, get } from "./jetshop";
  import { items } from "./store";

  export let contentTypes = [],
    placeholder = "Search term",
    minItems = 0,
    maxItems = -1;
  let results = [];

  async function change(e) {
    const value = e.target.value;

    if (value.length >= 2) {
      results = await search(value, contentTypes);
    } else {
      results = [];
    }
  }

  function deselect(id) {
    items.update((val) => val.filter((item) => item.id !== id));
  }

  $: promise = $items ? get($items) : null;
</script>

{#if minItems === 0 && maxItems > -1}
  <span>Select up to {maxItems} items</span>
{:else if minItems === 0 && maxItems === -1}
  <span>Select any number of items</span>
{:else if minItems > 0 && maxItems !== -1}
  <span>Select between {minItems} and {maxItems} items</span>
{/if}

{#if promise}
  {#await promise}
    <p>Loading...</p>
  {:then items}
    <div class="items">
      {#each items as item}
        <div class="card">
          {#if item.image}
            <img
              src={`${item.image}?extend=copy&width=128&method=crop&height=128&quality=100`}
              alt="Summary"
            />
          {/if}
          <div class="details">
            <span>{item.type}</span>
            <h3>{item.title}</h3>
            <div class="controls">
              <a href={item.url} target="_blank">View on site</a>
              <button on:click={() => deselect(item.id)}
                ><svg
                  height="20"
                  width="20"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  focusable="false"
                  class="css-19bqh2r"
                  ><path
                    d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"
                  /></svg
                ></button
              >
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/await}
{/if}

{#if maxItems === -1 || $items.length < maxItems}
  <div class="field">
    <input type="text" {placeholder} on:input={change} />
  </div>
  {#if results.length}
    <Results {results} />
  {/if}
{/if}

<style>
  .items {
    display: flex;
    flex-direction: row;
  }

  .card {
    display: flex;
    flex-direction: row;
  }

  .card img {
    width: 64px;
    height: 64px;
  }

  .card .details {
    display: flex;
    flex-direction: column;
    margin-left: 0.5rem;
  }

  .card .details span {
    text-transform: capitalize;
    color: #848484;
    line-height: 1.2;
    font-size: 0.75rem;
  }

  .card .details .controls {
    display: flex;
    flex-direction: row;
  }

  .card .details .controls button {
    border: none;
    background: transparent;
    padding: 4px;
    margin: -4px;
    margin-left: 0;
    cursor: pointer;
  }

  .field {
    position: relative;
  }

  input::placeholder {
    color: rgb(215, 215, 215);
  }
</style>
