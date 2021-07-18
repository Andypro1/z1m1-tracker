<script>
    export let spriteIndex;
</script>

<div class="grid-elem">
    <div class="darken-bg"></div>
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
        <div class="icon sprite-index{spriteIndex}"></div>
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

<style type="scss">
    // * {
    //     outline: 1px solid #f00 !important;
    // }

    .grid-elem {
        --wu-double-size    : calc(var(--map-room-width) * 2px * 0.6);
        --wu-large-size     : calc(var(--map-room-width) * 1px * 0.6);
        --wu-small-size     : calc(var(--map-room-width) * 0.3px * 0.6);
        --wu-sprite-size    : calc(var(--map-room-width) * 0.2px * 0.6);
        --wu-sprite2-size   : calc(var(--map-room-width) * 0.2px * 0.8 * 0.6);
        --wu-sprite3-size   : calc(var(--map-room-width) * 0.2px * 0.6 * 0.6);
        --wu-glow-size      : calc(var(--map-room-width) * 0.875px * 0.6);
        --wu-glow-small-size: calc(var(--map-room-width) * 0.8125px * 0.6);
        --wu-glow-radius    : calc(var(--map-room-width) * 0.025px * 0.6);
        --wu-inset-shadow   : calc(var(--map-room-width) * 0.25px * 0.6);

        --wu-anim-duration  : 2s;
        --wu-anim-delay2    : 0.1s;
        --wu-anim-delay3    : 0.3s;
        --wu-anim-delay-glow: 0.35s;

        --wu-margin-adjust: calc(var(--map-room-width) * -0.1px);

        z-index: -10;
        overflow: hidden;
    }

    .grid-elem {
        align-self: center;
        justify-self: center;
        position: absolute;

        top: 0; bottom: 0; left: 0; right: 0;
        margin: auto var(--wu-margin-adjust);

        display: flex;
        justify-content: center;
        align-items: center;

        width: var(--wu-double-size);

        :global(.region.overlay) & {
            width: inherit;
            margin: auto auto;
        }
    }

    .darken-bg {
        position: absolute;
        width: 85%;
        height: 100%;
        background-color: #000a;
        margin: 0;

        :global(.region.overlay) & {
            width: 100%;
        }
    }

    .bg-elem {
        z-index: 1;
        width: var(--wu-double-size);
        height: var(--wu-large-size);

        transform: scaleX(0.8);

        border-radius: 50% 50%;
        overflow: hidden;

        position: absolute;
    }

    .deform  {
        align-self: center;

        width: var(--wu-large-size);
        height: var(--wu-large-size);
        transform: scaleX(1.6);
        background-color: transparent;
        position: relative;
        border-radius: 50%;
        z-index: 1;
    }

    .deform-glow  {
        align-self: center;

        width: var(--wu-large-size);
        height: var(--wu-large-size);
        transform: scaleX(1.6);
        background-color: transparent;
        position: absolute;
        border-radius: 50%;
        z-index: 1;
    }

    .rotate {
        width: 100%;
        height: 100%;
        animation: circle var(--wu-anim-duration) infinite linear;    
        transform-origin: 50% 50%;
        position: absolute;
    }

    .rotate2 {
        width: 100%;
        height: 100%;
        animation: circle var(--wu-anim-duration) infinite var(--wu-anim-delay2) linear;    
        transform-origin: 50% 50%;
        position: absolute;
    }

    .rotate3 {
        width: 100%;
        height: 100%;
        animation: circle var(--wu-anim-duration) infinite var(--wu-anim-delay3) linear;    
        transform-origin: 50% 50%;
        position: absolute;
    }

    .rotate-glow {
        width: 100%;
        height: 100%;
        animation: circle var(--wu-anim-duration) infinite var(--wu-anim-delay-glow) linear;    
        transform-origin: 50% 50%;
        position: absolute;

        z-index: -50;
    }

    .counterrotate {
        width: var(--wu-small-size);
        height: var(--wu-small-size);
        animation: ccircle var(--wu-anim-duration) infinite linear;    
    }

    .counterrotate2 {
        width: var(--wu-small-size);
        height: var(--wu-small-size);
        animation: ccircle var(--wu-anim-duration) infinite var(--wu-anim-delay2) linear;    
    }

    .counterrotate3 {
        width: var(--wu-small-size);
        height: var(--wu-small-size);
        animation: ccircle var(--wu-anim-duration) infinite var(--wu-anim-delay3) linear;    
    }

    .counterrotate-glow {
        width: var(--wu-glow-size);
        height: var(--wu-glow-size);
        animation: ccircle var(--wu-anim-duration) infinite var(--wu-anim-delay-glow) linear;    
        position: relative;
    }
        
    .inner {
        width: var(--wu-small-size);
        height: var(--wu-small-size);
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
        width: var(--wu-glow-size);
        height: var(--wu-glow-size);
        position: relative;
        left: 0px;
        top: 0px;
        display: block;
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
        width: var(--wu-sprite-size);
        height: var(--wu-sprite-size);
    }

    .sparkle2 {
        width: var(--wu-sprite2-size);
        height: var(--wu-sprite2-size);
    }

    .sparkle3 {
        width: var(--wu-sprite3-size);
        height: var(--wu-sprite3-size);
    }

    .glow {
        width: var(--wu-glow-small-size);
        height: var(--wu-glow-small-size);
        background-color: white;
        // transform: scaleX(1.0);
        border-radius: 50% 50%;
        filter: drop-shadow(0 0 var(--wu-glow-radius) rgb(255, 255, 220))
                drop-shadow(0 0 var(--wu-glow-radius) rgb(255, 255, 128));
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

    box-shadow: inset rgba(0,0,0,1) 0 0 var(--wu-inset-shadow) var(--wu-inset-shadow);
    border-radius: 50% 50%;

    position: absolute;
    width: var(--wu-double-size);
    height: var(--wu-large-size);

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