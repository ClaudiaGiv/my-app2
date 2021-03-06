import { writable } from 'svelte/store';

const BOARD = {};

const { subscribe, set, update } = writable(BOARD);

const sortBoardElementsByWeight = (board) => {
	board.columns.data.sort((x, y) => {
		return x.weight - y.weight;
	});
	board.columns.data.forEach((el) =>
		el.cards.data.sort((x, y) => {
			return x.weight - y.weight;
		})
	);
	return board;
};

const setAndSort = (board) => {
	set(sortBoardElementsByWeight(board));
};

const sortByWeight = () =>
	update((board) => {
		return sortBoardElementsByWeight(board);
	});

const updateCard = (colIdx, card) =>
	update((board) => {
		const cardIdx = board.columns.data[colIdx].cards.data.findIndex((c) => c._id === card._id);
		board.columns.data[colIdx].cards.data[cardIdx] = card;
		return board;
	});

const updateColumn = (column) =>
	update((board) => {
		const colIdx = board.columns.data.findIndex((c) => c._id === column._id);
		board.columns.data[colIdx] = column;
		board.columns.data[colIdx].cards.data.sort((x, y) => {
			return x.weight - y.weight;
		});
		return board;
	});

const removeCard = (columnIndex, cardIndex) =>
	update((board) => {
		board.columns.data[columnIndex].cards.data.splice(cardIndex, 1);
		console.log(board.columns.data[columnIndex].cards.data);
		return board;
	});

const removeColumn = (columnIndex) =>
	update((board) => {
		board.columns.data.splice(columnIndex, 1);
		return board;
	});

const reset = () => {
	set(BOARD);
};

export default {
	subscribe,
	set,
	removeCard,
	removeColumn,
	updateCard,
	updateColumn,
	sortByWeight,
	setAndSort,
	reset
};
