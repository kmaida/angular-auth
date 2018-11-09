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
const allDinos = dinosData.map(dino => {
  return {
    name: dino.name,
    pronunciation: dino.pronunciation
  }
});

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
    audience: [config.CLIENT_ID],
    issuer: `https://${config.AUTH0_DOMAIN}/`,
    algorithm: 'RS256'
  });

/*
 |--------------------------------------
 | API Routes
 |--------------------------------------
 */

  // Simulate live server call by adding random delay
  function delay() {
    return Math.random() * 2500;
  }

  // GET API root
  app.get('/api/', (req, res) => {
    res.send('API works');
  });

  // GET public data (dinosaurs list)
  app.get('/api/dinosaurs', (req, res) => {
    setTimeout(() => {
      res.json(allDinos);
    }, delay());
  });

  // GET secure data (dinosaur details by name)
  app.get('/api/secure/dinosaur/:name', authCheck, (req, res) => {
    setTimeout(() => {
      const name = req.params.name;
      const thisDino = dinosData.find(dino => dino.name.toLowerCase() === name);
      res.json(thisDino);
    }, delay());
  });

};
