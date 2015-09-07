/**
 * Main application view controller
 */
var Application = React.createClass({
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
			return <Game />;
		} else {
			return <Setup />;
		}
	}
});