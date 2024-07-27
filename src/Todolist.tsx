import React, {memo, useCallback, useEffect, useMemo} from "react";
import AddItemForm from "./components/AddItemForm/AddItemForm";
import {EditableSpan} from "./components/EditableSpan/EditableSpan";
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button';
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import {filterButtonsContainerSx} from './Todolist.styles'
import {ButtonProps} from "@mui/material/Button/Button";
import {Task} from "./Task";
import {FilterValuesType} from "./state/todolists-reducer";
import {TaskStatuses, TaskType} from "./api/api";
import {useAppDispatch} from "./state/store";
import {fetchTasksTC} from "./state/tasks-reducer";


type TodolistPropsType = {
    title: string
    todolistId: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    addTask: (todolistId: string, title: string) => void
    removeTask: (todolistId: string, taskId: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, status: TaskStatuses) => void
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

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchTasksTC(todolistId))
    }, []);

    let tasksForTodoList = tasks;

    tasksForTodoList = useMemo(() => {
        if (filter === 'completed') {
            tasksForTodoList = tasks.filter(t => t.status === TaskStatuses.Completed)
        }
        if (filter === 'active') {
            tasksForTodoList = tasks.filter(t => t.status === TaskStatuses.New)
        }
        return tasksForTodoList
    }, [tasks, filter])

    // if (filter === 'completed') {
    //     tasksForTodoList = tasks.filter(t => t.isDone)
    // }
    // if (filter === 'active') {
    //     tasksForTodoList = tasks.filter(t => !t.isDone)
    // }

    const tasksList: JSX.Element = tasks.length === 0 ? (<p>There are no tasks</p>) : <List>
        {tasksForTodoList.map((t) => {
            return <Task
                key={t.id}
                task={t}
                todolistId={todolistId}
                removeTask={removeTask}
                changeTaskStatus={changeTaskStatus}
                updateTaskTitle={updateTaskTitle}
            />
        })}
    </List>

    const OnAllClickHandler  = useCallback( () => changeFilter(todolistId, 'all'), [changeFilter, todolistId])
    const OnActiveClickHandler  = useCallback( () => changeFilter(todolistId, 'active'), [changeFilter, todolistId])
    const OnCompletedClickHandler  = useCallback( () => changeFilter(todolistId, 'completed'), [changeFilter, todolistId])


    const removeTodolistHandler = () => {
        removeTodolist(todolistId)
    }

    const addTaskHandler = useCallback(( title: string) => {
        addTask(todolistId, title)
    }, [addTask, todolistId])

    const updateTodolistTitleHandler = useCallback( (newTitle: string) => {
        updateTodolistTitle(todolistId, newTitle)
    }, [updateTodolistTitle, todolistId])

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
                    onClick={OnAllClickHandler}
                    title={'All'}
                />
                <MyButton
                    variant={filter === 'active' ? 'outlined' : 'contained'}
                    color={'secondary'}
                    onClick={OnActiveClickHandler}
                    title={'Active'}
                />
                <MyButton
                    variant={filter === 'completed' ? 'outlined' : 'contained'}
                    color={'success'}
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