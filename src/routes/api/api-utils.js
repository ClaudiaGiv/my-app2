import { EMPTY_UPDATE_BOARD_MUTATION } from '../../graphql/board';
import combineQuery from 'graphql-combine-query';
import { print } from 'graphql/language/printer.js';

export const FAUNA_API = import.meta.env.VITE_FAUNA_API;
export const FAUNA_KEY = 'Bearer ' + import.meta.env.VITE_FAUNA_KEY;

async function handleErrors(response) {
	if (!response.ok) {
		throw Error(response.statusText);
	}
	const json = await response.json();
	if (json.errors) {
		throw json.errors[0];
	}
	return json;
}

export async function send(authKey, body, url = FAUNA_API.toString(), method = 'POST') {
	let response;
	// console.debug('Req body:', body)
	await fetch(url, {
		method: method,
		headers: {
			'Content-Type': 'application/json',
			'Authorization': authKey
		},
		body: JSON.stringify(body)
	})
		.then((res) => handleErrors(res))
		.then((responseJson) => {
			response = responseJson;
		})
		.catch((e) => {
			throw e;
		});
	return response;
}

export function getAuthKey(req) {
	const userToken = JSON.parse(req.locals.user).token;
	if (!userToken) {
		throw buildResponseObject(401, {
			error: { message: 'Unauthorized to execute this operation' }
		});
	}
	return 'Bearer ' + userToken;
}

export function buildResponseObject(status, object) {
	return {
		status: status,
		body: object
	};
}

export function buildGqlRequestBody(query, variables) {
	return {
		query,
		variables
	};
}

export function buildCombinedGqlRequestBodyWithEmptyUpdateBoard(query1, variables1) {
	return buildCombinedGqlRequestBody(query1, variables1, EMPTY_UPDATE_BOARD_MUTATION, {
		boardId: variables1.boardId
	});
}

export function buildCombinedGqlRequestBody(query1, variables1, query2, variables2) {
	const { document, variables } = combineQuery('CombinedGql')
		.add(query1, variables1)
		.add(query2, variables2);
	const mutationString = print(document);
	console.debug('mutation string', mutationString);
	console.debug('vars', variables);
	return JSON.stringify({
		query: mutationString,
		variables
	});
}
