var _ = require('lodash');

var TodoModel = require('./todoModel');
var TodoApp = require('./app');
var model = new TodoModel('todos');
var React = require('react/addons');
var isBrowser = typeof window === 'object';

if (isBrowser) {
    model.subscribe(render);
}

var director = require('director');

var Router = isBrowser? director.Router : director.http.Router;

function render(filter) {
    var descriptor = <TodoApp model={model} nowShowing={filter}/>;
    var me = this;
    model.load().then(function () {
        // render the app on either client or server-side
        isBrowser ? renderClient(descriptor) : renderServer.call(me, descriptor);
    });
}

function renderClient(descriptor) {
    React.renderComponent(descriptor, document.getElementById('todoapp'));
}

function renderServer(descriptor) {
    var fs = require('fs');
    var cheerio = require('cheerio');
    var me = this;
    fs.readFile('./index.html', {encoding: 'utf8'}, function (error, content) {
        var res = me.res;
        if (error) {
            res.status(500).end();
            return;
        }

        var $ = cheerio.load(content);
        $('#todoapp').html(React.renderComponentToString(descriptor));
        res.status(200).send($.html());
    });
}

function onRoute(filter) {
    render.call(this, filter || 'all' );
}

var routes = {
    on: onRoute,
    get: onRoute
};

module.exports = new Router({
    '/(\\w+)?': routes
});