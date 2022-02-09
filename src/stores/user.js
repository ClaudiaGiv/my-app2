import { writable } from 'svelte/store';

const USER = {};

const { subscribe, set, update } = writable(USER);

export default {
	subscribe,
	set,
};

