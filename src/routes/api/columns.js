// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { buildResponseObject, getAuthKey, send } from './api-utils';

//TODO: combined query on update cards (with empty update on board operation)
export async function put(req) {
	console.debug('Columns PUT');
	let response, error, authKey;
	try {
		authKey = getAuthKey(req);
	} catch (e) {
		return e;
	}
	await send(authKey, await req.request.json())
		.then((result) => {
			response = result.data;
		})
		.catch((e) => {
			error = e;
		});

	if (error) {
		return buildResponseObject(400, error);
	}
	return buildResponseObject(200, response);
}
