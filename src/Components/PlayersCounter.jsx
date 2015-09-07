/**
 * Application setup
 */
var PlayersCounter = React.createClass({
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

		return <div className="row players-setup-container">
			<p className="players-counter">{this.state.numberOfPlayers} {playersLabel}</p>
		</div>;
	}
});
