import React, {useState} from 'react';
import './App.css';
import {TaskType} from "./Todolist";
import AddItemForm from "./AddItemForm";

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import {MenuButton} from "./MenuButton";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Switch from '@mui/material/Switch'
import CssBaseline from '@mui/material/CssBaseline'
import {addTodolistAC} from "./state/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {TodolistWithRedux} from "./TodolistWithRedux";

type ThemeMode = 'dark' | 'light'

export type FilterValuesType = 'all' | 'completed' | 'active';

export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: TaskType[]
}

function AppWithRedux() {

    const [themeMode, setThemeMode] = useState<ThemeMode>('light')
    const theme = createTheme({
        palette: {
            mode: themeMode === 'light' ? 'light' : 'dark',
            primary: {
                main: '#087EA4',
            },
        },
    })


    //пример типизации: useReducer<Reducer<TodolistType[], ActionsType>>
    //useSelector - это функция, которая селектит\выбирает что-то из чего-то…
    const todolists = useSelector<AppRootStateType, Array<TodolistType>>(state => state.todolists)

   // let tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

    const dispatch = useDispatch()

    // CRUD tasks
    // const removeTask = (taskId: string, todolistId: string) => {
    //     let action = removeTaskAC(taskId, todolistId);
    //     dispatch(action);
    // }
    //
    // const addTask = (todolistId: string, title: string) => {
    //     let action = addTaskAC(title, todolistId);
    //     dispatch(action);
    // }
    //
    // const changeTaskStatus = (todolistId: string, taskId: string, newIsDoneValue: boolean) => {
    //     let action = changeTaskStatusAC(taskId, newIsDoneValue, todolistId);
    //     dispatch(action);
    // }
    //
    // const updateTaskTitle = (todolistId: string, taskId: string, newTitle: string) => {
    //     let action = changeTaskTitleAC(taskId, newTitle, todolistId)
    //     dispatch(action);
    // }


    // const changeFilter = (todolistId: string, value: FilterValuesType) => {
    //     let action = changeTodolistFilterAC(todolistId, value)
    //     dispatch(action)
    // }
    //
    // const removeTodolist = (todolistId: string) => {
    //     let action = removeTodolistAC(todolistId)
    //     dispatch(action)
    // }
    //
    const addTodolist = (title: string) => {
        dispatch(addTodolistAC(title))
    }
    //
    // const updateTodolistTitle = (todolistId: string, newTitle: string) => {
    //     let action = changeTodolistTitleAC(todolistId, newTitle)
    //     dispatch(action);
    // }

    const changeModeHandler = () => {
        setThemeMode(themeMode == 'light' ? 'dark' : 'light')
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <AppBar position="static" sx={{mb: '30px'}}>
                <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <IconButton color="inherit">
                        <MenuIcon/>
                    </IconButton>
                    <div>
                        <MenuButton>Login</MenuButton>
                        <MenuButton>Logout</MenuButton>
                        <MenuButton background={theme.palette.primary.dark}>Faq</MenuButton>
                        <Switch color={'default'} onChange={changeModeHandler}/>
                    </div>
                </Toolbar>
            </AppBar>

            <Container fixed>
                <Grid container sx={{mb: '30px'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>

                <Grid container spacing={4}>
                    {
                        todolists.map(el => {
                            return (
                                <Grid key={el.id}>
                                    <Paper elevation={5} sx={{p: '20px'}}>
                                        <TodolistWithRedux todolist={el}/>
                                    </Paper>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Container>
        </ThemeProvider>
    );
}

export default AppWithRedux;
