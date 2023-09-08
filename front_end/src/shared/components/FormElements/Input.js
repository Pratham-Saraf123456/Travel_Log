import React,{useReducer,useEffect} from "react";

import {validate} from '../../util/validators';
import './Input.css'

/*
    it is used in Newplacess component

    this component is little complex as it will contain may information

    note there is a website called formik that help to build a form and
    also do the validation easily

    useReducer is a hook that help to manage the state a state in a component and
    also give us a function which updates the state and rerender the component
    and it came into use when two or more state are dependent on each other
    so instead of using useState we perfer useReducer 

    we difene useReducer then at least one argument need to be passed
    it is a function that receives an action that we can dispatch
    and perceive the current state based on the action we received and
    return the new state and the useReducer will take the newState and give
    that back to the component and rerender everything

    userReducer take function as an argument the functon has two parameter
    as state and action 
    the other parameter of useReducer is to initialze with initial value
    and it also return two is state and other is dispatch function

*/

const inputReducer = (state,action) => {
    if(action.type === 'CHANGE'){
        // const val = action.val === ''?false : true;
        return {
            ...state,
            value:action.val,
            isValid:validate(action.val,action.validators)
        };
    }

    if(action.type==='TOUCH'){
        return (
            {
                ...state,
                isTouch:true
            }
        );
    }

    return  state;
}

const Input = props => {

    const [inputState,dispatch] = useReducer(inputReducer,{
        value : props.value || '',
        isValid:props.valid || false,
        isTouch:false
    });

    const changeHandler = event => {
        dispatch({
            type:'CHANGE',
            val:event.target.value,
            validators:props.validators
        })
    }

    const { id , onInput } =props;
    const {value,isValid} = inputState;

    useEffect(()=>{

        onInput(id,value,isValid);
    },[id,value,isValid,onInput]);

    const touchHandler = event => {
        dispatch ({
            type:'TOUCH'
        });
    }

    const element = props.element === 'input' ? 
    (<input id={props.id} type={props.type} placeholder={props.placeholder} onChange={changeHandler} onBlur={touchHandler} value={inputState.value} />) :
    (<textarea id={props.id} rows={props.rows || 3} onChange={changeHandler} onBlur={touchHandler} value={inputState.value} />);

    return (
        <div className={`form-control ${!inputState.isValid && inputState.isTouch && "form-control--invalid"}`}>
            <label htmlFor={props.id}>{props.label}</label>
            {element}
            {!inputState.isValid && inputState.isTouch && <p>{props.error}</p>}
        </div>
    );
};

export default Input;