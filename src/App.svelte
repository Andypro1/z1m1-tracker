<script>
	import { onMount } from 'svelte';
	import Hyruleq1 from './components/maps/Hyruleq1.svelte';
	import Level1 from './components/maps/Level1.svelte';
	import Level2 from './components/maps/Level2.svelte';
	import Level3 from './components/maps/Level3.svelte';
	import Level4 from './components/maps/Level4.svelte';
	import Level5 from './components/maps/Level5.svelte';
	import Level6 from './components/maps/Level6.svelte';
	import Level7 from './components/maps/Level7.svelte';
	import Level8 from './components/maps/Level8.svelte';
	import Level9 from './components/maps/Level9.svelte';
	import Kraids from './components/maps/Kraids.svelte';
	import '@fortawesome/fontawesome-free/css/all.css';
	
	const areaMaps = [
		{ name: 'Hyrule (Q1)', component: Hyruleq1},
		{ name: 'Level 9 (Q1)', component: Level9},
		{ name: 'Shops', component: Level1},
		{ name: 'Potion shops', component: Level2},
		{ name: 'Level 1 (Q1)', component: Level1},
		{ name: 'Level 5 (Q1)', component: Level5},
		{ name: 'Level 2 (Q1)', component: Level2},
		{ name: 'Level 6 (Q1)', component: Level6},
		{ name: 'Level 3 (Q1)', component: Level3},
		{ name: 'Level 7 (Q1)', component: Level7},
		{ name: 'Level 4 (Q1)', component: Level4},
		{ name: 'Level 8 (Q1)', component: Level8},
		{ name: 'Kraid\'s', component: Kraids},
		{ name: 'Ridley\'s', component: Hyruleq1},
		{ name: 'Brinstar', component: Hyruleq1},
		{ name: 'Norfair', component: Hyruleq1}
	];

	$: areaPairs = areaMaps.reduce((a,v,i,o) => {
			if(i % 2 === 0)
				a.push(o.slice(i, i+2));
				return a;
		}, []);
	
	let curLevel = areaMaps.filter(a => a.name === 'Hyrule (Q1)')[0];
	
	const toolbars = [
		{ name: 'dungeon', actions: ['cleared', 'warp', 'equip', 'quest'] },
		{ name: 'overworld', actions: ['cleared', 'warp', 'shop', 'potionShop', 'lockedSword', 'equip', 'quest'] }
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
	<section class="top-bar">
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
	<section class="map-section">
		<svelte:component this={curLevel.component} name={curLevel.name} bind:action={curLCAction} bind:action2={curRCAction} />
	</section>
	<section class="area-cards" style="">
		{#each areaPairs as map,index (index)}
			<div class="area-card-column">
				<div class="area-card" on:click={() => { curLevel = map[0]; } }>{ map[0].name }</div>
				<div class="area-card" on:click={() => { curLevel = map[1]; } }>{ map[1].name }</div>
			</div>
		{/each}
	</section>
</main>

<style global lang="scss">
	main {
		margin: auto;
		width: 96%;
		height: 96vh;
		font-family: 'Baloo 2', cursive;
		font-weight: 400;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-content: space-around;
	}

	.top-bar {
		flex: 0 0;

		display: flex;
		justify-content: space-between;
		align-items: flex-end;
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

	.map-section {
		flex: 0 0;
	}

	.area-cards {
		flex: 0 0; margin-top: 1rem;

		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: space-between;
		align-items: auto;
		align-content: stretch;

		font-weight: 600;
	}

	.area-card-column {
		flex: 1 0 auto;
		margin: 2px;
	}

	.area-card {
		background-color: #ddd;
		cursor: pointer;
		padding: 1rem;
	}
</style>