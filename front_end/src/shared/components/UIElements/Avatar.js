import React from 'react';

import './Avatar.css';

/*
  the component that help to resize the image of the on the page and fit as
  per our requirement
*/

const Avatar = props => {
  return (
    <div className={`avatar ${props.className}`} style={props.style}>
      <img
        src={props.image}
        alt={props.alt}
        style={{ width: props.width, height: props.width }}
      />
    </div>
  );
};

export default Avatar;
