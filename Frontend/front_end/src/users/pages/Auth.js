import React,{useState,useContext} from "react";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hooks";
import { useHttpClient } from "../../shared/hooks/http-hooks";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { VALIDATOR_EMAIL,VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import './Auth.css';

/*
    this component simply use to define the authentication page of the application

    now we are connecting our frontend with the backend
    for this send the request in the backend
    to send request we are going to use "fetch" and instead of this we can
    also use "axios" or any other third party package 
    "fetch" is a built in api that is used to send request

    fetch function need a first argument in a string form that is the url at the backend

    >>>>>>>>NOTE
    JSON.stringify() is the method by which our normal javascript object , array will be
    converted to the json format

    fetch always return a response

    if the fetch get a 500 or 400 error from backend it donot treat this as an error 
    response.ok  where ok is the property attached to the response which is true for
    200ish code but is false for 400 or 500 code  
*/

const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLogInMode,setIsLogInMode] = useState(true);
    const {isLoading,error,sendRequest,clearError} = useHttpClient();
    // const [isLoading,setIsLoading] = useState(false);
    // const [error,setError] = useState();

    const [formState,formValidateHandler,setInitialInputHandler] = useForm({
        email:{
            value:"",
            isValid:false
        },
        password:{
            value:"",
            isValid:false
        }
    },
    false
    )

    const loginHandler = async (event) => {
        event.preventDefault();
        console.log(formState.inputs);

        if(isLogInMode){
            try{

                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/login',
                    'POST',
                    JSON.stringify({
                        email:formState.inputs.email.value,
                        password:formState.inputs.password.value
                    }),
                    {'Content-Type':'application/json'}
                )

                auth.login(responseData.userId,responseData.token);

            }catch(err){

            }
        }
        else{
            /*
                here we simply passing the data in the json format but the
                image is in binary form so json donot accept it so we are goning to
                use the the formData which is inbuild package to store the data
                
                and we need not to set the header as it will automatically set it
            */
            try{

                const formData = new FormData();
                formData.append('email',formState.inputs.email.value);
                formData.append('name',formState.inputs.name.value);
                formData.append('password',formState.inputs.password.value);
                formData.append('image',formState.inputs.image.value);

                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/signup',
                    'POST',
                    formData
                    );
                
                
                auth.login(responseData.userId,responseData.token);

            }catch(err){
            }

            //it is used when we are not using the binary data 
            // JSON.stringify({
            //     name:formState.inputs.name.value,
            //     email:formState.inputs.email.value,
            //     password:formState.inputs.password.value
            // }),
            // {'Content-Type':'application/json'}
        }

        //***logic before creating the custom http hook
    // const loginHandler = async (event) => {
    //     event.preventDefault();

    //     if(isLogInMode){
    //         try{
    //             setIsLoading(true);
    //             const response = await fetch('http://localhost:5000/api/users/login',{
    //                 method:'POST',
    //                 headers:{
    //                     'Content-Type':'application/json'
    //                 },
    //                 body:JSON.stringify({
    //                     email:formState.inputs.email.value,
    //                     password:formState.inputs.password.value
    //                 })
    //             })

    //             const responseData = await response.json();

    //             if(!response.ok){
    //                 throw new Error(responseData.message);
    //             }

    //             setIsLoading(false);
    //             auth.login();


    //         }catch(err){
    //             setIsLoading(false);
    //             setError(err.message || "Login Failed");
    //         }
    //     }
    //     else{

    //         try{
    //             setIsLoading(true);
    //             const response = await fetch('http://localhost:5000/api/users/signup',{
    //                 method:'POST',
    //                 headers:{
    //                     'Content-Type':'application/json'
    //                 },
    //                 body:JSON.stringify({
    //                     name:formState.inputs.name.value,
    //                     email:formState.inputs.email.value,
    //                     password:formState.inputs.password.value
    //                 })
    //             });

    //             const responseData = await response.json();

    //             if(!response.ok){
    //                 throw new Error(responseData.message);
    //             }

    //             setIsLoading(false);
    //             auth.login();

    //         }catch(err){
    //             // console.log(err);
    //             setIsLoading(false);
    //             setError(err.message || 'Something went wrong , please try again!');
    //         }
    //     }

        // console.log(formState.inputs);
        // auth.login();
    }

    const switchModeHandler = () => {
        if(!isLogInMode){
            setInitialInputHandler(
                {
                    ...formState.inputs,
                    name:undefined,
                    image:undefined
                },
                formState.inputs.email.isValid && formState.inputs.password.isValid
            )
        }
        else{
            setInitialInputHandler(
                {
                    ...formState.inputs,
                    name:{
                        value:"",
                        isValid:false
                    },
                    image:{
                        value:null,
                        isValid:false
                    }
                },
                false
            )
        }

        setIsLogInMode(prevMode => !prevMode);
    }

    const errorHandler = () => {
        clearError(null);
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={errorHandler}/>
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>Login Required</h2>
                <hr />
                <form onSubmit={loginHandler}>
                    {!isLogInMode && 
                        <Input 
                            id="name"
                            type="text"
                            element="input"
                            label="Name"
                            error="Please enter your name"
                            validators={[VALIDATOR_REQUIRE()]}
                            onInput = {formValidateHandler}
                        />
                    }
                    {
                        !isLogInMode && <ImageUpload center id="image" onInput={formValidateHandler} errorText ={"Pleas Provide an Image"}/>
                    }
                    <Input
                        id="email"
                        type="email"
                        element="input"
                        label="E-mail"
                        error="Enter the correct mail id"
                        validators={[VALIDATOR_EMAIL()]}
                        onInput = {formValidateHandler}
                    />
                    <Input
                        id="password"
                        type="password"
                        element="input"
                        label="Password"
                        error="Enter password having min length 5"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        onInput={formValidateHandler}
                    />
                    <Button type="submit" disabled={!formState.isValid}> {isLogInMode ? "LogIn" : "SignUp"}</Button>
                </form>
                <Button onClick={switchModeHandler}>Switch To {isLogInMode ? "SignUp" : "Login"}</Button>
            </Card>
        </React.Fragment>
    );
}

export default Auth;