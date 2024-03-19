import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from "./Todolist";
import {v1} from "uuid";

export type FilterValuesType = 'all' | 'completed' | 'active';

function App() {

    const [tasks, setTasks] = useState< Array<TaskType> >([
        {id: v1(), title: "HTML&CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "React", isDone: false},
        {id: v1(), title: 'Redux', isDone: false},
    ]);

    const [filter, setFilter] = useState<FilterValuesType>('all');

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

    const changeTaskStatus = (taskId: string) => {
        // const task = tasks.find(t => t.id === taskId)
        // if (task) {
        //     task.isDone = !task.isDone
        //     setTasks([...tasks])
        // }
        const updatedState = tasks.map(t => t.id === taskId ? {...t, isDone: !t.isDone } : t)
        setTasks(updatedState)
    }

    // filter
    const changeFilter = (value: FilterValuesType) => {
        setFilter(value)
    }

    let tasksForTodoList = tasks;
    if (filter === 'completed') {
        tasksForTodoList = tasks.filter(t=> t.isDone)
    }
    if (filter === 'active') {
        tasksForTodoList = tasks.filter(t=> !t.isDone)
    }

    return (
        <div className="App">
            <Todolist title={"What to learn"}
                      tasks={tasksForTodoList}
                      removeTask={removeTask}
                      changeFilter={changeFilter}
                      addTask = {addTask}
                      changeTaskStatus = {changeTaskStatus}
            />
        </div>
    );
}

export default App;
