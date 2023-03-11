/*
    here we are going to implement the context as it will help to access
    some of the data directly in the component where we want instead
    of passing those data through props i.e from parent to child or using the 
    function to pass from child to parent

    very nice concept in which many contex data is made

    we simply define the value , function , element that we want simply as
    an object of the data


    Note:
        in order to use this we need to wrap the top level component that hold all
        the component so that the component uses this 

        in this case we wrap the "App" component as it is the root/top level
        component 
        and it has Provider property that is used to wrap the component

        <AuthContext.Provider></AuthContext.Provider>
        the provider take the "value" props in which we bind the value we
        manage in our context 
        to intialize the object defined 
        whenever the value in the context changes the component wrapping 
        within it will be rendered

        it also help to maintain the appwide state

*/

import React,{createContext} from "react";


export const AuthContext = createContext({
    userId:null,
    isLoggedIn:false,
    token:null,
    login: () => {},
    logout:() => {}
});

