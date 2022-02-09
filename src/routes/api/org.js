// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { buildGqlRequestBody, buildResponseObject, getAuthKey, send } from './api-utils';
import { ORGANIZATION_BY_NAME_QUERY } from '../../graphql/organization';


export async function get(req) {
	let response, error, authKey;
	const url = new URL(req.url)
	const urlSearchParams = new URLSearchParams(url.searchParams)
	const orgName = urlSearchParams.get('name')
	try {
		authKey = getAuthKey(req);
	} catch (e) {
		console.error('Auth key extraction: ', e);
		return e;
	}
	console.debug('authKey:', authKey);
	const body = buildGqlRequestBody(ORGANIZATION_BY_NAME_QUERY, { name: orgName });
	console.log("body: ", body)
	await send(authKey, body)
		.then((result) => {
			console.debug('Org GET result: ', result);
			response = result.data.findOrganizationByName;
		})
		.catch((e) => {
			console.error('Org GET: ', e);
			error = e;
		});

	if (error) {
		return buildResponseObject(400, error);
	}
	return buildResponseObject(200, response);
}
