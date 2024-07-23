import React, {useCallback, useState} from 'react';
import './App.css';
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
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    FilterValuesType,
    removeTodolistAC,
    TodolistDomainType
} from "./state/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {Todolist} from "./Todolist";
import {TaskStatuses, TaskType} from "./api/api";

type ThemeMode = 'dark' | 'light'

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
    //useSelector - это функция, которая селектит\выбирает что-то из чего-то… Выполняет 2 функции: 1.вытащить данные. 2. определить надо ли компоненту перерендерить(в зависимости от того получил ли он старые или новые данные)
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch()

    // CRUD tasks
    const removeTask = useCallback((taskId: string, todolistId: string) => {
        const action = removeTaskAC(taskId, todolistId);
        dispatch(action);
    }, [dispatch])

    const addTask = useCallback((todolistId: string, title: string) => {
        const action = addTaskAC(title, todolistId);
        dispatch(action);
    }, [dispatch])

    const changeTaskStatus = useCallback((todolistId: string, taskId: string, status: TaskStatuses) => {
        const action = changeTaskStatusAC(taskId, status, todolistId);
        dispatch(action);
    }, [dispatch])

    const updateTaskTitle = useCallback((todolistId: string, taskId: string, newTitle: string) => {
        const action = changeTaskTitleAC(taskId, newTitle, todolistId)
        dispatch(action);
    }, [dispatch])

    // filter
    const changeFilter = useCallback((todolistId: string, value: FilterValuesType) => {
        const action = changeTodolistFilterAC(todolistId, value)
        dispatch(action)
    }, [dispatch])

    const removeTodolist = useCallback((todolistId: string) => {
        let action = removeTodolistAC(todolistId)
        dispatch(action)
    }, [dispatch])

    const updateTodolistTitle = useCallback((todolistId: string, newTitle: string) => {
        let action = changeTodolistTitleAC(todolistId, newTitle)
        dispatch(action);
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistAC(title))
    }, [dispatch]);


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
                                        <Todolist
                                            key={el.id}
                                            todolistId={el.id}
                                            title={el.title}
                                            tasks={tasks[el.id]}
                                            filter={el.filter}
                                            removeTask={removeTask}
                                            changeFilter={changeFilter}
                                            addTask={addTask}
                                            changeTaskStatus={changeTaskStatus}
                                            removeTodolist={removeTodolist}
                                            updateTaskTitle={updateTaskTitle}
                                            updateTodolistTitle={updateTodolistTitle}
                                        />
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
