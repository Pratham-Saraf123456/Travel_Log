/*
    it is the custom hook that uses all the inbuild hooks in react and
    allow user to make changes and this will render the compononet on changing
    it is very useful as it treated the same as the other hooks the only difference
    is that it uses the other hooks also

    it also start with "use" and then the name that we want to give to hook

*/

import React,{useCallback,useReducer} from "react";


const formReducer = (state,action) => {
    switch(action.type){
        case 'INPUT_CHANGE':
            let formIsValid = true;
            // console.log("-->>",action.id);
            // console.log(state.inputs);
            for(const inputId in state.inputs){
                if(!state.inputs[inputId]){
                    continue;
                }
                
                if(inputId === action.id){
                    formIsValid = formIsValid && action.isValid;
                }
                else{
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }
            // console.log("--->> fmValid" ,formIsValid);

            return ({
                ...state,
                inputs:{
                    ...state.inputs,
                    [action.id] : {
                        value:action.value,
                        isValid:action.isValid
                    }
                },
                isValid:formIsValid
            });
        case "SET_INPUT":
            return (
                {
                    inputs:action.inputs,
                    isValid:action.formValid
                }
            );
        default :
            return state;
    }
}


/*
    here we are not initialising the formState with the default by our own instead
    we are taking the initial value from the component from they are being called

    our hook must also return something because we are not intrested in the form
    hook inside the hook instead we are intrested in the place where we use the 
    hook . We can return the object , array , simle text etc..

    here we return the value that we need in our component 
*/

export const useForm = (initialInputs,initialInputValidator) => {
    const [formState,dispatch] = useReducer(formReducer,({
        inputs:initialInputs,
        isValid:initialInputValidator
    }));

    const formValidateHandler = useCallback( (id,value,isValid) => {

        dispatch({
            type:"INPUT_CHANGE",
            id:id,
            value:value,
            isValid:isValid
        })
    },[]);

    const setInitialInputHandler = useCallback((initialInputs,initalFormValidator) => {
        dispatch({
            type:"SET_INPUT",
            inputs:initialInputs,
            formValid:initalFormValidator
        })
    },[]);

    return [formState,formValidateHandler,setInitialInputHandler];

}