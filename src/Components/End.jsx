/**
 * Main application view controller
 */
var End = React.createClass({
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

		return <div id='end'>
			<h1>GAME OVER</h1>
			<p>Player {winner.number} wins with {winner.points} {winner.points !== 1 ? 'points' : 'point'}</p>
			<div className="final-winner">
				<img src="imgs/win.png" />
			</div>
		</div>;
	}
});
