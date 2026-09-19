<script>
  export let spriteIndex;
</script>

<i class="shop" style={`--sprite-index:${spriteIndex}`} aria-hidden="true"></i>

<style>
  .shop {
    position: absolute;
    z-index: 1;
    left: 50%;
    top: 50%;
    width: min(94cqw, 180cqh);
    aspect-ratio: 2;
    transform: translate(-50%, -50%);
    background: url("/images/sprites-warp.png") no-repeat;
    background-size: auto 100%;
    background-position-x: calc(var(--sprite-index) * 100% / 17);
    image-rendering: pixelated;
  }
</style>
