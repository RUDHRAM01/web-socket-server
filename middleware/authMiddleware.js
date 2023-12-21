// const jwt = require('jsonwebtoken');
// const User = require('../models/UserModel');



// const protect = async (req, res,next) => {
//       try {
//           let token;
          
  
//         if (req.cookies && req.cookies.xxrsr) {
//           token = req.cookies.xxrsr;
  
//             if (!token) {
//               console.log("error : token for found")
//             return res.status(401).json({ msg: 'Not authorized. Token not found.' });
//           }
  
//           const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = await User.findById(decoded.id).select('-password');
//             next();
//         } else {
//             console.log(req.cookies,req.cookie)
//             console.log("error : cookies not found")
//           // You may want to handle the case where the cookie is not present.
//           return res.status(401).json({ msg: 'Not authorized. Token not provided.' });
//         }
//       } catch (err) {

//         console.error(err);
  
//         if (err.name === 'JsonWebTokenError' && err.message === 'jwt malformed') {
//           return res.status(401).json({ msg: 'Malformed token. Please provide a valid token.' });
//         }
  
//         return res.status(401).json({ msg: 'Not authorized. Token verification failed.' });
//       }
    
//   };
  

// module.exports = {
//   protect
// };


// way 2

const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const protect = async (req, res, next) => {
    let token;

    // Check if the authorization header exists and starts with 'Bearer'
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    // No token found
    if (!token) {
        return res.status(401).json({ msg: 'Not authorized, no token' });
    }

    // Token exists, proceed to verify it
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user data to the request object
        req.user = await User.findById(decoded.id).select('-password');
        
        next(); // Proceed to the next middleware
    } catch (err) {
        console.error(err);
        if (err.name === 'JsonWebTokenError' && err.message === 'jwt malformed') {
            return res.status(401).json({ msg: 'Malformed token. Please provide a valid token.' });
        }
        return res.status(401).json({ msg: 'Not authorized, token failed' });
    }
}

module.exports = {
    protect
}