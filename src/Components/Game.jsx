/**
 * Main application view controller
 */
var Game = React.createClass({
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
	 * On selecting a card
	 *
	 * @param card
	 */
	onCardSelect: function(card) {
		var cards = this.state.selectedCards;

		if (cards.length !== undefined && cards.length === 1) {
			if (this.areCardsEqual(cards[0].card, card)) {
				this.getFlux().actions.equalFound(card);
			} else {
				this.getFlux().actions.nextPlayer();
			}

			this.getFlux().actions.resetSelectedCards();
		} else {
			this.getFlux().actions.selectCard(card);
		}
	},
	/**
	 * Determines if current selected cards are equal
	 */
	areCardsEqual: function(firstCard, secondCard) {
		return firstCard.id !== undefined && secondCard.id !== undefined && firstCard.id === secondCard.id;
	},
	/**
	 * Render application
	 *
	 * @returns {XML}
	 */
	render: function () {
		return <div id="game">
			<StatusBar />
			<Board game={this} onCardSelect={this.onCardSelect} />
		</div>;
	}
});
