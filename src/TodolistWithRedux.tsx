import React, {ChangeEvent} from "react";
import {FilterValuesType} from "./App";
import AddItemForm from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button';
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import {filterButtonsContainerSx, getListItemSx} from './Todolist.styles'
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {TasksStateType, TodolistType} from "./AppWithRedux";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC} from "./state/todolists-reducer";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TodolistPropsType = {
    // todolist: TodolistType
    todolistId: string
    title: string
    changeFilter: (todolistId: string, value: FilterValuesType) => void
    removeTodolist: (todolistId: string) => void
    updateTodolistTitle: (todolistId: string, newTitle: string) => void
    filter: FilterValuesType
    // updateTaskTitle: (todolistId: string, taskId: string, newTitle: string) => void
}

export const TodolistWithRedux = ({todolistId, title, changeFilter, removeTodolist, updateTodolistTitle, filter}: TodolistPropsType) => {

    const tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[todolistId])
    const dispatch = useDispatch()

    /*const {id, filter, title} = todolist*/



    const changeFilterHandlerCreator = (filter: FilterValuesType) => {
        return () => changeFilter(todolistId, filter)
    }

    const removeTodolistHandler = () => {
        removeTodolist(todolistId)
    }

    const addTaskHandler = (title: string) => {
        dispatch(addTaskAC(title, todolistId))
    }

    const updateTodolistTitleHandler = (newTitle: string) => {
        updateTodolistTitle(todolistId, newTitle)
    }

    let allTodolistTasks = tasks;
    let tasksForTodolist = allTodolistTasks;

    if (filter === 'active') {
        tasksForTodolist = allTodolistTasks.filter(t => !t.isDone)
    }
    if (filter === 'completed') {
        tasksForTodolist = allTodolistTasks.filter(t => t.isDone)
    }

    const tasksList: JSX.Element = tasks.length === 0 ? (<p>Тасок нет</p>) : <List>
        {tasksForTodolist.map((t) => {
            const removeTaskHandler = () => dispatch(removeTaskAC(t.id, todolistId)) //+

            const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => dispatch(changeTaskStatusAC(t.id, e.currentTarget.checked, todolistId)) //+

            const updateTaskTitleHandler = (newTitle: string) => {
                dispatch(changeTaskTitleAC(t.id, newTitle, todolistId)) //+
            }

            return (
                <ListItem key={t.id} sx={getListItemSx(t.isDone)}>
                    <div>
                        <Checkbox checked={t.isDone} onChange={changeStatusHandler} color="success" />
                        <EditableSpan oldTitle={t.title} updateTitle={updateTaskTitleHandler}/>
                    </div>
                    <IconButton onClick={removeTaskHandler}>
                        <DeleteIcon />
                    </IconButton>
                </ListItem>
            )
        })}
    </List>

    return (
        <div className={"todolist"}>
            <div className={'todolist-title-container'}>
                <EditableSpan
                    oldTitle={title}
                    updateTitle={updateTodolistTitleHandler}
                />
                <IconButton onClick={removeTodolistHandler}>
                    <DeleteIcon />
                </IconButton>
            </div>
            <AddItemForm addItem={addTaskHandler}/>
            {tasksList}
            <Box sx={filterButtonsContainerSx}>
                <Button
                    variant={filter === 'all' ? 'outlined' : 'contained'}
                    color={'info'}
                    onClick={changeFilterHandlerCreator('all')}
                >All</Button>
                <Button
                    variant={filter === 'active' ? 'outlined' : 'contained'}
                    color={'secondary'}
                    onClick={changeFilterHandlerCreator('active')}
                >Active</Button>
                <Button
                    variant={filter === 'completed' ? 'outlined' : 'contained'}
                    color={'success'}
                    onClick={changeFilterHandlerCreator('completed')}
                >Completed</Button>
            </Box>
        </div>
    )
}