<script>
	import { actions } from '../services/tracker.js';
   	import toolbars from './toolbars.js';

    //  Props
    export let set = 'overworld';

	$: curSubTb = $toolbars.getCurrentSubBarName();

	//  TODO: move.
    $: tbActionClass = (action) => {
        const keycaps = {
            0: 'LC',
            1: 'MC',
            2: 'RC',
            4: '>C'
        };

        const i = $actions.findIndex(e => e === action.name);

        return {
            name: i >= 0 ? `button${i}` : '',
            keycap: keycaps[i]
        };
    };

	const tbclick = (e, action) => {
		e.preventDefault();
		e.stopPropagation();

		//  Use left, middle, right, and forward buttons if available (not back)
		if(e.button >= 0 && e.button !== 3) {
			actions.setPosition(action.name, e.button);
			
			$toolbars.setSubToolbar(action.name);
			$toolbars = $toolbars;
		}
	};

	const tbhover = (e, action) => {
		$toolbars.setSubToolbar(action.name);
		curSubTb = curSubTb;
	};
</script>

<!-- <div class="toolbars"> -->
    {#each $toolbars.getMainToolbar(set) as tb, index (index)}
        <div class="toolbar">
            {#each tb.actions as action}
                <div class="action {action.name} {tbActionClass(action).name}"
					class:active-tb={curSubTb === action.name}
                    on:mousedown={(e) => tbclick(e, action)}
					on:mouseover={(e) => tbhover(e, action)}
                >
					{#if action.spriteIndex }
						<div class="icon {action} sprite-index{action.spriteIndex}"></div>
					{:else}
						{ action.display }
					{/if}
					
					<div class="tb-backdrop"></div>
					<aside class:mouse-overlay={tbActionClass(action).name} data-before={tbActionClass(action).keycap}></aside>
					<aside class:key-overlay={action.hotkeys} data-before={action.hotkeys[0]}></aside>
				</div>
            {/each}
        </div>

		{#each $toolbars.getSubToolbar() as stb}
			<div class="sub toolbar {curSubTb}">
				{#each stb.actions as action}
					<div class="action {tbActionClass(action).name}"
						on:mousedown={(e) => {
							e.preventDefault();
							e.stopPropagation();
	
							//  Use left, middle, right, and forward buttons if available (not back)
							if(e.button >= 0 && e.button !== 3)
								actions.setPosition(action.name, e.button);
						}}
					>
						{#if action.spriteIndex && (typeof action.warpText === 'undefined') }
							<div class="icon sprite-index{action.spriteIndex}"></div>
						{:else}
							{ action.display }
						{/if}
	
						{#if action.mapText }
							<div class:label={action.mapText}>
								<b>{action.mapText}</b>
							</div>
						{/if}
	
						<div class="tb-backdrop"></div>
						<aside class:mouse-overlay={tbActionClass(action).name} data-before={tbActionClass(action).keycap}></aside>
						<aside class:key-overlay={action.hotkeys} data-before={action.hotkeys}></aside>
					</div>
				{/each}
			</div>
		{/each}
	{/each}
<!-- </div> -->

<style type="scss">
    @import "../styles/overlays.scss";

	.toolbar {
		flex: 0 0 auto;

		display: grid;
		grid-template-rows: 1fr 1fr;
		grid-template-columns: 1fr 1fr 1fr;
		justify-content: flex-start;
		align-items: flex-start;

		margin: 0rem;

		& .action.cleared { grid-area: 1 / 1; }
		& .action.notYetAcquired { grid-area: 1 / 2; }
		& .action.shop { grid-area: 1 / 3; }
		& .action.warp { grid-area: 2 / 1; }
		& .action.equip { grid-area: 2 / 2; }
		& .action.quest { grid-area: 2 / 3; }
	}

	.toolbar .action {
		margin: 0.3rem;
		background-color: hsl(0, 0%, 0%);

		background:
			linear-gradient(217deg, rgba(32,32,32, 0.8), rgba(255,0,0,0) 70.71%),
			linear-gradient(127deg, rgba(160,160,160, 0.8), rgba(0,255,0,0) 70.71%),
			linear-gradient(336deg, rgba(0,0,100, 0.5), rgba(0,0,255,0) 70.71%);

		&.active-tb {
			background: none;
		}

		color: white;
		padding: 1rem;
		width: 4.8rem;
		height: 4.8rem;
		border-radius: 0.5rem;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.action {
		position: relative;
		text-align: center;
		font-size: 1rem;
		font-weight: 600;

		&.button0,
		&.button1,
		&.button2,
		&.button4 {
			position: relative;

			&:before {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				box-shadow: 0 0 17px 3px #ffff01,0 0 4px 2px #ffff01;
				z-index: 9999;
				border-radius: 5px;
			}
		}

		&:hover {
			z-index: 10;
			cursor: pointer;

			filter: drop-shadow(8px 8px 8px var(--shadow-color));
			-webkit-animation: scale-up-center 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
			animation: scale-up-center 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
		}
	}

	//  Undue subdued filters on the background when hovering
	.action:hover .tb-backdrop, .active-tb.action .tb-backdrop {
		filter: none;
	}

	.tb-backdrop {
		position: absolute;
		left: 0; right: 0; top: 0; bottom: 0;
		width: 100%;
		height: 100%;
		z-index: -10;

		border-radius: 0.5rem;

		.warp & {
			background-image: url("/images/tb.action.warp.png");
			background-size: contain;

			filter: contrast(35%) grayscale(60%);
		}

		.equip & {
			background-image: url("/images/tb.action.equip.png"), linear-gradient(rgba(185, 174, 110, 0.329),rgba(185, 174, 110, 0.329));
			background-blend-mode: overlay;
			background-size: contain;

			filter: contrast(35%) grayscale(25%);
		}

		.quest & {
			background-image: url("/images/tb.action.quest.png"), linear-gradient(rgba(214, 178, 20, 0.329),rgba(214, 179, 20, 0.329));
    		background-blend-mode: overlay;
			background-size: contain;

			filter: brightness(75%);
		}
	}

	//  Override toolbar styles for subtoolbars
	.sub.toolbar {
		flex: 1 0;

		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		// height: 100%;
		// max-width: calc(100vw - 20rem - 24rem);
		max-height: 11.5rem;

		justify-content: stretch;
		align-items: stretch;

		& .action:before {
			content: '';
			// float: left;
			padding-top: 100%;
		}

		& .action {
			margin: 0.15rem;

			padding: 1rem;
			width: 3.5rem;
			height: 3.5rem;
		}
	}


  //  TODO: Below are dupes with Overlay - draw out and refactor
  //  Icon art for each equipment type  \\
  .icon {
    position: absolute;
	width: 80%;
    height: 80%;
    z-index: 10;

    top: 0; left: 0; right: 0; bottom: 0;
    margin: auto;

    background: url(/images/sprites-16px.png) no-repeat;
    background-size: auto 100%;
    image-rendering: crisp-edges;
    image-rendering: pixelated;

    //  Class rules for each sprite in sprites-16px.png
	@for $i from 0 through 39 {
		&.sprite-index#{$i} {
			background-position: calc(#{$i} * 100% / 61.5);
		}
	}
  }

  .label {
      width: 100%;
      height: 100%;
      position: absolute;
	  z-index: 20;
	  padding-top: 0.25rem;

      color: rgb(255, 255, 255);
      font-size: 2.5rem;
      white-space: nowrap;
      overflow: hidden;
	  opacity: 1;

      display: flex;
      justify-content: center; /* align horizontal */
      align-items: center; /* align vertical */
  }
</style>