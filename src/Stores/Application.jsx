/**
 * Application store
 */
var ApplicationStore = Fluxxor.createStore({
	/**
	 * Constructor
	 */
	initialize: function () {
		this.numberOfPlayers = 0;
		this.hasSetupErrored = false;
		this.gameStarted = false;
		this.players = [];
		this.photos = [];
		this.currentPlayer = {};
		this.selectedCards = [];
		this.matched = [];
		this.gameEnded = false;

		this.bindActions(
			constants.ADD_PLAYERS, this.addPlayers,
			constants.SETUP_ERRORED, this.onSetupErrored,
			constants.START_GAME, this.startGame,
			constants.DATA_DONE, this.setData,
			constants.SELECT_CARD, this.selectCard,
			constants.RESET_SELECTED_CARDS, this.resetSelectedCards,
			constants.NEXT_PLAYER, this.assignNextPlayer,
			constants.EQUAL_FOUND, this.onMatch,
			constants.END_GAME, this.finishGame
		);
	},
	/**
	 * End game
	 */
	finishGame: function() {
		this.gameEnded = true;
		this.emit("change");
	},
	/**
	 * Sets current photo data
	 */
	setData: function(data) {
		this.photos = data;
		this.emit("change");
	},
	/**
	 * Adds points to current player
	 */
	onMatch: function(card) {
		this.currentPlayer.points++;
		this.matched.push(card);
		this.emit("change");
	},
	/**
	 * Assigns current player to the next one
	 */
	assignNextPlayer: function() {
		var currentIndex = this.currentPlayer.number;

		if (currentIndex < this.players.length) {
			this.currentPlayer = this.players[currentIndex];
		} else {
			this.currentPlayer = this.players[0];
		}

		this.emit("change");
	},
	/**
	 * Resets current selected cards
	 */
	resetSelectedCards: function() {
		this.selectedCards = [];
		this.emit("change");
	},
	/**
	 * Selects a card
	 *
	 * @param data
	 */
	selectCard: function(data) {
		var card = data.card;
		card.identifier = data.id;

		this.selectedCards.push(card);
		this.emit("change");
	},
	/**
	 * Starts the game
	 */
	startGame: function() {
		this.hasSetupErrored = false;
		this.gameStarted = true;

		for (var i = 0; i < this.numberOfPlayers; i++) {
			this.players.push({
				number: i + 1,
				points: 0
			});
		}

		this.currentPlayer = this.players[0];

		this.emit("change");
	},
	/**
	 * On setup error
	 */
	onSetupErrored: function() {
		this.hasSetupErrored = true;
		this.emit("change");
	},
	/**
	 * Adds players to the game
	 *
	 * @param payload
	 */
	addPlayers: function (payload) {
		if (payload.numberOfPlayers !== undefined && payload.numberOfPlayers === parseInt(payload.numberOfPlayers, 10)) {
			this.numberOfPlayers += payload.numberOfPlayers;
			this.emit("change");
		} else {
			throw new Error("Payload is not valid");
		}
	},
	/**
	 * Get state
	 * @returns Object
	 */
	getState: function () {
		return {
			numberOfPlayers: this.numberOfPlayers,
			hasSetupErrored: this.hasSetupErrored,
			gameStarted: this.gameStarted,
			players: this.players,
			photos: this.photos,
			currentPlayer: this.currentPlayer,
			selectedCards: this.selectedCards,
			matched: this.matched,
			gameEnded: this.gameEnded
		};
	}
});
