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
	 * @param identifier
	 */
	onCardSelect: function(card, identifier) {
		var cards = this.state.selectedCards;

		if (cards.length !== undefined && cards.length === 1) {
			if (this.areCardsEqual(cards[0], card)) {
				this.getFlux().actions.equalFound(card);
			} else {
				this.getFlux().actions.nextPlayer();
			}

			setTimeout(function() {
				this.getFlux().actions.resetSelectedCards();
			}.bind(this), 1000);
		}

		this.getFlux().actions.selectCard(card, identifier);

		if (this.state.matched.length*2 === this.state.photos.data.length) {
			this.getFlux().actions.endGame();
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
