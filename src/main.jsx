/**
 * Application constants
 */
var constants = {
	ADD_PLAYERS: "ADD_PLAYERS",
	SETUP_ERRORED: "SETUP_ERRORED",
	START_GAME: "START_GAME",
	DATA_DONE: "DATA_DONE",
	SELECT_CARD: "SELECT_CARD",
	RESET_SELECTED_CARDS: "RESET_SELECTED_CARDS",
	NEXT_PLAYER: "NEXT_PLAYER",
	EQUAL_FOUND: "EQUAL_FOUND"
};
/**
 * Application actions
 */
var actions = {
	/**
	 * On data fetch done
	 */
	dataDone: function(data) {
		this.dispatch(constants.DATA_DONE, {data: data});
	},
	/**
	 * Adds players to the game
	 *
	 * @param numberOfPlayers
	 */
	addPlayers: function(numberOfPlayers) {
		this.dispatch(constants.ADD_PLAYERS, {numberOfPlayers: numberOfPlayers});
	},
	/**
	 * Set errored setup
	 */
	setupErrored: function() {
		this.dispatch(constants.SETUP_ERRORED);
	},
	/**
	 * Starts game
	 */
	startGame: function() {
		this.dispatch(constants.START_GAME);
	},
	/**
	 * Selects a card
	 */
	selectCard: function(card, id) {
		if (card !== undefined) {
			this.dispatch(constants.SELECT_CARD, {card: card, id: id || null});
		} else {
			throw new Error("Card not defined!");
		}
	},
	/**
	 * Resets current selected cards
	 */
	resetSelectedCards: function() {
		this.dispatch(constants.RESET_SELECTED_CARDS);
	},
	/**
	 * Next player
	 */
	nextPlayer: function() {
		this.dispatch(constants.NEXT_PLAYER);
	},
	/**
	 * On equal found
	 */
	equalFound: function(card) {
		if (card !== undefined) {
			this.dispatch(constants.EQUAL_FOUND, {card: card});
		} else {
			throw new Error("Card not defined!");
		}
	}
};
/**
 * Application store
 */
var stores = {
	ApplicationStore: new ApplicationStore()
};
/**
 * Flux
 */
var flux = new Fluxxor.Flux(stores, actions);

// DEBUG
flux.on("dispatch", function(type, payload) {
	if (console && console.log) {
		console.log("[Dispatch]", type, payload);
	}
});
// DEBUG

/**
 * Render application
 */
React.render(<Application flux={flux} source="api/photos.json" />, document.getElementById('container'));


/** Array helper functions */
Array.prototype.concatAll = function () {
	var results = [];

	this.forEach(function (subArray) {
		subArray.forEach(function (item) {
			results.push(item);
		});
	});

	return results;
};

Array.prototype.shuffle = function () {
	var i = this.length, j, temp;
	if (i == 0) return this;
	while (--i) {
		j = Math.floor(Math.random() * ( i + 1 ));
		temp = this[i];
		this[i] = this[j];
		this[j] = temp;
	}
	return this;
};