/*
    The component that will make our app to be conviniently visible on the mobile
*/

import React from "react";
import ReactDOM from "react-dom";
import {CSSTransition} from "react-transition-group";

import './SideDrawer.css';


/*
    this component will help us to slide in or slide out the content and
    also help to display the content on different port

    here we are now going to use portal to display the content of teh sidebar

    react-transition-group is a library that help us to add animation at the time
    of rendering
    CSSTransition is a component inside this which uses some property like
    in when to show
    timeout time for which animatino is visibal
    classNames the classes for transition 
    slide-in-left class is define in index.css

    mountOnEnter to moutn the block
    unmountOnEnter to unmount the block

*/

const SideDrawer = props => {
    const content = (
        <CSSTransition 
            in={props.show} 
            timeout={200} 
            classNames="slide-in-left" 
            mountOnEnter 
            unmountOnExit
        >
            <aside className="side-drawer" onClick={props.onClick}>
                {props.children}
            </aside>
        </CSSTransition>
        );

    return ReactDOM.createPortal(content,document.getElementById('drawer-hook'));
    
}
// const SideDrawer = props => {
//     return (
//         <aside className="side-drawer">
//             {props.children}
//         </aside>
//     );
// }


export default SideDrawer;