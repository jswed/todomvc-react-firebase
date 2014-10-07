/**
 * @jsx React.DOM
 */
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React */

(function () {
	'use strict';

    var utils = require('./utils');
    var React = require('react/addons');
    var _ = require('lodash');

    module.exports = React.createClass({
        handleLink: function (next, evt) {
            var router = require('./routes');
            router.setRoute(next);
        },
		render: function () {
			var activeTodoWord = utils.pluralize(this.props.count, 'item');
			var clearButton = null;

			if (this.props.completedCount > 0) {
				clearButton = (
					<button
						id="clear-completed"
						onClick={this.props.onClearCompleted}>
						Clear completed ({this.props.completedCount})
					</button>
				);
			}

			// React idiom for shortcutting to `classSet` since it'll be used often
			var cx = React.addons.classSet;
			var nowShowing = this.props.nowShowing;
			return (
				<footer id="footer">
					<span id="todo-count">
						<strong>{this.props.count}</strong> {activeTodoWord} left
					</span>
					<ul id="filters">
						<li>
							<a href="javascript:;" onClick={_.partial(this.handleLink, '/')} className={cx({selected: nowShowing === 'all'})}> All </a>
                        </li>
						{' '}
						<li>
                            <a href="javascript:;" onClick={_.partial(this.handleLink, '/active')} className={cx({selected: nowShowing === 'active'})}> Active </a>
                        </li>
						{' '}
						<li>
							<a href="javascript:;" onClick={_.partial(this.handleLink, '/completed')} className={cx({selected: nowShowing === 'completed'})}>Completed</a>
                        </li>
					</ul>
					{clearButton}
				</footer>
			);
		}
	});
})();
