import React, {ChangeEvent, memo} from 'react';
import ListItem from "@mui/material/ListItem";
import {getListItemSx} from "./Todolist.styles";
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {TaskType} from "./Todolist";

export type TaskPropsType = {
    task: TaskType
    todolistId: string
    removeTask: (todolistId: string, taskId: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, newIsDoneValue: boolean) => void
    updateTaskTitle: (todolistId: string, taskId: string, newTitle: string) => void
}

export const Task = memo( ({task, removeTask, changeTaskStatus, updateTaskTitle, todolistId}:TaskPropsType) => {
    console.log('Task')
    const removeTaskHandler = () => removeTask(task.id, todolistId)
    const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => changeTaskStatus(todolistId, task.id, e.currentTarget.checked)
    const updateTaskTitleHandler = (newTitle: string) => {
        updateTaskTitle(todolistId, task.id, newTitle)
    }

    return (
        <ListItem sx={getListItemSx(task.isDone)}>
            <div>
                <Checkbox checked={task.isDone} onChange={changeStatusHandler} color="success" />
                <EditableSpan oldTitle={task.title} updateTitle={updateTaskTitleHandler}/>
            </div>
            <IconButton onClick={removeTaskHandler}>
                <DeleteIcon />
            </IconButton>
        </ListItem>
    )
} );