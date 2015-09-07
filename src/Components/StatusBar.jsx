/**
 * Status bar view
 */
var StatusBar = React.createClass({
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
		return <div id="status-bar">
			<h5>Player {this.state.currentPlayer.number} <span>{this.state.currentPlayer.points}</span> points</h5>
		</div>;
	}
});
