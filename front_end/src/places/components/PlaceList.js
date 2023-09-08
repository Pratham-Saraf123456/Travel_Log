import React from "react";


import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem"
import Button from "../../shared/components/FormElements/Button";
import './PlaceList.css'


const PlaceList = props => {
    if(props.items.length === 0){
        return (
            <div className="place-list center">
                <Card>
                    <h2>No Placed Found Create One!!</h2>
                    <Button to="/places/new">Share Places</Button>
                </Card>
            </div>
        );
    }

    return (
        <ul className="place-list">
            {
                props.items.map(item => {
                    return (
                        <PlaceItem 
                            key={item.id}
                            id={item.id}
                            image={item.image}
                            title={item.title}
                            description={item.description}
                            address={item.address}
                            creatorId={item.creator}
                            coordinates={item.location}
                            onDelete={props.onDeletePlace}
                        />
                    );
                })
            }
        </ul>
    );
}

export default PlaceList;