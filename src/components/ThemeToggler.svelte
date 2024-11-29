<script lang="ts">
  import { onMount } from 'svelte';
  import { getTheme, toggleTheme } from '@src/scripts/theme';

  let theme : string = $state();

  onMount(() => {
    theme = getTheme();
  });

  // original codepen: https://codepen.io/alvarotrigo/pen/zYPydpB
</script>

<div class="toggle-switch">
  <label>
    <input type="checkbox" 
      checked={theme === 'light'} 
      onchange={() => theme = toggleTheme()} />
    <span class="slider"></span>
  </label>
</div>

<style lang="scss">
  .toggle-switch {

    --_height: 30px;

    position: relative;
    width: calc(2 * var(--_height));
    height: var(--_height);

    label {
      position: absolute;
      width: 100%;
      height: var(--_height);
      background-color: var(--colour-background);
      border-radius: 50px;
      cursor: pointer;
    }

    input {
      position: absolute;
      display: none;
    }

    .slider {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: calc(0.5 * var(--_height)); 
      border: 1px solid var(--colour-foreground);
      transition: 0.3s;
    }

    input:checked ~ .slider {
      background-color: var(--colour-foreground);
    }

    .slider::before {
      content: "";
      position: absolute;
      top: calc(0.13 * var(--_height));
      left: calc(0.16 * var(--_height));
      width: calc(0.75 * var(--_height));
      height: calc(0.75 * var(--_height));
      border-radius: 50%;

      --_shadow-h: calc(0.28 * var(--_height));
      --_shadow-v: calc(-0.04 * var(--_height));
      box-shadow: inset var(--_shadow-h) var(--_shadow-v) 0px 0px var(--colour-foreground);

      background-color: var(--colour-background);
      transition: 0.3s;
    }

    input:checked ~ .slider::before {
      transform: translateX(calc(0.95 * var(--_height)));
      background-color: var(--colour-background);
      box-shadow: none;
    }

  }
</style>
