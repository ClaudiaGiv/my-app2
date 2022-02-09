<script>
	import '../app.postcss';
	import '../app.css';
	import Header from '$lib/Header/index.svelte';
</script>

<Header />
<main>
	<div class="h-full bg-indigo-100">
		<div class="container px-4 mx-auto">
			<slot />
		</div>
	</div>
</main>
<footer>

</footer>
