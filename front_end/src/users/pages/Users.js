import React,{useEffect,useState} from "react";

import UserList from "../components/UserList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hooks";

/*
    This a page which consist of what displays when user acces to the path "/"

    NOTE:
    never make a useeffect function a async functino as it donot accept the promise
    instead define another function inside it and make it an async function

*/
const User = () => {
    // const [isLoading,setIsLoading] = useState(false);
    // const [error,setError] = useState();
    const {isLoading,error,sendRequest,clearError} = useHttpClient();
    const [loadedUsers,setLoadedUsers] = useState();

    // const USERS = [
    //             {
    //                 id:"u1",
    //                 name:"maxi",
    //                 image:"https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    //                 places:3
    //             },
    //             {
    //                 id:"u2",
    //                 name:"ayush",
    //                 image:"https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    //                 places:2
    //             }
    //         ]

    useEffect(()=>{
        const sendRequestUser = async () => {
            try{
                const responseData = await sendRequest('http://localhost:5000/api/users');

                setLoadedUsers(responseData.allUser)
                
            }catch(err){ }

        }

        sendRequestUser();
    },[sendRequest])

    //before using the custom hook
    // useEffect(()=>{
    //     const sendRequest = async () => {
    //         setIsLoading(true);
    //         try{
    //             const response = await fetch('http://localhost:5000/api/users');

    //             const responseData= await response.json();

    //             if(!response.ok){
    //                 throw new Error(responseData.message);
    //             }

    //             // console.log(responseData.allUser.length);
    //             setIsLoading(false);
    //             setLoadedUsers(responseData.allUser)
                

    //         }catch(err){
    //             setIsLoading(false);
    //             setError(err.message);
    //         }

    //     }

    //     sendRequest();
    // },[])

    const errorHandler = () => {
        clearError(null);
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={errorHandler} />
            {isLoading && <div className="center"><LoadingSpinner asOverlay /></div>}
            {!isLoading && loadedUsers && <UserList items={loadedUsers}/>}
        </React.Fragment>
    );

    
}

export default User;