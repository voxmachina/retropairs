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

		return <div id="board" className="container">
			{this.state.photos.data.map(function(item, index) {
				return <Card identifier={item.id + '.' + index}
							 onSelect={onSelect.bind(game, item, item.id + '.' + index)} item={item}
							 key={item.id + '.' + index} />;
			})}
		</div>;
	}
});
