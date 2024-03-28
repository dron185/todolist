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
    const [todolists, setTodolists] = useState<TodolistType[]>([
        { id: v1(), title: 'What to learn', filter: 'all' },
        { id: v1(), title: 'What to buy', filter: 'all' },
    ])

    const [tasks, setTasks] = useState< Array<TaskType> >([
        {id: v1(), title: "HTML&CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "React", isDone: false},
        {id: v1(), title: 'Redux', isDone: false},
    ]);

    // CRUD tasks
    const removeTask = (taskId: string) => {
        const updatedState = tasks.filter( t => t.id !== taskId )
        setTasks(updatedState);
    }

    const addTask = (title: string) => {
        const newTask = {
            id: v1(),
            title: title,
            //title: title,
            isDone: false
        };
        const newTasks = [newTask, ...tasks];
        setTasks(newTasks)
    }

    const changeTaskStatus = (taskId: string, newIsDoneValue: boolean) => {
        // const task = tasks.find(t => t.id === taskId)
        // if (task) {
        //     task.isDone = !task.isDone
        //     setTasks([...tasks])
        // }
        const updatedState = tasks.map(t => t.id === taskId ? {...t, isDone: newIsDoneValue } : t)
        setTasks(updatedState)
    }

    // filter
    const changeFilter = (todolistId: string, value: FilterValuesType) => {
        setTodolists(todolists.map(el=> el.id === todolistId ? {...el, filter: value} : el))
    }

    return (
        <div className="App">
            {
                todolists.map(el=> {
                    let tasksForTodoList = tasks;
                    if (el.filter === 'completed') {
                        tasksForTodoList = tasks.filter(t=> t.isDone)
                    }
                    if (el.filter === 'active') {
                        tasksForTodoList = tasks.filter(t=> !t.isDone)
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
