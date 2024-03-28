import React from 'react';
import {Button} from "./Button";

type TodoListHeaderPropsType = {
    title: string
    // removeTodolistHandler: (todolistId: string) => void
    // todolistId: string
}

export const TodoListHeader = ({title}: TodoListHeaderPropsType) => {
    // const removeTodolistHandler = () => {
    //     removeTodolist(todolistId)
    // }
    return (
        <div style={{display: 'flex', justifyContent: 'space-between', paddingBottom: '15px'}}>
            <h3 style={{margin: 0}}>{title}</h3>
            <Button title={"x"} />
        </div>
    );
};