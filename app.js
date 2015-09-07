/**
 * Main application view controller
 */
var Application = React.createClass({displayName: "Application",
	mixins: [Fluxxor.FluxMixin(React), Fluxxor.StoreWatchMixin("ApplicationStore")],
	/**
	 * On mount
	 */
	componentDidMount: function() {
		$.get(this.props.source, function(result) {
			 var data = result.photos.items.map(function(photo) {
				return [photo, photo];
			}).concatAll().shuffle();

			this.getFlux().actions.dataDone(data);
		}.bind(this));
	},
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
 * Card view
 */
var Card = React.createClass({displayName: "Card",
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
		var cardStyle = {
			backgroundImage: 'url(' + this.props.item.photoUrl + ')'
		};

		return React.createElement("div", {onClick: this.props.onSelect, id: this.props.item.id, className: "card", style: cardStyle});
	}
});

/**
 * Board view
 */
var Board = React.createClass({displayName: "Board",
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
		var game = this.props.game;
		var onSelect = this.props.onCardSelect;

		return React.createElement("div", {id: "board"}, 
			this.state.photos.data.map(function(item, index) {
				return React.createElement(Card, {onSelect: onSelect.bind(game, item), item: item, key: item.id + '.' + index});
			})
		);
	}
});

/**
 * Status bar view
 */
var StatusBar = React.createClass({displayName: "StatusBar",
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
		return React.createElement("div", {id: "status-bar"}, 
			React.createElement("h5", null, "Player ", this.state.currentPlayer.number, " ", React.createElement("span", null, this.state.currentPlayer.points), " points")
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
	 * On selecting a card
	 *
	 * @param card
	 */
	onCardSelect: function(card) {
		var cards = this.state.selectedCards;

		if (cards.length !== undefined && cards.length === 1) {
			if (this.areCardsEqual(cards[0].card, card)) {
				this.getFlux().actions.equalFound(card);
			} else {
				this.getFlux().actions.nextPlayer();
			}

			this.getFlux().actions.resetSelectedCards();
		} else {
			this.getFlux().actions.selectCard(card);
		}
	},
	/**
	 * Determines if current selected cards are equal
	 */
	areCardsEqual: function(firstCard, secondCard) {
		return firstCard.id !== undefined && secondCard.id !== undefined && firstCard.id === secondCard.id;
	},
	/**
	 * Render application
	 *
	 * @returns {XML}
	 */
	render: function () {
		return React.createElement("div", {id: "game"}, 
			React.createElement(StatusBar, null), 
			React.createElement(Board, {game: this, onCardSelect: this.onCardSelect})
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
			React.createElement("div", {className: "row players-setup-container footnote"}, 
				React.createElement("p", null, "press as many times the player buttons to keep adding more players")
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
		this.photos = [];
		this.currentPlayer = {};
		this.selectedCards = [];

		this.bindActions(
			constants.ADD_PLAYERS, this.addPlayers,
			constants.SETUP_ERRORED, this.onSetupErrored,
			constants.START_GAME, this.startGame,
			constants.DATA_DONE, this.setData,
			constants.SELECT_CARD, this.selectCard,
			constants.RESET_SELECTED_CARDS, this.resetSelectedCards,
			constants.NEXT_PLAYER, this.assignNextPlayer,
			constants.EQUAL_FOUND, this.onMatch
		);
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
	 * @param card
	 */
	selectCard: function(card) {
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
			gameStarted: this.gameStarted,
			players: this.players,
			photos: this.photos,
			currentPlayer: this.currentPlayer,
			selectedCards: this.selectedCards
		};
	}
});

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
	selectCard: function(card) {
		if (card !== undefined) {
			this.dispatch(constants.SELECT_CARD, {card: card});
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
React.render(React.createElement(Application, {flux: flux, source: "api/photos.json"}), document.getElementById('container'));


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