/*

*/

const express = require('express');
const {check} = require('express-validator');

const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');
const placeController =  require('../controllers/places-controllers');

const router = express.Router();


router.get('/:pId',placeController.getPlaceById);

router.get('/user/:uId',placeController.getPlacesByUserId);

router.post('/',checkAuth,
                fileUpload.single('image'),
                [
                    check('title').not().isEmpty(),
                    check('description').isLength({min:5}),
                    check('address').not().isEmpty()
                ]
                ,placeController.postCreatePlace);

router.patch('/:pId',checkAuth,
                    [
                        check('title').not().isEmpty(),
                        check('description').isLength({min:5})
                    ]
                    ,placeController.patchUpdatePlace);

router.delete('/:pId',checkAuth,placeController.deletePlace);

module.exports = router;

