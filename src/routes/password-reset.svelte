<script>
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import { validatePasswords } from '../utils/form-validation';

	let currentUser = $session.user;
	console.log(currentUser);
	let currentPassword = '';
	let password1 = '';
	let password2 = '';
	let passwordError = '';
	let errorMessage = '';

	function isFormValid() {
		passwordError = validatePasswords(password1, password2);
		return passwordError === '';
	}

	function clearData() {
		password1 = '';
		password2 = '';
		passwordError = '';
	}

	async function isCurrentPasswordCorrect() {
		if (currentPassword === '') {
			passwordError = 'The current password is empty!';
			return false;
		}
		const res = await fetch('api/user-credentials', {
			method: 'POST',
			body: JSON.stringify({ userId: currentUser._id, password: currentPassword })
		});
		console.log(res);
		if (res.ok) {
			const json = await res.json();
			console.log('checkCurrentPassword', json);
			return json.checkCredentials;
		} else {
			console.log(res.error);
			errorMessage = 'Error resetting the password. Please try again!';
		}
		return false;
	}

	async function resetPassword() {
		if (!(await isCurrentPasswordCorrect())) {
			passwordError = 'Current password is incorrect!';
			return;
		}
		if (!isFormValid()) return;

		const res = await fetch('api/user', {
			method: 'PUT',
			body: JSON.stringify({ userId: currentUser._id, credentials: { password: password1 } })
		});
		if (res.ok) {
			const json = await res.json();
			console.debug('password-reset', json);
			clearData();
			console.info('The password was changed successfully!');
			goto('/');
		} else {
			console.log(res.error);
			errorMessage = 'Error resetting the password. Please try again!';
		}
	}
</script>

<h1 class="font-bold text-xl text-indigo-600 text-center mt-4">Password reset</h1>
<div class="w-full max-w-xs mx-auto mt-4">
	<form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
		<div class="mb-4">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="username"> Username </label>
			<input
				class="shadow appearance-none cursor-not-allowed border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="username"
				type="text"
				disabled
				bind:value={currentUser.email}
			/>
		</div>
		<div class="mb-4">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="currentPassword"
				>Current password
			</label>
			<input
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="currentPassword"
				type="password"
				placeholder="******************"
				bind:value={currentPassword}
			/>
		</div>
		<div class="mb-4">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="password1"
				>New password
			</label>
			<input
				class:border-red-500={passwordError !== '' && password1 === ''}
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="password1"
				type="password"
				placeholder="******************"
				bind:value={password1}
			/>
			{#if passwordError !== '' && password1 === ''}
				<p class="text-red-500 mt -2 text-xs italic">{passwordError}</p>
			{/if}
		</div>
		<div class="mb-6">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="password2">
				Confirm new password
			</label>
			<input
				class:border-red-500={passwordError !== '' && password2 === ''}
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="password2"
				type="password"
				placeholder="******************"
				bind:value={password2}
			/>
			{#if passwordError !== ''}
				<p class="text-red-500 mt-2 text-xs italic">{passwordError}</p>
			{/if}
		</div>
		<div class="flex items-center justify-between">
			<button
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 mr-2 rounded focus:outline-none focus:shadow-outline"
				type="button"
				on:click={resetPassword}
			>
				Reset password
			</button>
			<a
				class="inline-block align-baseline font-bold ml-2 text-sm text-blue-500 hover:text-blue-800"
				href="/login"
			>
				Already have an account?
			</a>
		</div>
	</form>
</div>
