<script context="module">
	import board from '../stores/board';
	import { startBoardStream } from '../fauna/index.js';

	let userId;

	export async function load({ fetch, session }) {
		console.log('Board-gql session', session);
		// if (!session.user) {
		// 	return {
		// 		status: 302,
		// 		redirect: '/login'
		// 	};
		// }
		userId = session.user._id;
		const res = await fetch('/api/board?userId=' + userId);
		if (res.ok) {
			const board1 = await res.json();
			setBoard(board1);
			startStream(board1);
			return {};
		}
		return {
			status: res.status,
			error: new Error()
		};
	}

	async function loadBoard() {
		const res = await fetch('/api/board?userId=' + userId);
		if (res.ok) {
			setBoard(await res.json());
		}
	}

	function setBoard(board1) {
		board.setAndSort(board1);
	}

	function startStream(board1) {
		const boardStream = startBoardStream(board1._id);
		boardStream.onUpdate.add(loadBoard);
	}
</script>

<script>
	import { flip } from 'svelte/animate';
	import { dndzone, overrideItemIdKeyNameBeforeInitialisingDndZones } from 'svelte-dnd-action';
	import combineQuery from 'graphql-combine-query';
	import { print } from 'graphql/language/printer.js';
	import Card from '$lib/Card/index.svelte';
	import Dialog from '$lib/dialog.svelte';
	import {
		UPDATE_CARD_WEIGHT_AND_COLUMN_MUTATION,
		UPDATE_CARD_WEIGHT_MUTATION
	} from '../graphql/card';
	import { UPDATE_COLUMN_WEIGHT_MUTATION } from '../graphql/column';

	overrideItemIdKeyNameBeforeInitialisingDndZones('_id');
	$: console.log('board', $board.columns.data);

	const flipDurationMs = 200;

	let object;
	let actionType = 'save';
	let editableCardColIdx = -1;
	let showModal1 = false;
	let fromColIdx = -1;
	let fromCardIdx = -1;
	let finalized = 0;

	//--- DND Functions ---

	function handleDndConsiderColumns(e) {
		const colIdx = $board.columns.data.findIndex((c) => c._id === e.detail.info.id);
		fromColIdx = fromColIdx === -1 ? colIdx : fromColIdx;
		$board.columns.data = e.detail.items;
	}

	function handleDndFinalizeColumns(e) {
		$board.columns.data = e.detail.items;
		const colIdx = $board.columns.data.findIndex((c) => c._id === e.detail.info.id);
		const minColIdx = fromColIdx < colIdx ? fromColIdx : colIdx;
		const columnsUpdatedByWeight = updateWeight($board.columns.data, minColIdx);
		const { document, variables } = combineQuery('UpdateColumnsWeight').addN(
			UPDATE_COLUMN_WEIGHT_MUTATION,
			columnsUpdatedByWeight
		);
		updateColumns({ document, variables });
		fromColIdx = -1;
		return;
	}

	function handleDndConsiderCards(cid, e) {
		const colIdx = $board.columns.data.findIndex((c) => c._id === cid);
		const cardIdx = $board.columns.data[colIdx].cards.data.findIndex(
			(c) => c._id === e.detail.info.id
		);
		fromColIdx = fromColIdx === -1 ? colIdx : fromColIdx;
		fromCardIdx = fromCardIdx === -1 ? cardIdx : fromCardIdx;
		$board.columns.data[colIdx].cards.data = e.detail.items;
	}

	function handleDndFinalizeCards(cid, e) {
		const colIdx = $board.columns.data.findIndex((c) => c._id === cid);
		$board.columns.data[colIdx].cards.data = e.detail.items;
		const cardIdx = $board.columns.data[colIdx].cards.data.findIndex(
			(c) => c._id === e.detail.info.id
		);
		if (finalized === 0 && fromColIdx === colIdx && fromCardIdx !== cardIdx) {
			//same column
			console.log('same column');
			const minCardIdx = fromCardIdx < cardIdx ? fromCardIdx : cardIdx;
			const cardsUpdatedByWeight = updateWeight($board.columns.data[colIdx].cards.data, minCardIdx);
			const { document, variables } = combineQuery('UpdateCardsWeight').addN(
				UPDATE_CARD_WEIGHT_MUTATION,
				cardsUpdatedByWeight
			);

			updateCards({ document, variables });
			fromColIdx = -1;
			fromCardIdx = -1;
			return;
		}
		if (finalized === 0 && fromColIdx !== colIdx) {
			//different columns
			console.log('different columns');
			finalized = 1;
			let cardsForUpdateByWeight = updateWeight(
				$board.columns.data[fromColIdx].cards.data,
				fromCardIdx
			);
			cardsForUpdateByWeight.push(...updateWeight($board.columns.data[colIdx].cards.data, cardIdx));
			let cardForupdateByColumn = {
				id: $board.columns.data[colIdx].cards.data[cardIdx]._id,
				weight: $board.columns.data[colIdx].cards.data[cardIdx].weight,
				columnId: $board.columns.data[colIdx]._id
			};

			const { document, variables } = combineQuery('UpdateCardsWeight')
				.addN(UPDATE_CARD_WEIGHT_MUTATION, cardsForUpdateByWeight)
				.add(UPDATE_CARD_WEIGHT_AND_COLUMN_MUTATION, cardForupdateByColumn);
			updateCards({ document, variables });
		}
		if (finalized === 2) {
			finalized = 0;
			fromColIdx = -1;
			fromCardIdx = -1;
		}
		if (finalized === 1) {
			finalized = 2;
		}
	}

	//--- DND Functions ---

	//--- Card updates Functions ---

	function updateWeight(elements, index) {
		let elementsUpdated = [];
		if (elements === [] || elements === undefined) {
			return;
		}
		if (index === undefined) {
			index = 0;
		}
		for (let i = index; i < elements.length; i++) {
			elements[i].weight = i;
			elementsUpdated.push({
				id: elements[i]._id,
				weight: elements[i].weight
			});
		}
		return elementsUpdated;
	}

	function editCard(colId, cardId) {
		const colIdx = $board.columns.data.findIndex((c) => c._id === colId);
		object = {
			...$board.columns.data[colIdx].cards.data.find((c) => c._id === cardId),
			boardId: $board._id,
			type: 'card'
		};
		console.log('editCard', object);
		editableCardColIdx = colIdx;
		actionType = 'update';
		showModal1 = true;
	}

	function addCard() {
		const cardWeight = $board.columns.data[0].cards.data.length;
		const columnId = $board.columns.data[0]._id;
		object = {
			type: 'card',
			title: '',
			description: '',
			weight: cardWeight,
			columnId: columnId,
			boardId: $board._id
		};
		actionType = 'save';
		showModal1 = true;
	}

	//--- Card updates Functions ---

	//--- Column updates Functions ---

	function addColumn() {
		const columnWeight = $board.columns.data.length;
		const boardId = $board._id;
		object = {
			type: 'column',
			title: '',
			description: '',
			weight: columnWeight,
			boardId: boardId
		};
		actionType = 'save';
		showModal1 = true;
	}

	function editColumn(colId) {
		object = {
			...$board.columns.data.find((c) => c._id === colId),
			type: 'column',
			boardId: $board._id
		};
		actionType = 'update';
		showModal1 = true;
	}

	function isFirstColumn(colId) {
		return $board.columns.data.findIndex((c) => c._id === colId) === 0;
	}

	//--- Column updates Functions ---

	//--- Async Functions - Endpoints Requests ---

	async function updateCards({ document, variables }) {
		const mutationString = print(document);
		const res = await fetch('api/cards', {
			method: 'PUT',
			body: JSON.stringify({
				query: mutationString,
				variables
			})
		});
		console.log(res);
		const json = await res.json();
		if (res.ok) {
			console.log(json);
		} else {
			console.log('Error:', json);
		}
	}

	async function updateCard(e) {
		console.log('update-card', e);
		const res = await fetch('api/card', {
			method: 'PUT',
			body: JSON.stringify(e.detail)
		});
		console.log(res);
		const json = await res.json();
		if (res.ok) {
			board.updateCard(editableCardColIdx, json);
		} else {
			console.log('Error:', json);
		}
		showModal1 = false;
	}

	async function createCard(e) {
		const res = await fetch('api/card', {
			method: 'POST',
			body: JSON.stringify(e.detail)
		});
		const json = await res.json();
		if (res.ok) {
			$board.columns.data[0].cards.data = [...$board.columns.data[0].cards.data, json];
		} else {
			console.log('Error:', json);
		}
		showModal1 = false;
	}

	async function removeCard(colId, cardId) {
		const res = await fetch('api/card', {
			method: 'DELETE',
			body: JSON.stringify({ id: cardId, boardId: $board._id })
		});
		const json = await res.json();
		if (res.ok) {
			const colIdx = $board.columns.data.findIndex((c) => c._id === colId);
			const cardIdx = $board.columns.data[colIdx].cards.data.findIndex((c) => c._id === cardId);
			board.removeCard(colIdx, cardIdx);
		} else {
			console.log('Error:', json);
		}
	}

	async function updateColumns({ document, variables }) {
		const mutationString = print(document);
		const res = await fetch('api/columns', {
			method: 'PUT',
			body: JSON.stringify({
				query: mutationString,
				variables
			})
		});
		console.log(res);
		const json = await res.json();
		if (res.ok) {
			console.log(json);
		} else {
			console.log('Error:', json);
		}
	}

	async function updateColumn(e) {
		const res = await fetch('api/column', {
			method: 'PUT',
			body: JSON.stringify(e.detail)
		});
		console.log(res);
		const json = await res.json();
		if (res.ok) {
			board.updateColumn(json);
		} else {
			console.log('Error:', json);
		}
		showModal1 = false;
	}

	async function createColumn(e) {
		const res = await fetch('api/column', {
			method: 'POST',
			body: JSON.stringify(e.detail)
		});
		const json = await res.json();
		if (res.ok) {
			console.log(json);
			$board.columns.data = [...$board.columns.data, json];
			console.log($board);
		} else {
			console.log('Error:', json);
		}
		showModal1 = false;
	}

	async function removeColumn(colId) {
		const res = await fetch('api/column', {
			method: 'DELETE',
			body: JSON.stringify({ id: colId, boardId: $board._id })
		});
		const json = await res.json();
		if (res.ok) {
			const colIdx = $board.columns.data.findIndex((c) => c._id === colId);
			board.removeColumn(colIdx);
		} else {
			console.log('Error:', json);
		}
	}
	//--- Async Functions - Endpoints Requests ---
</script>

{#if showModal1}
	<Dialog
		{object}
		{actionType}
		on:close={() => (showModal1 = false)}
		on:save-card={(e) => createCard(e)}
		on:update-card={(e) => updateCard(e)}
		on:save-column={(e) => createColumn(e)}
		on:update-column={(e) => updateColumn(e)}
	/>
{/if}
<div
	class="flex justify-center p-1 board my-1"
	use:dndzone={{ items: $board.columns.data, flipDurationMs, type: 'columns' }}
	on:consider={handleDndConsiderColumns}
	on:finalize={handleDndFinalizeColumns}
>
	{#each $board.columns.data as column (column._id)}
		<div
			class="bg-gray-100 rounded-lg p-1 mx-1 rounded column"
			animate:flip={{ duration: flipDurationMs }}
		>
			<div
				class="text-gray-700 font-semibold font-sans tracking-wide p-1 text-sm flex justify-between"
			>
				<span class="cursor-pointer" on:click={() => editColumn(column._id)}>{column.title}</span>
				<button
					class="h-8 text-sm text-red-700 transition-colors rounded-lg hover:bg-red-100 hover:"
					on:click={() => removeColumn(column._id)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</div>

			<!-- Draggable component comes from vuedraggable. It provides drag & drop functionality -->
			<div
				class="column-content py-1"
				use:dndzone={{ items: column.cards.data, flipDurationMs }}
				on:consider={(e) => handleDndConsiderCards(column._id, e)}
				on:finalize={(e) => handleDndFinalizeCards(column._id, e)}
			>
				{#each column.cards.data as card (card._id)}
					<div class="card" animate:flip={{ duration: flipDurationMs }}>
						<Card
							{card}
							on:remove={() => removeCard(column._id, card._id)}
							on:edit={() => editCard(column._id, card._id)}
						/>
					</div>
				{/each}
				{#if isFirstColumn(column._id)}
					<div class="flex justify-end">
						<button
							on:click={addCard}
							class="flex items-center mt-1 mx-1 px-4 py-2 font-medium text-sm text-white bg-gray-800 rounded-md hover:bg-gray-700"
						>
							<svg
								class="h-5 w-5"
								viewbox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M12 4v16m8-8H4"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							<span>Add card</span>
						</button>
					</div>
				{/if}
			</div>
		</div>
	{/each}
	<div class="rounded column">
		<div class="flex justify-start">
			<button
				on:click={addColumn}
				class="flex items-center mt-1 mx-1 px-4 py-2 font-medium text-sm text-white bg-gray-800 rounded-md hover:bg-gray-700"
			>
				<svg class="h-5 w-5" viewbox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M12 4v16m8-8H4"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<span>Add column</span>
			</button>
		</div>
	</div>
</div>

<style>
	div {
		overflow-y: hidden;
	}

	.board {
		height: 85vh;
		width: 100%;
		overflow-y: hidden;
	}

	.column {
		height: 100%;
		width: 350px;
		float: left;
		/*Notice we make sure this container doesn't scroll so that the title stays on top and the dndzone inside is scrollable*/
		overflow-y: hidden;
	}

	.column-content {
		height: 100%;
		/* Notice that the scroll container needs to be the dndzone if you want dragging near the edge to trigger scrolling */
		overflow-y: auto;
	}
</style>
