/*
    the file that will contain all the links and is rendered by the main navigation component

*/

import React,{useContext} from "react";
import { NavLink } from "react-router-dom";


import { AuthContext } from "../../context/auth-context";
import './NavLinks.css'

/*
    here we use nav link as it has certain feature that it will automatically
    activate the particular link on which we are currently present 

    the exact keyword in navlink tell that we will apply the feature of the
    link only to a particular link and not to all

    using the context in this component with the help of useContext function
    and then using the property defined in the context
*/

const NavLinks = props => {
    const auth = useContext(AuthContext)

    return (
        <ul className="nav-links">
            <li>
                <NavLink to="/" exact>ALL USERS</NavLink>
            </li>
            {auth.isLoggedIn && <li>
                <NavLink to={`/${auth.userId}/places`} >MY PLACES</NavLink>
            </li>}
            {auth.isLoggedIn && <li>
                <NavLink to="/places/new" >ADD PLACES</NavLink>
            </li>}
            {!auth.isLoggedIn && <li>
                <NavLink to="/auth" >AUTHENTICATE</NavLink>
            </li>}
            {auth.isLoggedIn && 
                 <li>
                    <button onClick={auth.logout}>LOG OUT</button>
                </li>
            }
        </ul>
    );
}

export default NavLinks;