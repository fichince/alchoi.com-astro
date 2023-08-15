<script lang="ts">
  import { onMount } from 'svelte';

  onMount(() => {

    const map = L.map('map').setView([51.505, -0.09], 13);
    /*
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);
    */

    L.tileLayer.provider('Stamen.Toner').addTo(map);

  });

</script>

<div id="map">
</div>

<style lang="scss">
  #map {
    height: 80vh;
  }
</style>