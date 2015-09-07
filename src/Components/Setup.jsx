/**
 * Application setup
 */
var Setup = React.createClass({
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
		return <div id='setup'>
			<h1>PRESS START</h1>
			<div className="row players-setup-container">
				<div className="col-xs-4 players-setup" onClick={this.addPlayers.bind(this, 1)}></div>
				<div className="col-xs-4 players-setup" onClick={this.addPlayers.bind(this, 2)}></div>
				<div className="col-xs-4 players-setup" onClick={this.addPlayers.bind(this, 3)}></div>
			</div>
			<PlayersCounter />
			<div onClick={this.startGame} className="row players-setup-container">
				<p className="start-btn blink">START</p>
			</div>
			<div className="row players-setup-container footnote">
				<p>press as many times the player buttons to keep adding more players</p>
			</div>
			<Notifications active={this.state.hasSetupErrored} msg="Please pick at least two players" />
		</div>;
	}
});
