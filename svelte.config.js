// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-netlify';
//
// export default {
// 	kit: {
// 		adapter: adapter({
// 			// if true, will split your app into multiple functions
// 			// instead of creating a single one for the entire app
// 			split: false
// 		})
// 	}
// };

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
