

const multer = require('multer');
const {v1 : uuid} = require('uuid');

//this simply define the file type which we are accepting
const MIME_TYPE_MAP= {
    'image/png':'png',
    'image/jpg':'jpg',
    'image/jpeg':'jpeg'

}

const fileUpload = multer({
    limits:500000,
    storage:multer.diskStorage({
        destination : (req,file,cb) => {
            //name of the place where the image will be stored
            cb(null,'uploads/images');
        },
        filename:(req,file,cb) => {
            //file mimetype give the same extension as define in MIME_TYPE_MAP and 
            //then it return the extension
            const ext = MIME_TYPE_MAP[file.mimetype];

            //the second argument define the name of the file
            cb(null,uuid() + '.' + ext);
        },
        fileFilter: (req,file,cb) => {
            //simply throw error if file with not present extension is tried to be uploades
            const isValid = !!MIME_TYPE_MAP[file.mimetype];
            const error = isValid ? "null" : new Error('The mimetype is invalid!!');

            cb(error,isValid);
        }
    })
});

module.exports = fileUpload;
