// Dependencies
const express = require('express');
const path = require('path');
// App
const app = express();

// Security middleware
function resSec(req, res, next) {
  if (app.get('env') !== 'stage') {
    // HTTP Strict Transport Security (HSTS)
    // Enforces HTTPS across the entire app
    // While nginx can do a redirect, HSTS redirects
    // before anything is sent to the server
    // (Only run this in an SSL environment)
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

// Set static path to Angular app
app.use('/', express.static(path.join(__dirname, './dist/angular-auth')));
// Pass routing to Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/angular-auth/index.html'));
});

// Server
const port = '3000';
app.listen(port, () => console.log(`Server running on localhost:${port}`));
