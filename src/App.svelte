<script>
	import { Router, Route } from "svelte-routing";
	import Tracker from "./routes/Tracker.svelte";
	import Start from "./routes/Start.svelte";
	// import Blog from "./routes/Options.svelte";
  
	export let url = '';
  </script>
  
  <Router url="{url}">
	<Route path="solo" component="{Tracker}" />
	<Route path="coop/:coopGuid" component="{Tracker}" />
	<!-- <Route path="options" component="{Options}" /> -->
	<Route path="/"><Start /></Route>
  </Router>