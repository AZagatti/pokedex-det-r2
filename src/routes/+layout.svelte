<script lang="ts">
	import '$lib/styles/global.css';

	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col bg-gray-50">
	{@render children()}
</div>


