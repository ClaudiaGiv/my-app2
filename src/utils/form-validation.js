export function validateUsername(username) {
	if (username === '') {
		return 'The email must not be empty!';
	}
	if (!validateEmail(username)) {
		return 'The email is invalid!';
	}
	return '';
}

export function validatePasswords(password1, password2) {
	if (password1 === '' || password2 === '') {
		return 'The password must not be empty!';
	}
	if (password1 !== password2) {
		return 'The two passwords do not match!';
	}
	return '';
}

export function validatePassword(password){
	if (password === '') {
		return 'The password must not be empty!';
	}
	return '';
}

export function validateEmail(email) {
	const re = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}
