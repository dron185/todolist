import React from 'react';
import {TaskType} from "./Todolist";

type PropsType = {
    value: string
    spanClass?: string
}

export const EditableSpan = ({value, spanClass}: PropsType) => {
    return <span className={spanClass}>{value}</span>
};