/**
 * Card view
 */
var Card = React.createClass({
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

		return <div onClick={this.props.onSelect} id={this.props.item.id} className="card" style={cardStyle}></div>;
	}
});
