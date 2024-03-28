import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from "./Todolist";
import {v1} from "uuid";

export type FilterValuesType = 'all' | 'completed' | 'active';

type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

function App() {
    let todolistID1 = v1()
    let todolistID2 = v1()

    let [todolists, setTodolists] = useState<TodolistType[]>([
        { id: todolistID1, title: 'What to learn', filter: 'all' },
        { id: todolistID2, title: 'What to buy', filter: 'all' },
    ])

    let [tasks, setTasks] = useState({
        [todolistID1]: [
            { id: v1(), title: 'HTML&CSS', isDone: true },
            { id: v1(), title: 'JS', isDone: true },
            { id: v1(), title: 'ReactJS', isDone: false },
            { id: v1(), title: "Rest API", isDone: false },
            { id: v1(), title: "GraphQL", isDone: false },
        ],
        [todolistID2]: [
            { id: v1(), title: 'HTML&CSS-2', isDone: true },
            { id: v1(), title: 'JS-2', isDone: true },
            { id: v1(), title: 'ReactJS-2', isDone: false },
            { id: v1(), title: 'Rest API-2', isDone: true },
            { id: v1(), title: 'GraphQL-2', isDone: false },
        ],
    })

    // CRUD tasks
    const removeTask = (taskId: string, todolistId: string) => {
        setTasks({...tasks, [todolistId]:tasks[todolistId].filter(t=> t.id !== taskId)})
    }

    const addTask = (title: string) => {
        // const newTask = {
        //     id: v1(),
        //     title: title,
        //     //title: title,
        //     isDone: false
        // };
        // const newTasks = [newTask, ...tasks];
        // setTasks(newTasks)
    }

    const changeTaskStatus = (taskId: string, newIsDoneValue: boolean) => {
        // const task = tasks.find(t => t.id === taskId)
        // if (task) {
        //     task.isDone = !task.isDone
        //     setTasks([...tasks])
        // }

        // const updatedState = tasks.map(t => t.id === taskId ? {...t, isDone: newIsDoneValue } : t)
        // setTasks(updatedState)
    }

    // filter
    const changeFilter = (todolistId: string, value: FilterValuesType) => {
        setTodolists(todolists.map(el=> el.id === todolistId ? {...el, filter: value} : el))
    }

    return (
        <div className="App">
            {
                todolists.map(el=> {
                    let tasksForTodoList = tasks[el.id];
                    if (el.filter === 'completed') {
                        tasksForTodoList = tasks[el.id].filter(t=> t.isDone)
                    }
                    if (el.filter === 'active') {
                        tasksForTodoList = tasks[el.id].filter(t=> !t.isDone)
                    }
                    return (
                        <Todolist
                            key={el.id}
                            todolistId={el.id}
                            title={el.title}
                            tasks={tasksForTodoList}
                            filter={el.filter}
                            removeTask={removeTask}
                            changeFilter={changeFilter}
                            addTask = {addTask}
                            changeTaskStatus = {changeTaskStatus}
                        />
                    )
                })
            }
        </div>
    );
}

export default App;
