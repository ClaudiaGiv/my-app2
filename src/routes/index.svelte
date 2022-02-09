<script context='module'>


	export async function load({ fetch }) {
		console.log('Board');
		const res = await fetch('/board1');
		if (res.ok) {
			const board1 = await res.json();

			return {
				props: { board1: board1 }
			};
		}
		return {
			status: res.status,
			error: new Error()
		};
	}
</script>
<script>
	export let board1;
	console.log('----board----', board1);
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href='https://kit.svelte.dev'>kit.svelte.dev</a> to read the documentation</p>
