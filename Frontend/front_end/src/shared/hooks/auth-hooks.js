
import React,{useEffect,useState,useCallback} from "react";

let logoutTimer;

export const useAuth = () => {
    const [token,setToken] = useState(false);
    const [tokenExpDate,setTokenExpDate] = useState();
    const [userId,setUserId] = useState();
  
    const login = useCallback((uid,token,expirationDate) => {
      setToken(token);
      setUserId(uid);
  
      const tokenExpirationDate = expirationDate ||  new Date(new Date().getTime() + 1000*60*60);
  
      setTokenExpDate(tokenExpirationDate);
  
      localStorage.setItem('userData',JSON.stringify({
        userId:uid,
        token:token,
        expiration:tokenExpirationDate.toISOString()
      }));
  
  
    },[])
  
    const logOut = useCallback(() => {
      setToken(null);
      setUserId(null);
      setTokenExpDate(null);
      localStorage.removeItem('userData');
    },[])
  
  
    //this useEffect will automatically logout the user 
    useEffect(() => {
      if(token && tokenExpDate){
        const remainingTime = tokenExpDate.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logOut,remainingTime);
        
      }else{
        clearTimeout(logoutTimer);
      }
    },[logOut,token,tokenExpDate])
  
  
    //this useEffect will automatically logIn the user if the session is not expired
    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem('userData'));
  
      if(storedData && storedData.token && new Date(storedData.expiration) > new Date()){
        login(storedData.userId,storedData.token, new Date(storedData.expiration));  
      }
  
    },[login])

    return {token,login,logOut,userId};
}