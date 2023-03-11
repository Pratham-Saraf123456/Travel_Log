import React,{useState,useEffect} from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hooks";

/*
    the component that display all the places related to the particular user

    useParams is the function provided by the react-router-dom which is used
    to extract the dynamic content from the url of  and note that
    it is only used in the functinal component
    dynamic segemet are that part of the code that start with the colon(:)
*/

// const DUMMY_PLACES = [
//     {
//         id:"p1",
//         title:"Empire State Building",
//         description:"One of the most famous sky scrapper in the world",
//         imageUrl:"https://media.istockphoto.com/id/486334510/photo/new-york-city-skyline.jpg?b=1&s=170667a&w=0&k=20&c=giW5LHT4SQGNpH4QuMPjDIi7mOlvW09DrpJXTY9D_ic=",
//         address:"20 W 34th St., New York, NY 10001, United States",
//         location : {
//             lat: 40.7484405,
//             lng: -73.9856644,
//         },
//         creatorId:"u1"

//     },
//     {
//         id:"p2",
//         title:"Emp. State Building",
//         description:"One of the most famous sky scrapper in the world",
//         imageUrl:"https://media.istockphoto.com/id/486334510/photo/new-york-city-skyline.jpg?b=1&s=170667a&w=0&k=20&c=giW5LHT4SQGNpH4QuMPjDIi7mOlvW09DrpJXTY9D_ic=",
//         address:"20 W 34th St., New York, NY 10001, United States",
//         location : {
//             lat: 40.7484405,
//             lng: -73.9856644,
//         },
//         creatorId:"u2"

//     }
// ]

const UserPlaces = props => {
    const [loadedPlaces,setLoadedPlaces] = useState();
    const {isLoading,error,sendRequest,clearError} = useHttpClient();

    const userId = useParams().userId;
    console.log(userId);
    useEffect(()=>{
        const fetchPlaces = async () => {
            const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`)
            
            setLoadedPlaces(responseData.userPlace);
        }

        fetchPlaces();

    },[sendRequest,userId])

    const deletePlaceHandler = (deletedPlaceId) => {
        setLoadedPlaces(prevPlace => {
            return prevPlace.filter(place => place.id !== deletedPlaceId);
        })
    }

    // const loadedPlaces = DUMMY_PLACES.filter(place => place.creatorId === userId);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {isLoading && <div className="center"><LoadingSpinner asOverlay /></div>}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={deletePlaceHandler} />}
        </React.Fragment>
    );
}

export default UserPlaces;