// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { buildGqlRequestBody, buildResponseObject, getAuthKey, send } from './api-utils';
import { CHECK_CREDENTIALS_MUTATION } from '../../graphql/user';

export async function post(req) {
	let response = {},
		error,
		authKey;
	try {
		authKey = getAuthKey(req);
	} catch (e) {
		console.error('Auth key extraction: ', e);
		return e;
	}
	const body = buildGqlRequestBody(CHECK_CREDENTIALS_MUTATION, await req.request.json());
	await send(authKey, body)
		.then((result) => {
			console.log('User-credentials POST result: ', result);
			response = result.data;
		})
		.catch((e) => {
			console.error('User-credentials POST: ', e);
			error = e;
		});
	if (error) {
		return buildResponseObject(400, error);
	}
	return buildResponseObject(200, response);
}
