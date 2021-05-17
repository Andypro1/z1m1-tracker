<script>
	import { onMount } from 'svelte';
	import Hyruleq1 from './components/maps/Hyruleq1.svelte';
	import Level1 from './components/maps/Level1.svelte';
	import Level2 from './components/maps/Level2.svelte';
	import Kraids from './components/maps/Kraids.svelte';
	import '@fortawesome/fontawesome-free/css/all.css'
	
	const areaMaps = [
		{ name: 'Hyrule (Q1)', component: Hyruleq1},
		{ name: 'Level 1 (Q1)', component: Level1},
		{ name: 'Level 2 (Q1)', component: Level2},
		{ name: 'Level 3 (Q1)', component: Hyruleq1},
		{ name: 'Level 4 (Q1)', component: Hyruleq1},
		{ name: 'Level 5 (Q1)', component: Hyruleq1},
		{ name: 'Level 6 (Q1)', component: Hyruleq1},
		{ name: 'Level 7 (Q1)', component: Hyruleq1},
		{ name: 'Level 8 (Q1)', component: Hyruleq1},
		{ name: 'Level 9 (Q1)', component: Hyruleq1},
		{ name: 'Brinstar', component: Hyruleq1},
		{ name: 'Norfair', component: Hyruleq1},
		{ name: 'Kraid\'s Lair', component: Kraids},
		{ name: 'Ridley\'s Hideout', component: Hyruleq1}
	];
	
	let curLevel = areaMaps.filter(a => a.name === 'Hyrule (Q1)')[0];
	
	const toolbars = [
		{ name: 'dungeon', actions: ['cleared', 'warp', 'equip', 'quest'] },
		{ name: 'overworld', actions: ['cleared', 'warp', 'shop', 'potion-shop', 'locked-sword', 'equip', 'quest'] }
	];

	let curToolbars = toolbars;//.filter(tb => tb.name === 'overworld');
	let curLCAction = 'cleared';
	let curRCAction = 'warp';

    //  Dynamic style vars
    let styles = {
      'shadow-color': 'rgb(128, 128, 128)'
    };

    $: cssVarStyles = Object.entries(styles)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');

	onMount(() => {
    });
</script>

<svelte:window on:contextmenu="{(e) => e.preventDefault()}"/>
<svelte:head>
	<link rel="prefetch" href="/images/hyrule-q1-halfscale.png">
	<link rel="prefetch" href="/images/dungeons-halfscale.png">
	<link rel="prefetch" href="/images/zebes-quarterscale.png">
</svelte:head>

<main style="{cssVarStyles}">
	<section style="flex: 0 0;">
		<div class="toolbars">
			{#each curToolbars as tb,index (index)}
				<div class="toolbar">
					{#each tb.actions as action,index (index)}
						<div class="action" class:lcselected={ curLCAction === action }
							class:rcselected={ curRCAction === action }
							on:click={() => { curLCAction = action; }}
							on:contextmenu={(e) => { curRCAction = action }}
						>{ action }</div>
					{/each}
				</div>
		 	 {/each}
		</div>
	</section>
	<section style="flex: 0 0;">
		<svelte:component this={curLevel.component} name={curLevel.name} bind:action={curLCAction} />
	</section>
	<section style="flex: 0 0; margin-top: 1rem;">
		<div class="map-card-grid">
			{#each areaMaps as map,index (index)}
				<div class="map-card" on:click={() => { curLevel = map; } }>{ map.name }</div>
		 	 {/each}
		</div>
	</section>
</main>

<style>
	main {
		margin: auto;
		width: 100%;
		height: 100vh;
		
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-content: space-around;
	}

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
		background-color: beige;
		padding: 0.8rem;
		width: 3.0rem;
		height: 3.0rem;
		border-radius: 0.4rem;
	}

	.action:hover {
		z-index: 10;
		cursor: pointer;

		filter: drop-shadow(10px 10px 10px var(--shadow-color));
		-webkit-animation: scale-up-center 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
		animation: scale-up-center 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
	}

	.action.lcselected {
		border: 1px dotted red;
	}

	.action.rcselected {
		border: 1px dotted blue;
	}

	.map-card-grid {
		display: grid;
		grid-gap: 2px;
		grid-template-columns: repeat(auto-fill, 10rem);

		font-family: 'Baloo 2', cursive;
		font-weight: 600;
	}

	.map-card {
		background-color: #ddd;
		height: 5rem;
		border-radius: 1rem;
		cursor: pointer;
		padding: 1rem;
		text-align: center;
	}
</style>