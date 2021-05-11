<script>
	import { onMount } from 'svelte';
	import Hyruleq1 from './components/maps/Hyruleq1.svelte';
	import Level1 from './components/maps/Level1.svelte';
	import Level2 from './components/maps/Level2.svelte';
	import Kraids from './components/maps/Kraids.svelte';

	let curLevel = { name: 'Hyrule (Q1)', component: Hyruleq1};

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

	onMount(() => {
    });
</script>

<!-- <svelte:window on:resize="{handleResize}"/> -->

<main style="margin: auto; width: 100%; height: 100vh; display: flex; flex-direction: column; justify-content: space-between; align-content: space-around;">
	<section style="flex: 0 0; background-color: cyan;">
		<div style=" display: flex; flex-direction: column; justify-content: space-between; align-content: space-around;">
			<div style="flex: 1 0 auto;  height: 30px; background-color: olive;">tilesheet</div>
			<div style="flex: 1 0 auto;  height: 30px; background-color: olive;">tilesheet</div>
			<div style="flex: 1 0 auto;  height: 30px; background-color: olive;">tilesheet</div>
			<div style="flex: 1 0 auto;  height: 30px; background-color: olive;">tilesheet</div>
		</div>
	</section>
	<section style="flex: 0 0;">
		<svelte:component this={curLevel.component} name={curLevel.name} />
	</section>
	<section style="flex: 0 0; margin-top: 1rem;">
		<div style="display: flex; justify-content: space-between; align-content: space-around;">
			{#each areaMaps as map,index (index)}
				<div class="map" on:click={() => { curLevel = map; } }>{ map.name }</div>
		 	 {/each}
		</div>
	</section>
</main>

<style>
	.map {
		flex: 1 0 auto; margin: 1rem; width: 3rem; border: 1px solid red;
	}
</style>