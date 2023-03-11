import React from "react";

import UserItem from './UserItem';
import Card from "../../shared/components/UIElements/Card";
import './UserList.css';

/*
    Component that generally define the structure and the way the list of the user will
    be displayed on the screen 
    and it call the "UserItem" component to display its content 

*/

const UserList = props => {
    if(props.items.length === 0){
        return (
            <div className="center">
                <Card>
                    <h1> No User Found !</h1>
                </Card>
            </div>
        );
    }

    return (
        <ul className="user-list">
            {props.items.map(item => {
                return <UserItem 
                           key={item.id}
                           id={item.id}
                           image={item.image}
                           name={item.name}
                           placeCount={item.places.length}
                        />
            })}
        </ul>
    );
}

export default UserList;