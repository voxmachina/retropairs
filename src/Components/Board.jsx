/**
 * Board view
 */
var Board = React.createClass({
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

		return <div id="board">
			{this.state.photos.data.map(function(item, index) {
				return <Card onSelect={onSelect.bind(game, item)} item={item} key={item.id + '.' + index} />;
			})}
		</div>;
	}
});
