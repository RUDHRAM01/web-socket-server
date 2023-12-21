const CryptoJS = require('crypto-js');
const HeadersChecker = (req, res, next) => {   
    if (process.env.NODE_ENV === 'development') return next();
    
    if (!req.headers['x-app-type']) {
        console.log("error 1");
        throw new Error('app type header not present');
        }
        
    if (req.headers['x-app-type'] !== 'RsRequest') {
        console.log("error 2");
        throw new Error('app type header not valid');
        }
    
    if (!req.headers['x-request-id']) {
        console.log("error 3");
        throw new Error('request id header not present');
        }
    
    if (!req.headers['x-hashed-id']) {
        console.log("error 4");
        throw new Error('hashed id header not present');
        }
    
    if (!req.headers['x-request-token']) {
        console.log("error 5");
        throw new Error('request token header not present');
        }
    
        const requestId = req.headers['x-request-id'];
        const hashedId = req.headers['x-hashed-id'];
        const requestToken = req.headers['x-request-token'];
        const bytes = CryptoJS.AES.decrypt(hashedId, requestToken);
        const tok = bytes.toString(CryptoJS.enc.Utf8);
        console.log("error middle");
    if (requestId !== tok) {
        console.log("error 6");
            throw new Error('hashed id header not valid');
    }
    next();
}

module.exports = {
    HeadersChecker
}