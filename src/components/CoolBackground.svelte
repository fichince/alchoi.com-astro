<script lang="ts">
  export let animate : boolean = false;
</script>

<div class="absolute top-0 left-0 w-screen h-screen overflow-hidden">
  <div class="homepage w-full h-full bg-cover scale-110 animate-blur-in blur-sm">
  </div>
  <div class="absolute 
    top-1/4 left-1/4 
    w-1/2 h-1/2 min-h-[450px]
    m-auto 
    bg-gradient-to-br from-primary to-secondary rounded-3xl"
    class:animate-fade-in={animate}>

    <slot></slot>
  </div>
</div>

<style lang="postcss">
  .homepage {
    background-image: url(/images/wedge-pond.jpg);
  }
</style>