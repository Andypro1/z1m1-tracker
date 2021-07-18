<script>
    export let spriteIndex;
</script>

<div class="shop-underlay">
    <div class="icon sprite-index{spriteIndex}"></div>
</div>

<style type="scss">
    // * {
    //     outline: 1px solid #f00 !important;
    // }

  .shop-underlay {
      position: absolute;
      top: 0; left: 0; bottom: 0; right: 0;
      margin: auto;

      width: calc(var(--map-room-width) * 1px);
      height: calc(var(--map-room-height) * 1px);
  }


  //  Icon art for each background type  \\
  .icon {
    // transform: scaleX(1.2);

    // box-shadow: inset rgba(0,0,0,1) 0 0 var(--wu-inset-shadow) var(--wu-inset-shadow);
    // border-radius: 50% 50%;

    position: absolute;
    width: calc(var(--map-room-width) * 1px);
    height: calc(var(--map-room-height) * 1px);

    background: url(/images/sprites-warp.png) no-repeat;
    background-size: auto 100%;
    image-rendering: crisp-edges;
    image-rendering: pixelated;

    //  Class rules for each sprite in sprites-warp.png
    @for $i from 0 through 16 {
        &.sprite-index#{$i} {
            background-position: calc(#{$i} * 100% / 17.1);
        }
    }
  }
</style>