var router = require('./lib/routes');
router.configure({html5history: true}).init(location.pathname);