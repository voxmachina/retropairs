/**
 * Application setup
 */
var Notifications = React.createClass({
	/**
	 * Render the view
	 *
	 * @returns {XML}
	 */
	render: function () {
		var className = "row players-setup-container notifications";

		if (this.props.active) {
			className += " active";
		}

		return <div className={className}>
			<p>{this.props.msg}</p>
		</div>;
	}
});
