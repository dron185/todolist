import React from 'react';
import {Button} from "./Button";

type TodoListHeaderPropsType = {
    title: string
}

export const TodoListHeader = ({title}: TodoListHeaderPropsType) => {
    return (
        <div>
            <h3>{title}</h3>
            <Button title={"x"}/>
        </div>
    );
};