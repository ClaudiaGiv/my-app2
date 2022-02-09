import cookie from 'cookie';

export async function handle({ event, resolve }) {

	// code here happends before the endpoint or page is called
	const cookies = await cookie.parse(event.request.headers.get('cookie') || '');
	event.locals.user = await cookies.user
	console.debug('Hooks cookies: ', cookies);
	const response = await resolve(event);

	// code here happens after the endpoint or page is called
	return response;
}
// This function takes the request object and returns a session object that is accessible on the client
// and therefore must be safe to expose to users. It runs whenever SvelteKit server-renders a page.
export function getSession(event) {
	return event?.locals?.user
		? {
			user: JSON.parse(event.locals.user).details
		}
		: {};
}
