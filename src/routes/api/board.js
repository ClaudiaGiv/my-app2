// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { send, getAuthKey, buildResponseObject, buildGqlRequestBody, FAUNA_KEY } from './api-utils';
import { BOARD_BY_USER_QUERY, CREATE_DEFAULT_BOARD_MUTATION } from '../../graphql/board';

export async function get(req) {
	console.debug('Board GET');
	let response, error, authKey;
	const url = new URL(req.url)
	const urlSearchParams = new URLSearchParams(url.searchParams)
	const userId = urlSearchParams.get('userId')
	try {
		authKey = getAuthKey(req);
	} catch (e) {
		console.error('Auth key extraction: ', e);
		return e;
	}
	console.debug('authKey:', authKey);
	const body = buildGqlRequestBody(BOARD_BY_USER_QUERY, { userId });
	await send(authKey, body)
		.then((result) => {
			console.debug('Board GET result: ', result);
			response = result.data.findBoardByUserId;
		})
		.catch((e) => {
			console.error('Board GET: ', e);
			error = e;
		});

	if (error) {
		return buildResponseObject(400, error);
	}
	return buildResponseObject(200, response);
}

export async function post(req) {
	let response = {}, error;
	const body = buildGqlRequestBody(CREATE_DEFAULT_BOARD_MUTATION, await req.request.json());
	await send(FAUNA_KEY.toString(), body)
		.then((result) => {
			console.debug('Board POST result: ', result);
			response = result?.data?.createBoard || {};
		})
		.catch((e) => {
			console.error('Board POST: ', e);
			error = e;
		});
	if (error) {
		return buildResponseObject(400, error);
	}
	return buildResponseObject(200, response);
}
