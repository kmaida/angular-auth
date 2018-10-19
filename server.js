/*
 |--------------------------------------
 | Dependencies
 |--------------------------------------
 */

// Modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// Config
const config = require('./api/config');

/*
 |--------------------------------------
 | App
 |--------------------------------------
 */

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set port
const port = '3000';
app.set('port', port);

// Set static path to Angular app in dist for staging / prod
if (process.env.NODE_ENV !== 'dev') {
  app.use('/', express.static(path.join(__dirname, './dist/angular-authentication')));
}

// Set static path to callback popup authentication window
// (This static page will auto-close the popup once authentication is completed)
// For more info: https://community.auth0.com/t/auth0-js-popup-autoclose/7365/2
app.use('/callback', express.static(path.join(__dirname, './callback')));

/*
 |--------------------------------------
 | Routes
 |--------------------------------------
 */

require('./api/routes')(app, config);

// Pass routing to Angular app
// (Don't run in dev)
if (process.env.NODE_ENV !== 'dev') {
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '/dist/angular-authentication/index.html'));
  });
}

/*
 |--------------------------------------
 | Server
 |--------------------------------------
 */

app.listen(port, () => console.log(`Server running on localhost:${port}`));
