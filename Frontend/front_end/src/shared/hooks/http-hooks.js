/*
    a custom hook that simply manages the http request and save us from the code duplication
    in this we are going to define the logic for fetching the request

    >>>> Important
    what will happen if we are requesting a page but we suddenly switch the page then
    we must get an error as our page or request changes 
    we are getting an error because we are trying to update the state on a component
    that is not on the screen any more 
    and in such case we need to cancel the ongoing request 

    useRef is a hook that make sure that the data wrap inside it will not change or re-ini
    tialize when the function rerender
    useRef use to wrap all the data in the object having a current property
    

    >>>
     useEffect not only run to rerender or some attribute changes but
     it also run as a clean up function 
    
*/

import React,{useState,useCallback,useRef,useEffect} from "react"

export const useHttpClient = () => {
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState();

    //this will store data across rerender cycle 
    const activeHttpRequest = useRef([]);

    //this function is configurable as user can configure them and to avoid infinite loop wrap it in useCallback
    const sendRequest = useCallback ( async (url,method="GET",body = null,headers ={}) => {
            setIsLoading(true);

            //in order to store the request of the particular page
            const httpAbortCtrl = new AbortController();//this the functionality build in the modern browser
            activeHttpRequest.current.push(httpAbortCtrl);

        try{
            //attaching signal simply means that we link the abort contoler with the response and we can use this abort controller to cancel the request
            const response = await fetch(url,{
                method,
                headers,
                body,
                signal:httpAbortCtrl.signal
            });

            const responseData = await response.json();

            //it is importat as we need to remove the the http request that has completed
            activeHttpRequest.current= activeHttpRequest.current.filter(
                reqCtrl => reqCtrl !== httpAbortCtrl
            );

            if(!response.ok){
                throw new Error(responseData.message);
            }

            setIsLoading(false);
            return responseData;

        }catch(err){
            setIsLoading(false);
            setError(err.message);
            throw err;
        }

    },[]);

    const clearError = () => {
        setError(null);
    }

    //this make sure that we never proceed for the request if there is a request
    useEffect(() => {
        //using a function inside the useEffect as a clean up function before sending the new response
        return () => {  
            activeHttpRequest.current.forEach(abortCtrl => abortCtrl.abort());
        };
    },[]);

    return {isLoading,error,sendRequest,clearError};
}