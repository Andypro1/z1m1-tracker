<script>
</script>

<div class="grid">
    {#each [0,1,2,3,13,14,6,7,8] as i, pos}
        <div class="grid-elem">
            <div class="deform-glow">
                <div class="rotate-glow">
                    <div class="counterrotate-glow">
                        <div class="inner-glow">
                            <div class="glow"></div>
                        </div>
                    </div>
                </div>    
            </div>
        
            <div class="bg-elem">
                <div class="icon sprite-index{i}"></div>
            </div>

            <div class="deform">
                <div class="rotate">
                    <div class="counterrotate">
                        <div class="inner">
                            <div class="sparkle1"></div>
                        </div>
                    </div>
                </div>
                <div class="rotate2">
                    <div class="counterrotate2">
                        <div class="inner">
                            <div class="sparkle2"></div>
                        </div>
                    </div>
                </div>
                <div class="rotate3">
                    <div class="counterrotate3">
                        <div class="inner">
                            <div class="sparkle3"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/each}
</div>

<style type="scss">
    // * {
    //     outline: 1px solid #f00 !important;
    // }

    $largeSize: 8rem;
    $smallSize: 3 / 10 * $largeSize;
    $spriteSize: 2 / 3 * $smallSize;

    :global(body) {
        padding: 2rem;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
        justify-items: center;
        align-items: center;

        margin: auto;
        width: 90%;
        height: 90vh;
    }

    .grid-elem {
        align-self: center;
        justify-self: center;
        position: relative;

        display: flex;
        justify-content: center;
        align-items: center;

        width: $largeSize * 2;
        height: $largeSize * 2;
    }

    .bg-elem {
        z-index: 1;
        width: 2 * $largeSize;
        height: $largeSize;

        transform: scaleX(0.8);

        border-radius: 50% 50%;
        overflow: hidden;

        position: absolute;
    }

    .deform  {
        align-self: center;

        width: $largeSize;
        height: $largeSize;
        transform: scaleX(1.6);
        background-color: transparent;
        position: relative;
        border-radius: 50%;
        z-index: 1;
    }

    .deform-glow  {
        align-self: center;

        width: $largeSize;
        height: $largeSize;
        transform: scaleX(1.6);
        background-color: transparent;
        position: absolute;
        border-radius: 50%;
        z-index: 1;
    }

    .rotate {
        width: 100%;
        height: 100%;
        animation: circle 2s infinite linear;    
        transform-origin: 50% 50%;
        position: absolute;
    }

    .rotate2 {
        width: 100%;
        height: 100%;
        animation: circle 2s infinite 0.1s linear;    
        transform-origin: 50% 50%;
        position: absolute;
    }

    .rotate3 {
        width: 100%;
        height: 100%;
        animation: circle 2s infinite 0.3s linear;    
        transform-origin: 50% 50%;
        position: absolute;
    }

    .rotate-glow {
        width: 100%;
        height: 100%;
        animation: circle 2s infinite 0.35s linear;    
        transform-origin: 50% 50%;
        position: absolute;

        z-index: -50;
    }

    .counterrotate {
        width: $smallSize;
        height: $smallSize;
        animation: ccircle 2s infinite linear;    
    }

    .counterrotate2 {
        width: $smallSize;
        height: $smallSize;
        animation: ccircle 2s infinite 0.1s linear;    
    }

    .counterrotate3 {
        width: $smallSize;
        height: $smallSize;
        animation: ccircle 2s infinite 0.3s linear;    
    }

    .counterrotate-glow {
        width: 7rem;
        height: 7rem;
        animation: ccircle 2s infinite 0.35s linear;    
        position: relative;
    }
        
    .inner {
        width: $smallSize;
        height: $smallSize;
        position: absolute;
        left: 0px;
        top: 0px;
        display: block;
        transform: scaleX(0.5);
        
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .inner-glow {
        width: 7rem;
        height: 7rem;
        position: relative;
        left: 0px;
        top: 0px;
        display: block;
        // transform: scaleX(0.5);
        z-index: -10;
        
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .sparkle1, .sparkle2, .sparkle3 {
        background-image: url("/images/sparkle.png");
        background-size: cover;
    }

    .sparkle1 {
        width: $spriteSize;
        height: $spriteSize;
    }

    .sparkle2 {
        width: $spriteSize * .8;
        height: $spriteSize * .8;
    }

    .sparkle3 {
        width: $spriteSize * .6;
        height: $spriteSize * .6;
    }

    .glow {
        width: 6.5rem;
        height: 6.5rem;
        background-color: white;
        // transform: scaleX(1.0);
        border-radius: 50% 50%;
        filter: drop-shadow(0 0 0.2rem rgb(255, 255, 220))
                drop-shadow(0 0 0.2rem rgb(255, 255, 128));
        position: relative;

        z-index: -20;
        // background-image: url("/images/sparkle.png");
        // background-size: cover;
    }

    @keyframes circle {
        from {transform: rotateZ(0deg)}
        to {transform: rotateZ(360deg)}
    }

    @keyframes ccircle {
        from {transform: rotateZ(360deg)}
        to {transform: rotateZ(0deg)}
    }


  //  Icon art for each background type  \\
  .icon {
    transform: scaleX(1.2);

    box-shadow: inset rgba(0,0,0,1) 0 0 2rem 2rem;
    border-radius: 50% 50%;

    position: absolute;
    width: 2 * $largeSize;
    height: $largeSize;

    background: url(/images/sprites-warp.png) no-repeat;
    background-size: auto 100%;
    image-rendering: crisp-edges;
    image-rendering: pixelated;

    //  Class rules for each sprite in sprites-warp.png
    @for $i from 0 through 16 {
        &.sprite-index#{$i} {
            background-position: calc(#{$i} * 100% / 17);
        }
    }
  }
</style>