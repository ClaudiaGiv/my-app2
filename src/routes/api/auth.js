// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { USER_LOGIN_MUTATION, USER_LOGOUT_MUTATION } from '../../graphql/user';
import { send, getAuthKey, buildResponseObject, buildGqlRequestBody, FAUNA_KEY } from './api-utils';
import { serialize } from 'cookie';

export async function post(req) {
	let response, error;
	console.log('Fauna Key', FAUNA_KEY);
	const body = buildGqlRequestBody(USER_LOGIN_MUTATION, await req.request.json());
	await send(FAUNA_KEY.toString(), body)
		.then((result) => {
			console.debug('Auth POST result: ', result);
			response = result.data.login;
		})
		.catch((e) => {
			console.error('Auth POST: ', e);
			error = e;
		});
	if (error) {
		return buildResponseObject(401, { error: { message: 'Incorrect email or password' } });
	}
	return {
		...buildResponseObject(200, response.user),
		headers: {
			'Set-Cookie': serialize(
				'user',
				JSON.stringify({ token: response.secret, details: response.user }),
				{
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production',
					maxAge: 60 * 60 * 24 * 7 // one week
				}
			)
		}
	};
}

export async function put(req) {
	let response, error, authKey;
	try {
		authKey = getAuthKey(req);
	} catch (e) {
		return e;
	}
	const body = buildGqlRequestBody(USER_LOGOUT_MUTATION, { allTokens: true });
	await send(authKey, body)
		.then((result) => {
			console.debug('Auth PUT result: ', result);
			response = result.data.logout;
		})
		.catch((e) => {
			console.error('Auth PUT: ', e);
			error = e;
		});
	if (error) {
		return buildResponseObject(400, error);
	}
	return {
		...buildResponseObject(200, { message: 'Successfully signed out' }),
		headers: {
			'Set-Cookie': serialize('user', '', {
				path: '/',
				expires: new Date(0)
			})
		}
	};
}
