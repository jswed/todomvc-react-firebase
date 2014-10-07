'use strict';

var fb = require('firebase');
var when = require('when');
var rootRef = new fb("https://garryyao.firebaseio.com/");
module.exports = {
    uuid: function () {
        /*jshint bitwise:false */
        var i, random;
        var uuid = '';

        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
                .toString(16);
        }

        return uuid;
    },

    pluralize: function (count, word) {
        return count === 1 ? word : word + 's';
    },

    store: function (namespace, data) {
        var df = when.defer();
        var ref = rootRef.child(namespace);
        if (data) {
            ref.set(data, function onComplete(error) {
                if (error) {
                    df.reject(new Error("failed to persist todos." + error));
                    return;
                }
                df.resolve(data);
            });
        } else {
            ref.once('value', function onRead(snap) {
                df.resolve(snap.val()||[]);
            }, function onError(err) {
                df.reject(new Error("failed to retrieve todos." + err));
            });
        }
        return df.promise;
    },

    extend: function () {
        var newObj = {};
        for (var i = 0; i < arguments.length; i++) {
            var obj = arguments[i];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    newObj[key] = obj[key];
                }
            }
        }
        return newObj;
    }
};
