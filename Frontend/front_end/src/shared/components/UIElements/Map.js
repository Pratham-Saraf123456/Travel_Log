import React,{useRef,useEffect} from "react";

import './Map.css';

/*
    useRef is simply used to add a reference pointer of the div to the map where
    it is to be displayed

    this component simply render a map by setting the script in main html file and
    then setting the center and zoom of the map render the map
*/

const Map = props  => {
    const mapRef = useRef();

    const {center,zoom} = props;

    useEffect(() => {
        const map = new window.google.maps.Map(mapRef.current,{
            center:center,
            zoom:zoom 
        });
    
        new window.google.maps.Marker({position:center, map: map});

    },[center,zoom]);
    


    return (

        <div ref={mapRef} className={`map ${props.className}`} style={props.style}></div>
    );
}

export default Map;