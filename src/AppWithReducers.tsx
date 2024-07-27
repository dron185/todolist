import React, {Reducer, useReducer, useState} from 'react';
import './App.css';
import {Todolist} from "./Todolist";
import {v1} from "uuid";
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
    ActionsType,
    addTodolistAC, changeTodolistFilterAC,
    changeTodolistTitleAC, FilterValuesType,
    removeTodolistAC, TodolistDomainType,
    todolistsReducer
} from "./state/todolists-reducer";
import {addTaskAC, removeTaskAC, tasksReducer, updateTaskAC} from "./state/tasks-reducer";
import {TaskPriorities, TaskStatuses, TaskType} from "./api/api";

type ThemeMode = 'dark' | 'light'

export type TasksStateType = {
    [key: string]: TaskType[]
}

function AppWithReducers() {

    const [themeMode, setThemeMode] = useState<ThemeMode>('light')

    const theme = createTheme({
        palette: {
            mode: themeMode === 'light' ? 'light' : 'dark',
            primary: {
                main: '#087EA4',
            },
        },
    })


    let todolistId1 = v1()
    let todolistId2 = v1()

    //пример типизации: useReducer<Reducer<TodolistType[], ActionsType>>
    let [todolists, dispatchToTodolists] = useReducer<Reducer<TodolistDomainType[], ActionsType>>(todolistsReducer, [
        {id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0,},
        {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0,},
    ])

    let [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todolistId1]: [
            {id: v1(), title: 'HTML&CSS', status: TaskStatuses.Completed, todoListId: todolistId1, description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
            {id: v1(), title: 'JS', status: TaskStatuses.Completed, todoListId: todolistId1, description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
        ],
        [todolistId2]: [
            {id: v1(), title: 'HTML&CSS-2', status: TaskStatuses.Completed, todoListId: todolistId1, description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
            {id: v1(), title: 'JS-2', status: TaskStatuses.Completed, todoListId: todolistId1, description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
        ],
    })
    console.log(tasks[todolistId1])

    // CRUD tasks
    const removeTask = (taskId: string, todolistId: string) => {
        let action = removeTaskAC(taskId, todolistId);
        dispatchToTasks(action);
    }

    const addTask = (todolistId: string, title: string) => {
        let action = addTaskAC({
            todoListId: todolistId,
            title: title,
            status: TaskStatuses.New,
            addedDate: '',
            id: 'id exists',
            deadline: '',
            description: '',
            order: 0,
            priority: TaskPriorities.Low,
            startDate: ''});
        dispatchToTasks(action);
    }

    const changeTaskStatus = (todolistId: string, taskId: string, status: TaskStatuses) => {
        let action = updateTaskAC(taskId, {status}, todolistId);
        dispatchToTasks(action);
    }

    // filter
    const changeFilter = (todolistId: string, value: FilterValuesType) => {
        let action = changeTodolistFilterAC(todolistId, value)
        dispatchToTodolists(action)
    }

    const removeTodolist = (todolistId: string) => {
        let action = removeTodolistAC(todolistId)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }

    const addTodolist = (title: string) => {
        let action = addTodolistAC({
            id: v1(),
            addedDate: '',
            order: 0,
            title: title
        });
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }

    const updateTaskTitle = (todolistId: string, taskId: string, newTitle: string) => {
        let action = updateTaskAC(taskId, {title: newTitle}, todolistId)
        dispatchToTasks(action);
    }

    const updateTodolistTitle = (todolistId: string, newTitle: string) => {
        let action = changeTodolistTitleAC(todolistId, newTitle)
        dispatchToTodolists(action);
    }

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
                            let tasksForTodoList = tasks[el.id];
                            if (el.filter === 'completed') {
                                tasksForTodoList = tasks[el.id].filter(t => t.status === TaskStatuses.Completed)
                            }
                            if (el.filter === 'active') {
                                tasksForTodoList = tasks[el.id].filter(t => t.status === TaskStatuses.New)
                            }
                            return (
                                <Grid>
                                    <Paper elevation={5} sx={{p: '20px'}}>
                                        <Todolist
                                            key={el.id}
                                            todolistId={el.id}
                                            title={el.title}
                                            tasks={tasksForTodoList}
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

export default AppWithReducers;


