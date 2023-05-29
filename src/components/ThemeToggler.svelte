<script lang="ts">
  import { onMount } from 'svelte';
  import { getTheme, toggleTheme } from '@src/scripts/theme';

  let theme : string;

  onMount(() => {
    theme = getTheme();
  });

  // original codepen: https://codepen.io/alvarotrigo/pen/zYPydpB
</script>

<div class="toggle-switch">
  <label>
    <input type="checkbox" 
      checked={theme === 'light'} 
      on:change={() => theme = toggleTheme()} />
    <span class="slider"></span>
  </label>
</div>

<style lang="scss">
  .toggle-switch {

    position: relative;
    width: 200px;

    label {
      position: absolute;
      width: 100%;
      height: 100px;
      background-color: var(--primary);
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
      border-radius: 50px;
      transition: 0.3s;
    }

    input:checked ~ .slider {
      background-color: var(--secondary);
    }

    .slider::before {
      content: "";
      position: absolute;
      top: 13px;
      left: 16px;
      width: 75px;
      height: 75px;
      border-radius: 50%;
      box-shadow: inset 28px -4px 0px 0px var(--secondary);
      background-color: var(--primary);
      transition: 0.3s;
    }

    input:checked ~ .slider::before {
      transform: translateX(95px);
      background-color: var(--primary);
      box-shadow: none;
    }

  }
</style>
