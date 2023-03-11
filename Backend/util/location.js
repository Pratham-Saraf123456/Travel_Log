/*
    To send  a request from inside a node app is cumbersome and tough job
    we have some build in coremodule that help us in sending request
    inside the node app but it is cumbersome to use them therefore

    we use third party package named "axios" it is a famous package to send 
    http request from frontend to backend and it can also be used in the
    node package to send request from the server  

    this package allow us to send request from node server to another server

    >>>>
    encodeURIComponent : it is a global method available to node js to directly encode 
    anything to url friendly

*/

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

//now we will use google api to get the coordinates as i dont have any api we dont use this now 
// const getCoordsForAddress = async (address) => {
//     const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=YOUR_API_KEY`)

//     const data = response.data;

//     if(!data || data.status === 'ZERO_RESULTS'){
//         const error = new HttpError('Could not find the loaction for the entered address.!!',422);
//         throw error;
//     }

//     const coordinates = data.results[0].geometry.location;

//     return coordinates;

// }


module.exports = getCoordsForAddress;
