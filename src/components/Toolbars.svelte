<script>
	import { actions } from '../services/tracker.js';
   	import toolbars from './toolbars.js';

    //  Props
    export let set = 'overworld';

    $: tbActionClass = (action) => {
        const keycaps = {
            0: 'LC',
            1: 'MC',
            2: 'RC',
            4: '>C'
        };

        const i = $actions.findIndex(e => e === action);

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
							actions.setPosition(action, e.button);
                    }}
                >{ action }
                <aside class="key-overlay" class:hide-overlay={!tbActionClass(action).name} data-before={tbActionClass(action).keycap}></aside>
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
		margin: 0.1rem;
		background-color: hsl(197, 38%, 76%);
		padding: 1rem;
		width: 8rem;
		height: 4.4rem;
		border-radius: 0.5rem;

		display: flex;
		justify-content: center;
		align-items: flex-end;
	}

	.action {
		position: relative;
		text-align: center;
		font-size: 1rem;
		font-weight: 600;
		overflow: hidden;


		&.button0:before,
		&.button1:before,
		&.button2:before,
		&.button3:before,
		&.button4:before {
			border: 1rem solid hsl(197, 38%, 30%);
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			padding: 0;
		}

		&:hover {
		z-index: 10;
		cursor: pointer;

		filter: drop-shadow(10px 10px 10px var(--shadow-color));
		-webkit-animation: scale-up-center 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
		animation: scale-up-center 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
	}

		&.button0 {
			//border: 1rem solid hsl(197, 38%, 30%);
			filter: drop-shadow(4px 4px 4px hsla(244, 100%, 30%, 50%));
		}

		&.button1 {
			border: 2px solid hsl(244, 100%, 30%);
			filter: drop-shadow(4px 4px 4px hsla(244, 100%, 30%, 50%));
		}

		&.button2 {
			border: 2px solid hsl(244, 100%, 30%);
			filter: drop-shadow(4px 4px 4px hsla(244, 100%, 30%, 50%));
		}

		&.button3 {
			border: 2px solid hsl(244, 100%, 30%);
			filter: drop-shadow(4px 4px 4px hsla(244, 100%, 30%, 50%));
		}

		&.button4 {
			border: 2px solid hsl(244, 100%, 30%);
			filter: drop-shadow(4px 4px 4px hsla(244, 100%, 30%, 50%));
		}
	}
</style>