import React, {ChangeEvent, memo, useCallback} from "react";
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
import {ButtonProps} from "@mui/material/Button/Button";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TodolistPropsType = {
    title: string
    todolistId: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    addTask: (todolistId: string, title: string) => void
    removeTask: (todolistId: string, taskId: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, newIsDoneValue: boolean) => void
    changeFilter: (todolistId: string, value: FilterValuesType) => void
    removeTodolist: (todolistId: string) => void
    updateTaskTitle: (todolistId: string, taskId: string, newTitle: string) => void
    updateTodolistTitle: (todolistId: string, newTitle: string) => void
}

export const Todolist = memo( ({
                             removeTodolist,
                             todolistId,
                             title,
                             tasks,
                             filter,
                             addTask,
                             removeTask,
                             changeTaskStatus,
                             changeFilter,
                             updateTaskTitle,
                             updateTodolistTitle
                         }: TodolistPropsType) => {
    //деструктурирующее присваивание: const { title, tasks, removeTask, changeFilter, addTask } = props

    let tasksForTodoList = tasks;
    if (filter === 'completed') {
        tasksForTodoList = tasks.filter(t => t.isDone)
    }
    if (filter === 'active') {
        tasksForTodoList = tasks.filter(t => !t.isDone)
    }

    const tasksList: JSX.Element = tasks.length === 0 ? (<p>There are no tasks</p>) : <List>
        {tasksForTodoList.map((t) => {
            const removeTaskHandler = () => removeTask(t.id, todolistId)

            const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => changeTaskStatus(todolistId, t.id, e.currentTarget.checked)

            const updateTaskTitleHandler = (newTitle: string) => {
                updateTaskTitle(todolistId, t.id, newTitle)
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

    // const changeFilterHandlerCreator = useCallback( (filter: FilterValuesType) => {
    //     return () => changeFilter(todolistId, filter)
    // }, [changeFilter,todolistId, filter])

    const OnAllClickHandler  = useCallback( () => changeFilter(todolistId, 'all'), [changeFilter, todolistId])
    const OnActiveClickHandler  = useCallback( () => changeFilter(todolistId, 'active'), [changeFilter, todolistId])
    const OnCompletedClickHandler  = useCallback( () => changeFilter(todolistId, 'completed'), [changeFilter, todolistId])


    const removeTodolistHandler = () => {
        removeTodolist(todolistId)
    }

    const addTaskHandler = useCallback(( title: string) => {
        addTask(todolistId, title)
    }, [addTask, todolistId])

    const updateTodolistTitleHandler = (newTitle: string) => {
        updateTodolistTitle(todolistId, newTitle)
    }

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
                <MyButton
                    variant={filter === 'all' ? 'outlined' : 'contained'}
                    color={'info'}
                    // onClick={changeFilterHandlerCreator('all')}
                    onClick={OnAllClickHandler}
                    title={'All'}
                />
                <MyButton
                    variant={filter === 'active' ? 'outlined' : 'contained'}
                    color={'secondary'}
                    // onClick={changeFilterHandlerCreator('active')}
                    onClick={OnActiveClickHandler}
                    title={'Active'}
                />
                <MyButton
                    variant={filter === 'completed' ? 'outlined' : 'contained'}
                    color={'success'}
                    // onClick={changeFilterHandlerCreator('completed')}
                    onClick={OnCompletedClickHandler}
                    title={'Completed'}
                />
            </Box>
        </div>
    )
} )

type MyButtonPropsType = {} & ButtonProps

const MyButton = memo( ({variant, color, onClick, title, ...rest}: MyButtonPropsType) => {
    return <Button
        variant={variant}
        color={color}
        onClick={onClick}
        {...rest}
    >{title}</Button>
} )