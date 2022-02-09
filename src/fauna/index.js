import fauna from 'faunadb';
import FaunaStream from './FaunaStream.js';

// We do this so that our FQL code is cleaner
const { Collection, Ref } = fauna.query;

export const client = new fauna.Client({
// @ts-ignore
	secret: import.meta.env.VITE_FAUNA_SERVER_KEY
});

export function startBoardStream(boardId) {
	const boardRef = Ref(Collection('Board'), boardId);
	return new FaunaStream(client, boardRef);
}


export const q = fauna.query;


