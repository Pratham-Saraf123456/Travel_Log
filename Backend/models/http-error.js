/*
    it simply contain the class of error handling which extend the Error class
   
*/

class HttpError extends Error {
    constructor(message,errorCode){
        super(message); //=> add a "message" property
        this.code = errorCode ; //=> add the code property
    }
}

module.exports = HttpError;