// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { buildResponseObject, getAuthKey, send } from './api-utils';

//TODO: combined query on update cards (with empty update on board operation)
export async function put(req) {
	console.debug('Cards PUT');
	let response = {},
		error,
		authKey;
	try {
		authKey = getAuthKey(req);
	} catch (e) {
		console.error('Auth key extraction: ', e);
		return e;
	}


	await send(authKey, await req.request.json())
		.then((result) => {
			console.debug('Cards PUT result: ', result);
			response = result?.data || {};
		})
		.catch((e) => {
			console.error('Cards PUT: ', e);
			error = e;
		});
	if (error) {
		return buildResponseObject(400, error);
	}
	return buildResponseObject(200, response);
}
