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

		this.bindActions(
			constants.ADD_PLAYERS, this.addPlayers,
			constants.SETUP_ERRORED, this.onSetupErrored,
			constants.START_GAME, this.startGame
		);
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
		if (payload.numberOfPlayers !== undefined && Number.isInteger(payload.numberOfPlayers)) {
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
			gameStarted: this.gameStarted
		};
	}
});
