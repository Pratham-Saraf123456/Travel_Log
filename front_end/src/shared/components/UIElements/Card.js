import React from 'react';

import './Card.css';

/*
  wrap the content to have a card like view it is used in UserItem component
  
*/

const Card = props => {
  return (
    <div className={`card ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default Card;
