/**
 * Main application view controller
 */
var Application = React.createClass({displayName: "Application",
	mixins: [Fluxxor.FluxMixin(React), Fluxxor.StoreWatchMixin("ApplicationStore")],
	/**
	 * Starts the game
	 */
	startGame: function() {
		this.getFlux().actions.startGame();
	},
	/**
	 * Get state
	 *
	 * @returns Object
	 */
	getStateFromFlux: function() {
		return this.getFlux().store("ApplicationStore").getState();
	},
	/**
	 * Render application
	 *
	 * @returns {XML}
	 */
	render: function () {
		if (this.state.gameStarted) {
			return React.createElement(Game, null);
		} else {
			return React.createElement(Setup, null);
		}
	}
});

/**
 * Application setup
 */
var PlayersCounter = React.createClass({displayName: "PlayersCounter",
	mixins: [Fluxxor.FluxMixin(React), Fluxxor.StoreWatchMixin("ApplicationStore")],
	/**
	 * Returns state from flux
	 *
	 * @returns Object
	 */
	getStateFromFlux: function () {
		return this.getFlux().store("ApplicationStore").getState();
	},
	/**
	 * Render the view
	 *
	 * @returns {XML}
	 */
	render: function () {
		var playersLabel = (this.state.numberOfPlayers !== 1) ? "players" : "player";

		return React.createElement("div", {className: "row players-setup-container"}, 
			React.createElement("p", {className: "players-counter"}, this.state.numberOfPlayers, " ", playersLabel)
		);
	}
});

/**
 * Application setup
 */
var Notifications = React.createClass({displayName: "Notifications",
	/**
	 * Render the view
	 *
	 * @returns {XML}
	 */
	render: function () {
		var className = "row players-setup-container notifications";

		if (this.props.active) {
			className += " active";
		}

		return React.createElement("div", {className: className}, 
			React.createElement("p", null, this.props.msg)
		);
	}
});




/**
 * Main application view controller
 */
var Game = React.createClass({displayName: "Game",
	mixins: [Fluxxor.FluxMixin(React), Fluxxor.StoreWatchMixin("ApplicationStore")],
	/**
	 * Get state
	 *
	 * @returns Object
	 */
	getStateFromFlux: function() {
		return this.getFlux().store("ApplicationStore").getState();
	},
	/**
	 * Render application
	 *
	 * @returns {XML}
	 */
	render: function () {
		return React.createElement("div", {id: "game"}, 
			React.createElement("h5", null, "Game On")
		);
	}
});

/**
 * Application setup
 */
var Setup = React.createClass({displayName: "Setup",
	mixins: [Fluxxor.FluxMixin(React), Fluxxor.StoreWatchMixin("ApplicationStore")],
	/**
	 * Adds players to the game
	 *
	 * @param n
	 */
	addPlayers: function (n) {
		this.getFlux().actions.addPlayers(n);
	},
	/**
	 * Returns state from flux
	 *
	 * @returns Object
	 */
	getStateFromFlux: function () {
		return this.getFlux().store("ApplicationStore").getState();
	},
	/**
	 * Starts the game
	 */
	startGame: function() {
		if (this.state.numberOfPlayers > 0) {
			this.getFlux().actions.startGame();
		} else {
			this.getFlux().actions.setupErrored();
		}
	},
	/**
	 * Render the view
	 *
	 * @returns {XML}
	 */
	render: function () {
		return React.createElement("div", {id: "setup"}, 
			React.createElement("h1", null, "PRESS START"), 
			React.createElement("div", {className: "row players-setup-container"}, 
				React.createElement("div", {className: "col-xs-4 players-setup", onClick: this.addPlayers.bind(this, 1)}), 
				React.createElement("div", {className: "col-xs-4 players-setup", onClick: this.addPlayers.bind(this, 2)}), 
				React.createElement("div", {className: "col-xs-4 players-setup", onClick: this.addPlayers.bind(this, 3)})
			), 
			React.createElement(PlayersCounter, null), 
			React.createElement("div", {onClick: this.startGame, className: "row players-setup-container"}, 
				React.createElement("p", {className: "start-btn blink"}, "START")
			), 
			React.createElement(Notifications, {active: this.state.hasSetupErrored, msg: "Please pick at least two players"})
		);
	}
});

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
React.render(React.createElement(Application, {flux: flux}), document.getElementById('container'));
