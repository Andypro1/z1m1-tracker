<script>
</script>

<div class="grid">
    {#each [0,1,2,3,4,5,6,7,8] as i, pos}
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
        
            <div class="deform">
                <div class="icon sprite-index{i}"></div>
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
                            <div class="sparkle1"></div>
                        </div>
                    </div>
                </div>
                <div class="rotate3">
                    <div class="counterrotate3">
                        <div class="inner">
                            <div class="sparkle1"></div>
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

    // $largeSize: 90%;
    $largeSize: 8rem;
    $smallSize: 3 / 10 * $largeSize;
    $spriteSize: 2 / 3 * $smallSize;
    // $spriteSize2: 2 / 3 * $spriteSize;
    // $spriteSize3: 2 / 3 * $spriteSize;

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

        width: $largeSize;
        height: $largeSize;
    }

    .deform  {
        align-self: center;

        // width: 4rem;
        // height: 4rem;
        width: $largeSize;
        height: $largeSize;
        margin: 0 $largeSize/2;
        transform: scaleX(1.6);
        background-color: lightblue;
        //left: 270px;
        position: absolute;
        //top: 50px;
        border-radius: 50%;
        z-index: 1;
    }

    .deform-glow  {
        align-self: center;

        // width: 4rem;
        // height: 4rem;
        width: $largeSize;
        height: $largeSize;
        margin: 0 $largeSize/2;
        transform: scaleX(1.6);
        background-color: lightblue;
        //left: 270px;
        position: absolute;
        //top: 50px;
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
        animation: circle 2s infinite 0.3s linear;    
        transform-origin: 50% 50%;
        position: absolute;
    }

    .rotate3 {
        width: 100%;
        height: 100%;
        animation: circle 2s infinite 0.5s linear;    
        transform-origin: 50% 50%;
        position: absolute;
    }

    .rotate-glow {
        width: 100%;
        height: 100%;
        animation: circle 2s infinite 0.45s linear;    
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
        animation: ccircle 2s infinite 0.3s linear;    
    }

    .counterrotate3 {
        width: $smallSize;
        height: $smallSize;
        animation: ccircle 2s infinite 0.5s linear;    
    }

    .counterrotate-glow {
        width: 7rem;
        height: 7rem;
        animation: ccircle 2s infinite 0.45s linear;    
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

    .sparkle1 {
        width: $spriteSize;
        height: $spriteSize;
        background-image: url("/images/sparkle.png");
        background-size: cover;
    }

    .glow {
        width: 6.5rem;
        height: 6.5rem;
        background-color: white;
        transform: scaleX(1.0);
        border-radius: 50% 50%;
        filter: drop-shadow(0 0 0.5rem rgb(255, 255, 220))
                drop-shadow(0 0 0.5rem rgb(255, 255, 128));
        position: relative;

        z-index: -20;
        // background-image: url("/images/sparkle.png");
        // background-size: cover;
    }

    @-webkit-keyframes circle {
        from {transform: rotateZ(0deg)}
        to {transform: rotateZ(360deg)}
    }

    @-webkit-keyframes ccircle {
        from {transform: rotateZ(360deg)}
        to {transform: rotateZ(0deg)}
    }


  //  Icon art for each background type  \\
  .icon {
    position: absolute;
    width: $largeSize;
    height: $largeSize;
    // z-index: -300;
    overflow: hidden;

    top: 0; left: 0; right: 0; bottom: 0;
    margin: auto;

    background: url(/images/spites-warp.png) no-repeat;
    background-size: auto 100%;
    image-rendering: crisp-edges;
    image-rendering: pixelated;

    //  Class rules for each sprite in spites-warp.png
    @for $i from 0 through 14 {
        &.sprite-index#{$i} {
            background-position: calc(#{$i} * 100% / 17);
        }
    }
  }
</style>