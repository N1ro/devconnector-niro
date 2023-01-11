const jwt = require('jsonwebtoken');
const config = require('config');

// Middleware is function that has requiest to 'req' & 'res'
// 'next' is a call back function which moves to next piece of middleware
module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({
      msg: 'No Token, authorisation denied'
    });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    // this is the 'user' object thats available on 'jwt' token once decoded
    req.user = decoded.user;

    next();
  } catch (err) {
    res.status(401).json({
      msg: 'Token is not valid'
    });
  }
};
