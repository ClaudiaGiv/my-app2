const FAUNA_URL = import.meta.env.VITE_FAUNA_URL;
const FAUNA_TOKEN = import.meta.env.VITE_FAUNA_TOKEN;

export async function get() {
	const ALLTODOS_QUERY = `
	query allTodos{
	  allTodos{
	    data{
	    _id
	    text
	    done
	    }
	  }
	}`;

	const res = await fetch(FAUNA_URL.toString(), {
     method: 'POST',
	   headers: {
     	  'Content-Type': 'application/json',
			 Authorization: FAUNA_TOKEN.toString()
		 },
		body: JSON.stringify( {
			query: ALLTODOS_QUERY
		})
	});

	if (res.ok) {
		const allTodos = await res.json();
		console.log('allTodos', allTodos)
		return {
			body: allTodos.data.allTodos.data
		  };
		}
		return {
			status: res.status,
			error: new Error()
		};
}