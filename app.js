/**
 * Main application view controller
 */
var Application = React.createClass({displayName: "Application",
	/**
	 * Render application
	 *
	 * @returns {XML}
	 */
	render: function () {
		return React.createElement("div", null, "Hello!");
	}
});

/**
 * Render application
 */
React.render(React.createElement(Application, null), document.getElementById('container'));
