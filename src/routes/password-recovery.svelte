<script>
	import { goto } from '$app/navigation';

	let username = '';
	let usernameError = false;

	async function recoverPassword() {
		if (username === '') {
			usernameError = true;
			return;
		}
		usernameError = false;
	}
	$: console.log(username);
</script>

<h1 class='font-bold text-xl text-indigo-600 text-center mt-4'>Password recovery</h1>
<div class='w-full max-w-xs mx-auto mt-4'>
	<form class='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
		<div class='mb-4'>
			<label class='block text-gray-700 text-sm font-bold mb-2' for='username'> Username </label>
			<input
				class:border-red-500={usernameError && username === ''}
				class='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
				id='username'
				type='text'
				placeholder='Username'
				bind:value={username}
			/>
			{#if usernameError && username === ''}
				<p class='text-red-500 text-xs italic'>Please provide a valid username.</p>
			{/if}
		</div>
		<div class='flex items-center justify-between'>
			<button
				class='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline'
				type='button'
				on:click={recoverPassword}
			>
				Recover password
			</button>
		</div>
	</form>
</div>
