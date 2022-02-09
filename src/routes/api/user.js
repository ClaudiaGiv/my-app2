import { REGISTER_USER_MUTATION, RESET_USER_PASSWORD_MUTATION } from '../../graphql/user';
import { FAUNA_API, FAUNA_KEY } from './api-utils';

export async function post(req) {
	let variables = await req.request.json();
	const query = REGISTER_USER_MUTATION;
	let response;
	await fetch(FAUNA_API.toString(), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: FAUNA_KEY.toString()
		},
		body: JSON.stringify({
			query,
			variables
		})
	})
		.then((res) => res.json())
		.then((result) => {
			console.debug('User POST result', result);
			response = result.data.register;
		})
		.catch((e) => {
			console.error('User POST:', e);
		});
	//TODO: fix unique error when deserializing the result
	// console.log('user-register', response)
	return {
		body: response
	};
}

export async function put(req) {
	let variables = await req.request.json();
	const query = RESET_USER_PASSWORD_MUTATION;
	let response;
	await fetch(FAUNA_API.toString(), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: FAUNA_KEY.toString()
		},
		body: JSON.stringify({
			query,
			variables
		})
	})
		.then((res) => res.json())
		.then((result) => {
			response = result.data.resetPassword;
		})
		.catch((e) => {
			console.log(e);
		});
	//TODO: fix unique error when deserializing the result
	// console.log('reset - password', response)
	return {
		body: response
	};
}
