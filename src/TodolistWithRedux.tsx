import React, {ChangeEvent, useCallback} from "react";
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
import {TodolistType} from "./AppWithRedux";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC} from "./state/todolists-reducer";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TodolistPropsType = {
    todolist: TodolistType
}

export const TodolistWithRedux = React.memo( ({todolist}: TodolistPropsType) => {
    // const {id, filter, title} = props.todolist

    const tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[todolist.id])
    const dispatch = useDispatch()

    const changeFilterHandlerCreator = useCallback( (filter: FilterValuesType) => {
        return () => dispatch(changeTodolistFilterAC(todolist.id, filter))
    }, [todolist.id, todolist.filter] )

    const removeTodolistHandler = useCallback( () => {
        dispatch(removeTodolistAC(todolist.id))
    },[todolist.id] )

    const addTaskHandler = useCallback( (title: string) => {
        dispatch(addTaskAC(title, todolist.id))
    }, [todolist.id] )

    const updateTodolistTitleHandler = useCallback( (newTitle: string) => {
        dispatch(changeTodolistTitleAC(todolist.id, newTitle))
    }, [todolist.id] )


    let tasksForTodolist = tasks;

    if (todolist.filter === 'active') {
        tasksForTodolist = tasks.filter(t => !t.isDone)
    }
    if (todolist.filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.isDone)
    }

    const tasksList: JSX.Element = tasks.length === 0 ? (<p>Тасок нет</p>) : <List>
        {tasksForTodolist.map((t) => {
            const removeTaskHandler = () => dispatch(removeTaskAC(t.id, todolist.id))

            const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => dispatch(changeTaskStatusAC(t.id, e.currentTarget.checked, todolist.id))

            const updateTaskTitleHandler = (newTitle: string) => {
                dispatch(changeTaskTitleAC(t.id, newTitle, todolist.id))
            }

            return (
                <ListItem key={t.id} sx={getListItemSx(t.isDone)}>
                    <div>
                        <Checkbox checked={t.isDone} onChange={changeStatusHandler} color="success"/>
                        <EditableSpan oldTitle={t.title} updateTitle={updateTaskTitleHandler}/>
                    </div>
                    <IconButton onClick={removeTaskHandler}>
                        <DeleteIcon/>
                    </IconButton>
                </ListItem>
            )
        })}
    </List>

    return (
        <div className={"todolist"}>
            <div className={'todolist-title-container'}>
                <EditableSpan
                    oldTitle={todolist.title}
                    updateTitle={updateTodolistTitleHandler}
                />
                <IconButton onClick={removeTodolistHandler}>
                    <DeleteIcon/>
                </IconButton>
            </div>
            <AddItemForm addItem={addTaskHandler}/>
            {tasksList}
            <Box sx={filterButtonsContainerSx}>
                <Button
                    variant={todolist.filter === 'all' ? 'outlined' : 'contained'}
                    color={'info'}
                    onClick={changeFilterHandlerCreator('all')}
                >All</Button>
                <Button
                    variant={todolist.filter === 'active' ? 'outlined' : 'contained'}
                    color={'secondary'}
                    onClick={changeFilterHandlerCreator('active')}
                >Active</Button>
                <Button
                    variant={todolist.filter === 'completed' ? 'outlined' : 'contained'}
                    color={'success'}
                    onClick={changeFilterHandlerCreator('completed')}
                >Completed</Button>
            </Box>
        </div>
    )
} );



// const Task => () => {
//     const removeTaskHandler = () => dispatch(removeTaskAC(t.id, id))
//
//     const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => dispatch(changeTaskStatusAC(t.id, e.currentTarget.checked, id))
//
//     const updateTaskTitleHandler = (newTitle: string) => {
//         dispatch(changeTaskTitleAC(t.id, newTitle, id))
//     }
//
//     return (
//         <ListItem key={t.id} sx={getListItemSx(t.isDone)}>
//             <div>
//                 <Checkbox checked={t.isDone} onChange={changeStatusHandler} color="success"/>
//                 <EditableSpan oldTitle={t.title} updateTitle={updateTaskTitleHandler}/>
//             </div>
//             <IconButton onClick={removeTaskHandler}>
//                 <DeleteIcon/>
//             </IconButton>
//         </ListItem>
//     )
// }