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
const config = require('./config');

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

// Set static path to Angular app
// (Don't run in dev)
if (app.get('env') !== 'dev') {
  app.use('/', express.static(path.join(__dirname, '../dist/angular-auth')));
}

/*
 |--------------------------------------
 | Security
 |--------------------------------------
 */

// Response security middleware
function resSec(req, res, next) {
  if (app.get('env') !== 'dev' && app.get('env') !== 'stage') {
    // HTTP Strict Transport Security (HSTS)
    // Enforces HTTPS across the entire app
    // While nginx can do a redirect, HSTS redirects
    // before anything is sent to the server
    // (Only check this in a production environment)
    res.setHeader('Strict-Transport-Security', 'max-age=630720');
  }
  // Defend against Cross Site Scripting (XSS)
  // This is when a malicious entity injects scripts
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Require iFrame sources to come from the same origin
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  // Content Security Policy
  // Preventing XSS to ensure scripts only come
  // from approved origins
  res.setHeader("Content-Security-Policy", "script-src 'self'");
  // Send the request on with security headers
  return next();
}
app.use(resSec);

/*
 |--------------------------------------
 | Routes
 |--------------------------------------
 */

require('./routes')(app, config);

/*
 |--------------------------------------
 | Server
 |--------------------------------------
 */

app.listen(port, () => console.log(`Server running on localhost:${port}`));
