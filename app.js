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
			if (this.state.gameEnded) {
				return React.createElement(End, null);
			} else {
				return React.createElement(Game, null);
			}
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
	 * Determines if this card is selected
	 */
	isCardSelected: function() {
		var cardId = this.props.identifier;
		var dataSet = this.state.selectedCards.filter(function(item) {
			return item.identifier === cardId;
		});

		return dataSet.length > 0;
	},
	/**
	 * Determines if this card is already matched
	 */
	isMatched: function() {
		var cardId = this.props.item.id;
		var dataSet = this.state.matched.filter(function(item) {
			return item.card.id === cardId;
		});

		return dataSet.length > 0;
	},
	/**
	 * Get image bg
	 * @returns {{backgroundImage: string}}
	 */
	getPhotoBackground: function() {
		return {backgroundImage: 'url(' + this.props.item.photoUrl + ')'};
	},
	/**
	 * get template bg
	 */
	getCardBackground: function() {
		return {backgroundImage: 'url(imgs/card.png)'};
	},
	/**
	 * Render application
	 *
	 * @returns {XML}
	 */
	render: function () {
		var cardStyle = this.getCardBackground();
		var className = "card";

		if(this.isMatched()) {
			className += " matched-card";
			cardStyle = this.getPhotoBackground();
		} else if(this.isCardSelected()) {
			className += " selected-card";
			cardStyle = this.getPhotoBackground();
		} else {
			className += " off-card";
		}

		return React.createElement("div", {className: className, onClick: this.props.onSelect, id: this.props.item.id, 
					style: cardStyle});
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

		return React.createElement("div", {id: "board", className: "container"}, 
			this.state.photos.data.map(function(item, index) {
				return React.createElement(Card, {identifier: item.id + '.' + index, 
							 onSelect: onSelect.bind(game, item, item.id + '.' + index), item: item, 
							 key: item.id + '.' + index});
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
			React.createElement("h5", null, "Player ", this.state.currentPlayer.number, " / ", React.createElement("span", null, this.state.currentPlayer.points), " points")
		);
	}
});

/**
 * Main application view controller
 */
var End = React.createClass({displayName: "End",
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
	 * Gets winner player
	 */
	getWinner: function() {
		var winner = {number: 0, points: 0};
		var players = this.state.players;
		var n = players.length;

		for(var i=0; i<n; i++) {
			if (players[i].points > winner.points) {
				winner = players[i];
			}
		}

		return winner;
	},
	/**
	 * Render application
	 *
	 * @returns {XML}
	 */
	render: function () {
		var winner = this.getWinner();

		return React.createElement("div", {id: "end"}, 
			React.createElement("h1", null, "GAME OVER"), 
			React.createElement("p", null, "Player ", winner.number, " wins with ", winner.points, " ", winner.points !== 1 ? 'points' : 'point'), 
			React.createElement("div", {className: "final-winner"}, 
				React.createElement("img", {src: "imgs/win.png"})
			)
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
	 * @param identifier
	 */
	onCardSelect: function(card, identifier) {
		var cards = this.state.selectedCards;
		var delay;

		if (cards.length !== undefined && cards.length === 2) {
			return;
		}

		if (cards.length !== undefined && cards.length === 1) {
			if (this.areCardsEqual(cards[0], card)) {
				this.getFlux().actions.equalFound(card);
			} else {
				this.getFlux().actions.nextPlayer();
			}

			delay = setTimeout(function() {
				this.getFlux().actions.resetSelectedCards();
			}.bind(this), 1000);
		}

		if (this.state.matched.length*2 === this.state.photos.data.length) {
			clearTimeout(delay);
			setTimeout(function() {
				this.getFlux().actions.endGame();
			}.bind(this), 1000);
		} else {
			this.getFlux().actions.selectCard(card, identifier);
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
			React.createElement(Notifications, {active: this.state.hasSetupErrored, msg: "Please pick at least one player"})
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
			selectedCards: this.selectedCards,
			matched: this.matched,
			gameEnded: this.gameEnded
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
	EQUAL_FOUND: "EQUAL_FOUND",
	END_GAME: "END_GAME"
};
/**
 * Application actions
 */
var actions = {
	/**
	 * On game end
	 */
	endGame: function() {
		this.dispatch(constants.END_GAME);
	},
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