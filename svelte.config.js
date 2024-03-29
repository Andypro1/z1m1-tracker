//import { sveltePreprocess } from 'svelte-preprocess/dist/autoProcess.js';
import preprocess from "svelte-preprocess";
import adapter from '@sveltejs/adapter-netlify';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
		  postcss: true,
		}),
	  ],
	kit: {
		adapter: adapter(),
	}
};

export default config;
