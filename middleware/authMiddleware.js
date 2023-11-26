const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const protect = async (req, res, next) => {
    // if mode is developement then skip the auth
    // if (process.env.NODE_ENV === 'development') {
    //     return next();
    // }
  let token;
  // Check if the token is present in cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  console.log(token)
  // No token found
  if (!token) {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  // Token exists, proceed to verify it
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user data to the request object
    req.user = await User.findById(decoded.id).select('-password');
    console.log(req.user)
    next(); // Proceed to the next middleware
  } catch (err) {
    console.error(err);
    if (err.name === 'JsonWebTokenError' && err.message === 'jwt malformed') {
      return res.status(401).json({ msg: 'Malformed token. Please provide a valid token.' });
    }
    return res.status(401).json({ msg: 'Not authorized, token failed' });
  }
};

module.exports = {
  protect
};


// way 2

// const jwt = require('jsonwebtoken');
// const User = require('../models/UserModel');

// const protect = async (req, res, next) => {
//     let token;

//     // Check if the authorization header exists and starts with 'Bearer'
//     if (
//         req.headers.authorization &&
//         req.headers.authorization.startsWith('Bearer')
//     ) {
//         token = req.headers.authorization.split(' ')[1];
//     }

    
//     // No token found
//     if (!token) {
//         return res.status(401).json({ msg: 'Not authorized, no token' });
//     }

//     // Token exists, proceed to verify it
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
//         // Add user data to the request object
//         req.user = await User.findById(decoded.id).select('-password');
        
//         next(); // Proceed to the next middleware
//     } catch (err) {
//         console.error(err);
//         if (err.name === 'JsonWebTokenError' && err.message === 'jwt malformed') {
//             return res.status(401).json({ msg: 'Malformed token. Please provide a valid token.' });
//         }
//         return res.status(401).json({ msg: 'Not authorized, token failed' });
//     }
// }

// module.exports = {
//     protect
// }