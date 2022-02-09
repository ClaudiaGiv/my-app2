// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
	CREATE_COLUMN_MUTATION,
	UPDATE_COLUMN_MUTATION,
	DELETE_COLUMN_MUTATION
} from '../../graphql/column';
import {
	buildCombinedGqlRequestBodyWithEmptyUpdateBoard,
	buildResponseObject,
	getAuthKey,
	send
} from './api-utils';

export async function post(req) {
	console.debug('Column POST');
	let response = {},
		error,
		authKey;
	try {
		authKey = getAuthKey(req);
	} catch (e) {
		return e;
	}
	const body = buildCombinedGqlRequestBodyWithEmptyUpdateBoard(
		CREATE_COLUMN_MUTATION,
		await req.request.json()
	);
	await send(authKey, body)
		.then((result) => {
			response = {} || result?.data?.createColumn;
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
	console.debug('Column PUT');
	let response = {},
		error,
		authKey;
	try {
		authKey = getAuthKey(req);
	} catch (e) {
		return e;
	}
	const body = buildCombinedGqlRequestBodyWithEmptyUpdateBoard(
		UPDATE_COLUMN_MUTATION,
		await req.request.json()
	);
	await send(authKey, body)
		.then((result) => {
			response = result?.data?.updateColumn || {};
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
	let response = {},
		error,
		authKey;
	try {
		authKey = getAuthKey(req);
	} catch (e) {
		return e;
	}
	const body = buildCombinedGqlRequestBodyWithEmptyUpdateBoard(
		DELETE_COLUMN_MUTATION,
		await req.request.json()
	);
	await send(authKey, body)
		.then((result) => {
			response = result?.data?.deleteColumn || {};
		})
		.catch((e) => {
			error = e;
		});
	if (error) {
		return buildResponseObject(400, error);
	}
	return buildResponseObject(200, response);
}
