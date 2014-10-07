'use strict';

var utils = require('./utils');
var when = require('when');

// Generic "model" object. You can use whatever
// framework you want. For this application it
// may not even be worth separating this logic
// out, but we do this to demonstrate one way to
// separate out parts of your application.
var Model = function (key) {
    this.key = key;
    this.onChanges = [];
};

Model.prototype.load = function () {
    var me = this;
    return utils.store(this.key).then(function (todos) {
        me.todos = todos;
    });
};

Model.prototype.subscribe = function (onChange) {
    this.onChanges.push(onChange);
};


Model.prototype.inform = function () {
    var me = this;
    utils.store(this.key, this.todos).then(function () {
        me.onChanges.forEach(function (cb) {
            cb();
        });
    });
};

Model.prototype.addTodo = function (title) {
    this.todos = this.todos.concat({
        id: utils.uuid(),
        title: title,
        completed: false
    });

    this.inform();
};

Model.prototype.toggleAll = function (checked) {
    // Note: it's usually better to use immutable data structures since they're
    // easier to reason about and React works very well with them. That's why
    // we use map() and filter() everywhere instead of mutating the array or
    // todo items themselves.
    this.todos = this.todos.map(function (todo) {
        return utils.extend({}, todo, {completed: checked});
    });

    this.inform();
};

Model.prototype.toggle = function (todoToToggle) {
    this.todos = this.todos.map(function (todo) {
        return todo !== todoToToggle ?
            todo :
            utils.extend({}, todo, {completed: !todo.completed});
    });

    this.inform();
};

Model.prototype.destroy = function (todo) {
    this.todos = this.todos.filter(function (candidate) {
        return candidate !== todo;
    });

    this.inform();
};

Model.prototype.save = function (todoToSave, text) {
    this.todos = this.todos.map(function (todo) {
        return todo !== todoToSave ? todo : utils.extend({}, todo, {title: text});
    });

    this.inform();
};

Model.prototype.clearCompleted = function () {
    this.todos = this.todos.filter(function (todo) {
        return !todo.completed;
    });

    this.inform();
};

module.exports = Model;
