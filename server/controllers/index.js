const auth = require('./auth');
const queries = require('./query');
const crops = require('./crops');
const weather = require('./weather');
const profile = require('./profile');
const errors = require('./error');
const admin = require('./admin');

module.exports = { auth , queries , crops , admin, weather , profile , errors };