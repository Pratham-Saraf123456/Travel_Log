import React,{useCallback, useState,useEffect} from 'react';
// import {Route,Router,Switch,Redirect} from 'react-router-dom';
import {BrowserRouter as Router,Route,Redirect,Switch} from 'react-router-dom';

import './App.css';
import Users from './users/pages/Users';
import UserPlaces from './places/pages/UserPlaces';
import NewPlace from './places/pages/NewPlaces';
import UpdatePlaces from './places/pages/UpdatePlaces';
import Auth from './users/pages/Auth';
import { useAuth } from './shared/hooks/auth-hooks';
import { AuthContext } from './shared/context/auth-context';
import MainNavigation from './shared/components/Navigation/MainNavigatinon';

/*
  Added the the routing path to access all the component to add this we have
  to install a package named react-router-dom from which different fuction
  component can be extracted and used like BrowserRouter,Route,Switch,Redirect
  but all this are with respect with reack v5 

  a dynamic segment path is added for the user pages 

  >>>
  in this we store the token to the local storage and also 
  set the stat whenever the page is reloaded 

  >>>
    now set the token expiration date after which user will be logged out
*/

// let logoutTimer;

function App() {
  // const [token,setToken] = useState(false);
  // const [tokenExpDate,setTokenExpDate] = useState();
  // const [userId,setUserId] = useState();

  // const login = useCallback((uid,token,expirationDate) => {
  //   setToken(token);
  //   setUserId(uid);

  //   const tokenExpirationDate = expirationDate ||  new Date(new Date().getTime() + 1000*60*60);

  //   setTokenExpDate(tokenExpirationDate);

  //   localStorage.setItem('userData',JSON.stringify({
  //     userId:uid,
  //     token:token,
  //     expiration:tokenExpirationDate.toISOString()
  //   }));


  // },[])

  // const logOut = useCallback(() => {
  //   setToken(null);
  //   setUserId(null);
  //   setTokenExpDate(null);
  //   localStorage.removeItem('userData');
  // },[])


  // //this useEffect will automatically logout the user 
  // useEffect(() => {
  //   if(token && tokenExpDate){
  //     const remainingTime = tokenExpDate.getTime() - new Date().getTime();
  //     logoutTimer = setTimeout(logOut,remainingTime);
  //   }else{
  //     clearTimeout(logoutTimer);
  //   }
  // },[logOut,token,tokenExpDate])


  // //this useEffect will automatically logIn the user if the session is not expired
  // useEffect(() => {
  //   const storedData = JSON.parse(localStorage.getItem('userData'));

  //   if(storedData && storedData.token && new Date(storedData.expiration) > new Date()){
  //     login(storedData.userId,storedData.token, new Date(storedData.expiration));  
  //   }

  // },[login])

  const {token,logOut,login,userId} = useAuth();

  let routes;
  if(token){
    routes = (
      <Switch>
        <Route path="/" exact>
            <Users />
        </Route>
        <Route path="/:userId/places" exact>
            <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
            <NewPlace />
        </Route>
        <Route path="/places/:placeId" exact>
            <UpdatePlaces />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }
  else{
    routes = (
      <Switch>
        <Route path="/" exact>
            <Users />
        </Route>
        <Route path="/:userId/places" exact>
            <UserPlaces />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    ) ;
  }

  return (
    <div>
      <AuthContext.Provider value={
        {
          userId:userId,
          isLoggedIn:!!token,
          token:token,
          login:login,
          logout:logOut
        }
      }>
        <Router>
          <MainNavigation />
          <main>
              {routes}
          </main>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
