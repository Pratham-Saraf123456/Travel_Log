/*
    connecting the backend with the database

    as whole of my file and folder uses database so we must connect the database right at the 
    starting of the server

    >>>>
    Note 
        in order to remove the cors error of browser we need to add certain header to
        our response sender to the frontend 



    >>>> Note ::
    Multer ;; an important third party package that help us to store the multipart
    form-data as till now we can parse the json format data but now we are going to 
    switch to this form-data and advantage of this is that it allow us to parser
    both the text and file data or binary data 


    >>>
    we can use fs a file system used to interact with the file and folder
    and also note that multer add the 'file' property to the 'req'  


    >>>>>>>> IMORTANT THING TO NOTE
    none of the file from our server is accessible outside the server
    as for any request to our server it passes to the middleware and check whether the 
    url is valid or not 

    but for our image we dont have any middleware that will tell this so inorder
    to grant access we need to add a new middleware 
    we will register a url such that if any url that conatain upload/images
    it will grant the access 
    and we register a express.static middleware which return a file only return a file and
    not execute this and 
    in static we need to tell which file from which folder do we need to return and
    the path must be an absolute path and we will use the "path" package to form this

*/

const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placeRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/user-routes');
const HttpError = require('./models/http-error');

const url =`mongodb+srv://username:password@cluster0.sio3l.mongodb.net/mern?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images',express.static(path.join('uploads','images')));

//attaching certain header to the response to avoid error
app.use((req,res,next) => {
    //it allow us to set the domain that can send the request * means we are allowing request fromt all domains
    res.setHeader('Access-Control-Allow-Origin','*');

    //set the header 
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept , Authorization')

    //which http method are required
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE');

    next();
})

app.use('/api/places', placeRoutes);//this will only allow the url starting with /api/places to be accepted
app.use('/api/users',userRoutes);

//this will be executed if no routes above matches with the url
app.use((req,res,next) => {
    const error = new HttpError('Could not find the route page',404);

    throw error;
})

//error handling middleware
app.use((error,req,res,next) => {

    if(req.file){
        fs.unlink(req.file.path,err => {
            console.log(err);
        });
    }

    if(res.headerSent){
        return next(error);
    }

    res.status(error.code || 500);
    res.json({message : error.message || 'An Unkonwn error occured'});

})


mongoose.connect(url)
        .then(() => {
            console.log("Connection Established!!! ");
            app.listen(5000);
        })
        .catch(err => {
            console.log(err);
        })