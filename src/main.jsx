/**
 * Application constants
 */
var constants = {
	ADD_PLAYERS: "ADD_PLAYERS",
	SETUP_ERRORED: "SETUP_ERRORED",
	START_GAME: "START_GAME"
};
/**
 * Application actions
 */
var actions = {
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

// DEBUG ////////////////////////////////////////////////
flux.on("dispatch", function(type, payload) {
	if (console && console.log) {
		console.log("[Dispatch]", type, payload);
	}
});
// DEBUG ////////////////////////////////////////////////

/**
 * Render application
 */
React.render(<Application flux={flux} />, document.getElementById('container'));
