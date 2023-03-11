import React,{useCallback,useReducer,useContext} from "react";
import { useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { AuthContext } from "../../shared/context/auth-context";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import {useForm} from '../../shared/hooks/form-hooks'
import { useHttpClient } from "../../shared/hooks/http-hooks";
import './PlaceForm.css';

/*
    as whenever the component reload for any state change the function define
    inside the component is rendered again
    so there may be a chance that we get stuck into the infinite loop
    therefore we use the concept of "useCallback" that define/declare the 
    function only when the parameter assign to it changes


    the formReducer simply responsible to check the validity of the form
    and setting the changed value to the variables
*/

// const formReducer = (state,action) => {
//     switch(action.type){
//         case 'INPUT_CHANGE':
//             let formIsValid = true;
//             for(const inputId in state.inputs){
//                 if(inputId === action.id){
//                     formIsValid = formIsValid && action.isValid;
//                 }
//                 else{
//                     formIsValid = formIsValid && state.inputs[inputId].isValid;
//                 }
//             }
//             return ({
//                 ...state,
//                 inputs:{
//                     ...state.inputs,
//                     [action.id] : {
//                         value:action.value,
//                         isValid:action.isValid
//                     }
//                 },
//                 isValid:formIsValid
//             });
//         default :
//             return state;
//     }
// }

const NewPlace = () => {
    const auth = useContext(AuthContext);
    const {isLoading,error,sendRequest,clearError} = useHttpClient();
    
    const [formState,formValidateHandler] = useForm({
            title:{
                value:'',
                isValid:false
            },
            description:{
                value:'',
                isValid:false
            },
            address:{
                value:'',
                isValid:false
            },
            image:{
                value: null,
                isValid:false
            }
        },
        false
    );


    //this simply allow us to navigate to the pages as required;
    const history = useHistory();

    const placeSubmitHandler = async (event) => {
        event.preventDefault();

        try{
            const formData = new FormData();
            formData.append('title',formState.inputs.title.value);
            formData.append('description',formState.inputs.description.value);
            formData.append('address',formState.inputs.address.value);
            formData.append('image',formState.inputs.image.value);
            // formData.append('creator',auth.userId);

            const responseData = await sendRequest(
                'http://localhost:5000/api/places',
                'POST',
                formData,
                {
                    Authorization:'Bearer '+ auth.token
                }
                )

            //redirect the use to different page
            history.push('/');
        }catch(err){ }

        /*
            JSON.stringify({
                    title:formState.inputs.title.value,
                    description:formState.inputs.description.value,
                    address:formState.inputs.address.value,
                    creator:auth.userId
                }),
                {'Content-Type':'application/json'}
        */
        
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner asOverlay />}
            <form className="place-form" onSubmit={placeSubmitHandler}>
                <Input 
                    id="title"
                    element="input" 
                    type="text" 
                    label="Title" 
                    error="Please Enter the valid Title" 
                    validators={[VALIDATOR_REQUIRE()]}
                    onInput={formValidateHandler}
                />
                <Input 
                    id="description"
                    element="textarea"
                    label="Description" 
                    error="Please Enter the the description of minLength(5)" 
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    onInput={formValidateHandler}
                />
                <Input 
                    id="address"
                    element="input"
                    label="Address" 
                    error="Please Enter Address)" 
                    validators={[VALIDATOR_REQUIRE()]}
                    onInput={formValidateHandler}
                />
                <ImageUpload id="image" onInput={formValidateHandler} errorText ={"Pleas Provide an Image"}/>
                <Button type="submit" disabled={!formState.isValid}>
                    Add Place
                </Button>
            </form>
        </React.Fragment>
    );
};

export default NewPlace;


/*
     // const [formState,dispatch] = useReducer(formReducer,({
    //     inputs:{
    //         title:{
    //             value:'',
    //             isValid:false
    //         },
    //         description:{
    //             value:'',
    //             isValid:false
    //         },
    //         address:{
    //             value:'',
    //             isValid:false
    //         }
    //     },
    //     isValid:false
    // }));

    // const formValidateHandler = useCallback( (id,value,isValid) => {

    //     dispatch({
    //         type:"INPUT_CHANGE",
    //         id:id,
    //         value:value,
    //         isValid:isValid
    //     })
    // },[]);
*/
