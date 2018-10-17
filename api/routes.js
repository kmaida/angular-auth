/*
 |--------------------------------------
 | Dependencies
 |--------------------------------------
 */

// Auth
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
// Data
const dinosData = require('./data/dinos.json');
const dragonsData = require('./data/dragons.json');

/*
 |--------------------------------------
 | Authentication Middleware
 |--------------------------------------
 */

module.exports = function(app, config) {
  // Authentication middleware
  const authCheck = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${config.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    audience: config.AUTH0_API_AUDIENCE,
    issuer: `https://${config.AUTH0_DOMAIN}/`,
    algorithm: 'RS256'
  });

/*
 |--------------------------------------
 | API Routes
 |--------------------------------------
 */

  // GET API root
  app.get('/api/', (req, res) => {
    res.send('API works');
  });

  // GET public data (dinosaurs)
  app.get('/api/public', (req, res) => {
    res.json(dinosData)
  });

  // GET secure data (dragons)
  app.get('/api/secure', authCheck, (req, res) => {
    res.json(dragonsData);
  });

};
