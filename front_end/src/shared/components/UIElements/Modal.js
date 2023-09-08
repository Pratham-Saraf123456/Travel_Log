import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";


import Backdrop from "./Backdrop";
import './Modal.css'

/*
    Modal is simply a component that is use to show some important information 
    about by displaying a overlay on the page i.e bacdropping the page and
    displaying important message or content that is required

    ModelOverlay is a component that we are using in this that contain the thing
    that we are actually going to see on the screen

    {...props} it is the spread operator it simply means to extract all the property of props and pass on to the next
*/


const ModalOverlay = props => {

    const content = (
        <div className={`modal ${props.className}`} style={props.style}>
            <header className={`modal__header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>

            <form onSubmit={props.onSubmit ? props.onSubmit : (event => event.preventDefault()) }>
                <div className={`modal__content ${props.contentClass}`}>
                    {props.children}
                </div>

                <footer className={`modal__footer ${props.footerClass}`}>
                    {props.footer}
                </footer>
            </form>
        </div>
    );

    return ReactDOM.createPortal(content,document.getElementById('modal-hook'));
}


const Modal = (props) => {
    
    return (
        <React.Fragment>
            {props.show && <Backdrop onClick = {props.onCancel} />}
            <CSSTransition 
                in={props.show}
                mountOnEnter
                unmountOnExit
                timeout={200}
                classNames="modal"
            >
                <ModalOverlay {...props} />
            </CSSTransition>
        </React.Fragment>
    );
}

export default Modal;