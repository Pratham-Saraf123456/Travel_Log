

const axios = require('axios');

const HttpError = require('../models/http-error');

const API_KEY= "kdjfkajd";

//dummy coordinate getting from address but in reality we will do it by using api
const getCoordsForAddress = (address) => {
    return {
        lat: 40.7484405,
        lng: -73.9856644
    };
}



module.exports = getCoordsForAddress;
