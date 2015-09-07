/**
 * Main application view controller
 */
var Application = React.createClass({
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
				return <End />;
			} else {
				return <Game />;
			}
		} else {
			return <Setup />;
		}
	}
});
