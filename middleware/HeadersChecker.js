const CryptoJS = require('crypto-js');
const HeadersChecker = (req, res, next) => {   
    if (process.env.NODE_ENV === 'development') return next();
    
    if (!req.headers['x-app-type']) {
        return res.status(400).json({ msg: 'UnAuthorized Request 💻' });
        }
        
    if (req.headers['x-app-type'] !== 'RsRequest') {
        return res.status(400).json({ msg: 'UnAuthorized Request 💻' });
        }
    
    if (!req.headers['x-request-id']) {
        return res.status(400).json({ msg: 'UnAuthorized Request 💻' });
        }
    
    if (!req.headers['x-hashed-id']) {
        return res.status(400).json({ msg: 'UnAuthorized Request 💻' });
        }
    
    if (!req.headers['x-request-token']) {
        return res.status(400).json({ msg: 'UnAuthorized Request 💻' });
        }
    
        const requestId = req.headers['x-request-id'];
        const hashedId = req.headers['x-hashed-id'];
        const requestToken = req.headers['x-request-token'];
        const bytes = CryptoJS.AES.decrypt(hashedId, requestToken);
        const tok = bytes.toString(CryptoJS.enc.Utf8);
    if (requestId !== tok) {
        return res.status(400).json({ msg: 'UnAuthorized Request 💻' });
    }
    next();
}

module.exports = {
    HeadersChecker
}