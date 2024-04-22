import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from "./Todolist";
import {v1} from "uuid";
import AddItemForm from "./AddItemForm";

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
// import Grid from '@mui/material/Grid';

export type FilterValuesType = 'all' | 'completed' | 'active';

type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: TaskType[]
}

function App() {
    let todolistID1 = v1()
    let todolistID2 = v1()

    let [todolists, setTodolists] = useState<TodolistType[]>([
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'all'},
    ])

    let [tasks, setTasks] = useState<TasksStateType>({
        [todolistID1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false},
        ],
        [todolistID2]: [
            {id: v1(), title: 'HTML&CSS-2', isDone: true},
            {id: v1(), title: 'JS-2', isDone: true},
            {id: v1(), title: 'ReactJS-2', isDone: false},
            {id: v1(), title: 'Rest API-2', isDone: true},
            {id: v1(), title: 'GraphQL-2', isDone: false},
        ],
    })
    console.log(tasks[todolistID1])
    // CRUD tasks
    const removeTask = (taskId: string, todolistId: string) => {
        setTasks({...tasks, [todolistId]: tasks[todolistId].filter(t => t.id !== taskId)})
    }

    const addTask = (todolistId: string, title: string) => {
        const newTask = {
            id: v1(),
            title: title,
            isDone: false
        };
        setTasks({...tasks, [todolistId]: [newTask, ...tasks[todolistId]]})
    }

    const changeTaskStatus = (todolistId: string, taskId: string, newIsDoneValue: boolean) => {
        setTasks({
            ...tasks,
            [todolistId]: tasks[todolistId].map(t => t.id === taskId ? {...t, isDone: newIsDoneValue} : t)
        })
    }

    // filter
    const changeFilter = (todolistId: string, value: FilterValuesType) => {
        setTodolists(todolists.map(el => el.id === todolistId ? {...el, filter: value} : el))
    }

    const removeTodolist = (todolistId: string) => {
        const newTodolists = todolists.filter(t => t.id !== todolistId)
        setTodolists(newTodolists)

        delete tasks[todolistId]
        setTasks({...tasks})
    }

    const addTodolist = (title: string) => {
        const todolistId = v1()
        const newTodolist: TodolistType = {
            id: todolistId,
            title: title,
            filter: 'all'
        }
        setTodolists([newTodolist, ...todolists])
        setTasks({...tasks, [todolistId]: []})
    }

    const updateTaskTitle = (todolistId: string, taskId: string, newTitle: string) => {
        setTasks({
            ...tasks,
            [todolistId]: tasks[todolistId].map(el => el.id === taskId ? {...el, title: newTitle} : el)
        })
    }

    const updateTodolistTitle = (todolistId: string, newTitle: string) => {
        setTodolists(todolists.map(el=> el.id === todolistId ? {...el, title: newTitle} : el))
    }

    return (
        <div>
            <AppBar position="static" sx={{ mb: '30px' }}>
                <Toolbar>
                    <IconButton color="inherit">
                        <MenuIcon />
                    </IconButton>
                    <Button color="inherit">Login</Button>
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
                                tasksForTodoList = tasks[el.id].filter(t => t.isDone)
                            }
                            if (el.filter === 'active') {
                                tasksForTodoList = tasks[el.id].filter(t => !t.isDone)
                            }
                            return (
                                <Grid>
                                    <Paper elevation={5} sx={{ p: '0 20px 20px 20px' }}>
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
        </div>
    );
}

export default App;
