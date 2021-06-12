<script>
	import { actions } from '../services/tracker.js';
   	import toolbars from './toolbars.js';

    //  Props
    export let set = 'overworld';

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
</script>

<div class="toolbars">
    {#each $toolbars.getMainToolbar(set) as tb, index (index)}
        <div class="toolbar">
            {#each tb.actions as action}
                <div class="action {tbActionClass(action).name}"
                    on:mousedown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        //  Use left, middle, right, and forward buttons if available (not back)
                        if(e.button >= 0 && e.button !== 3)
							actions.setPosition(action.name, e.button);
                    }}
                >{ action.display }
                <aside class:mouse-overlay={tbActionClass(action).name} data-before={tbActionClass(action).keycap}></aside>
				<aside class:key-overlay={action.hotkeys} data-before={action.hotkeys[0]}></aside>
            </div>
            {/each}
        </div>
      {/each}
</div>

<style type="scss">
    @import "../styles/overlays.scss";

    .toolbars {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-content: space-around;
	}

	.toolbar {
		flex: 1 0 auto;

		display: flex;
		align-content: center;
		align-items: center;

		margin: 0.2rem;
	}

	.toolbar .action {
		margin: 0.3rem;
		background-color: hsl(0, 0%, 0%);

		background:
			linear-gradient(217deg, rgba(32,32,32, 0.8), rgba(255,0,0,0) 70.71%),
			linear-gradient(127deg, rgba(160,160,160, 0.8), rgba(0,255,0,0) 70.71%),
			linear-gradient(336deg, rgba(0,0,100, 0.5), rgba(0,0,255,0) 70.71%);

		color: white;
		padding: 1rem;
		width: 6rem;
		height: 6rem;
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
			// border: 1rem solid hsl(197, 38%, 30%);
			// content: '';
			// position: absolute;
			// top: 0;
			// left: 0;
			// width: 100%;
			// height: 100%;
			// padding: 0;

			position: relative;

			&:before {
				// border: 1rem solid hsl(197, 38%, 30%);
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				box-shadow: 0 0 17px 3px #ffff01,0 0 4px 2px #ffff01;
				// z-index: -1;
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
</style>