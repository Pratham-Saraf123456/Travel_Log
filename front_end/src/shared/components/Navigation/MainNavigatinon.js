/*
    it is the part of the main header as it is the componenet that have all the links

*/

import React, { useState } from "react";
import { Link } from "react-router-dom";


import NavLinks from "./NavLinks";
import MainHeader from "./MainHeader";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";
import './MainNavigation.css';

/*
    here the button used is to have the three button on the left side 
    when the size of the screen dcreased and it is very useful utility

    in react the anchar tag is replaced by the link and navlink

    we need to wrap the sidedrawer and mainheader component because we can
    have ony one jsx componet that we can return no matter how much nested
    component it have so we need to wrap the components

    now we use the concept of react portals 
    it is the concept in which we will render the component to different places from
    normal place where it is going to be rendered
    for this we need to add a div in the html code of react and then select it 

*/

const MainNavigation = props => {
    const [isDrawerOpen,setIsDrawerOpen] = useState(false);

    const openDrawerHandler = () => {
        setIsDrawerOpen(true);
    }

    const closeDrawerHandler = () => {
        setIsDrawerOpen(false);
    }

    return (
        <React.Fragment>
            {isDrawerOpen && <Backdrop onClick={closeDrawerHandler} />}
            {isDrawerOpen &&<SideDrawer show={isDrawerOpen} onClick={closeDrawerHandler}>
                <nav className="main-navigation__drawer-nav">
                    <NavLinks />
                </nav>
            </SideDrawer>}
            <MainHeader>
                <button className="main-navigation__menu-btn" onClick={openDrawerHandler}>
                    <span />
                    <span />
                    <span />
                </button>
                <h1 className="main-navigation__title"> 
                    <Link to="/">Your Places</Link>
                </h1>
                <nav className="main-navigation__header-nav">
                    <NavLinks />
                </nav>
            </MainHeader>
        </React.Fragment>
    );
}

export default MainNavigation;