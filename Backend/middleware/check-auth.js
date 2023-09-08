

const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

module.exports = (req,res,next) => {
    if(req.method === 'OPTIONS'){
        return next();
    }

    let token;
    try{
        token = req.headers.authorization.split(' ')[1]; // as the authorisatin is of the form 'Bearer token'
        if(!token){
            throw new Error('Authentication Failed');
        }

        const decodedToken = jwt.verify(token,'supersecre_dont_share_to_any_one');
        req.userData = {userId : decodedToken.userId};

         next();

    }catch(err){
        const error = new HttpError('Authentication Failed',401);

        return next(error);
    }
}
