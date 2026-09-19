<script>
  export let spriteIndex;
</script>

<span class="portal" style={`--sprite-index:${spriteIndex}`} aria-hidden="true">
  <i class="glow"></i>
  <i class="icon"></i>
  <i class="sparkle one"></i>
  <i class="sparkle two"></i>
  <i class="sparkle three"></i>
</span>

<style>
  .portal {
    position: absolute;
    z-index: 1;
    left: 50%;
    top: 50%;
    width: min(96cqw, 190cqh);
    aspect-ratio: 2;
    transform: translate(-50%, -50%);
    isolation: isolate;
  }
  .portal::before {
    position: absolute;
    inset: -10% -2%;
    z-index: -2;
    border-radius: 50%;
    background: #000b;
    content: "";
  }
  .glow {
    position: absolute;
    inset: 8% 5%;
    z-index: -1;
    border-radius: 50%;
    background: #e7fbff;
    box-shadow:
      0 0 0.35rem 0.18rem #4ee5ff,
      inset 0 0 0.5rem 0.2rem #fff;
    animation: pulse 2s ease-in-out infinite;
  }
  .icon {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: url("/images/sprites-warp.png") no-repeat;
    background-size: auto 100%;
    background-position-x: calc(var(--sprite-index) * 100% / 17);
    box-shadow: inset 0 0 0.5rem 0.35rem #000;
    image-rendering: pixelated;
  }
  .sparkle {
    position: absolute;
    z-index: 2;
    width: 16%;
    aspect-ratio: 1;
    background: url("/images/sparkle.png") center / contain no-repeat;
    offset-anchor: center;
    offset-distance: 0%;
    offset-path: ellipse(46% 43% at 50% 50%);
    offset-rotate: 0deg;
    animation: orbit 2s linear infinite;
    filter: drop-shadow(0 0 0.15rem #fff7a8);
  }
  .two {
    width: 13%;
    animation-delay: -0.667s;
  }
  .three {
    width: 10%;
    animation-delay: -1.333s;
  }
  @keyframes pulse {
    50% {
      transform: scale(0.78);
      opacity: 0.65;
    }
  }
  @keyframes orbit {
    to {
      offset-distance: 100%;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .glow,
    .sparkle {
      animation-play-state: paused;
    }
  }
</style>
