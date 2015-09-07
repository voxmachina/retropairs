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
	 * Determines if this card is already matched
	 */
	isMatched: function() {
		var cardId = this.props.item.id;
		var dataSet = this.state.matched.filter(function(item) {
			return item.card.id === cardId;
		});

		return dataSet.length > 0;
	},
	/**
	 * Get image bg
	 * @returns {{backgroundImage: string}}
	 */
	getPhotoBackground: function() {
		return {backgroundImage: 'url(' + this.props.item.photoUrl + ')'};
	},
	/**
	 * get template bg
	 */
	getCardBackground: function() {
		return {backgroundImage: 'url(imgs/card.png)'};
	},
	/**
	 * Render application
	 *
	 * @returns {XML}
	 */
	render: function () {
		var cardStyle = this.getCardBackground();
		var className = "card";

		if(this.isMatched()) {
			className += " matched-card";
			cardStyle = this.getPhotoBackground();
		} else if(this.isCardSelected()) {
			className += " selected-card";
			cardStyle = this.getPhotoBackground();
		} else {
			className += " off-card";
		}

		return <div className={className} onClick={this.props.onSelect} id={this.props.item.id}
					style={cardStyle}></div>;
	}
});
