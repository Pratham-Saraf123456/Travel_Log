import React,{useEffect,useState,useContext} from "react";
import { useParams,useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hooks";
import { useHttpClient } from "../../shared/hooks/http-hooks";
import { VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import './PlaceForm.css'


/*
    the component that simply help to make form that update the values
    and use the component input and button

    custorm hook simply take the initial value as an argument to set
    the initial value as per the user need 

    as we get the value from the array after sometime so we need to 
    send the value once it is completly extracted

*/



const UpdatePlaces = () => {
    const auth = useContext(AuthContext);
    const {isLoading,error,sendRequest,clearError} = useHttpClient();
    const [loadedPlaces,setLoadedPlaces] = useState();
    const history = useHistory();

    const placeId = useParams().placeId;

    const [formState,formValidateHandler,setInitialInputHandler] = useForm(
        {
            title:{
                value:"",
                isValid:false
            },
            description:{
                value:"",
                isValid:false
            }
        },
        false
    );

    useEffect(()=>{
        const fetchPlace = async () => {
            try{
                const responesData = await sendRequest(`http://localhost:5000/api/places/${placeId}`);

                setLoadedPlaces(responesData.place);

                setInitialInputHandler(
                    {
                        title:{
                            value:responesData.place.title,
                            isValid:true
                        },
                        description:{
                            value:responesData.place.description,
                            isValid:true
                        }
                    },
                    true
                );

              
            }catch(err){ }
        }

        fetchPlace();
    },[sendRequest,placeId,setInitialInputHandler])

    // const place = DUMMY_PLACES.find(place => placeId ===  place.id);


    // useEffect(()=>{
    //     if(place){
    //         setInitialInputHandler(
    //             {
    //                 title:{
    //                     value:place.title,
    //                     isValid:true
    //                 },
    //                 description:{
    //                     value:place.description,
    //                     isValid:true
    //                 }
    //             },
    //             true
    //         );
    //     }

    //     setIsLoading(false);
    // },[setInitialInputHandler,place,setIsLoading]);

    // const [formState,formValidateHandler] = useForm(
    //     {
    //         title:{
    //             value:place.title,
    //             isValid:true
    //         },
    //         description:{
    //             value:place.description,
    //             isValid:true
    //         }
    //     },
    //     true
    // );
    
    if(isLoading){
        return (
            <div className="centered">
                <LoadingSpinner asOverlay />
            </div>
        );
    }

    if(!loadedPlaces && !error){
        return (
            <div className="center">
                <Card>
                    <h2>Could Not Find place!</h2>
                </Card>
            </div>
        );
    }
    

    const formUpdateHandler = async (event) => {
        event.preventDefault();

        try{
            const responseData = await sendRequest(
                `http://localhost:5000/api/places/${placeId}`,
                'PATCH',
                JSON.stringify({
                    title:formState.inputs.title.value,
                    description:formState.inputs.description.value
                }),
                {'Content-Type' : 'application/json',
                  Authorization : 'Bearer '+ auth.token
                }
                );

            //redirect the user to different page after successful updation
            history.push('/'+auth.userId+'/places');

        }catch(err){}


        // console.log(formState);
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlaces && (
            <form className="place-form" onSubmit={formUpdateHandler}>
                <Input
                    id="title"
                    type="text"
                    element="input"
                    label="Title"
                    error="Enter the title"
                    onInput={formValidateHandler}
                    validators = {[VALIDATOR_REQUIRE()]}
                    value={loadedPlaces.title}
                    valid={true}
                    // value={formState.inputs.title.value}
                    // valid={formState.inputs.title.isValid}
                />
                <Input
                    id="description"
                    element="textarea"
                    label="Description"
                    error="Enter the description (min length 5)"
                    onInput={formValidateHandler}
                    validators = {[VALIDATOR_MINLENGTH(5)]}
                    value={loadedPlaces.description}
                    valid={true}
                />
                <Button type="submit" disabled={!formState.isValid}>
                    UPDATE PLACES
                </Button>
            </form>)}
        </React.Fragment>
    );
}

export default UpdatePlaces;