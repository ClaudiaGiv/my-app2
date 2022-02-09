// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
	buildCombinedGqlRequestBodyWithEmptyUpdateBoard,
	buildResponseObject,
	getAuthKey,
	send
} from './api-utils';

import {
	CREATE_CARD_MUTATION,
	UPDATE_CARD_MUTATION,
	DELETE_CARD_MUTATION
} from '../../graphql/card';

export async function post(req) {
	console.debug('Card POST');
	let response = {},
		error,
		authKey;
	try {
		authKey = getAuthKey(req);
	} catch (e) {
		return e;
	}
	const body = buildCombinedGqlRequestBodyWithEmptyUpdateBoard(
		CREATE_CARD_MUTATION,
		await req.request.json()
	);
	await send(authKey, body)
		.then((result) => {
			response = result?.data?.createCard || {};
		})
		.catch((e) => {
			error = e;
		});
	if (error) {
		return buildResponseObject(400, error);
	}
	return buildResponseObject(200, response);
}

export async function put(req) {
	console.debug('Card PUT');
	let response, error, authKey;
	try {
		authKey = getAuthKey(req);
	} catch (e) {
		return e;
	}
	const body = buildCombinedGqlRequestBodyWithEmptyUpdateBoard(
		UPDATE_CARD_MUTATION,
		await req.request.json()
	);
	await send(authKey, body)
		.then((result) => {
			response = result?.data?.updateCard || {};
		})
		.catch((e) => {
			error = e;
		});
	if (error) {
		return buildResponseObject(400, error);
	}
	return buildResponseObject(200, response);
}

export async function del(req) {
	let response, error, authKey;
	try {
		authKey = getAuthKey(req);
	} catch (e) {
		return e;
	}
	const body = buildCombinedGqlRequestBodyWithEmptyUpdateBoard(
		DELETE_CARD_MUTATION,
		await req.request.json()
	);
	await send(authKey, body)
		.then((result) => {
			response = result?.data?.deleteCard || {};
		})
		.catch((e) => {
			error = e;
		});
	if (error) {
		return buildResponseObject(400, error);
	}
	return buildResponseObject(200, response);
}
