<script context="module">
	export async function get() {
		return {
			headers: { Location: '/Start' },
			status: 301
		};
	};
</script>