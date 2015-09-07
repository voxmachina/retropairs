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
	 * Render application
	 *
	 * @returns {XML}
	 */
	render: function () {
		var cardStyle = {
			backgroundImage: 'url(imgs/card.jpg)'
		};

		if(this.isCardSelected()) {
			cardStyle = {
				backgroundImage: 'url(' + this.props.item.photoUrl + ')'
			};
		}

		return <div onClick={this.props.onSelect} id={this.props.item.id} className="card" style={cardStyle}></div>;
	}
});
