import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from "./Todolist";
import {v1} from "uuid";

export type FilterValuesType = 'all' | 'completed' | 'active';

function App() {

    let [tasks, setTasks] = useState< Array<TaskType> >([
        {id: v1(), title: "HTML&CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "React", isDone: false},
        {id: v1(), title: 'Redux', isDone: false},
    ]);

    let [filter, setFilter] = useState<FilterValuesType>('all');


    function removeTask(taskId: string) {
        let filtredtasks = tasks.filter( t => t.id !== taskId )
        setTasks(filtredtasks);
    }

    function addTask( title: string ) {
        let newTask = {
            id: v1(),
            title: title,
            isDone: false
        };
        let newTasks = [newTask, ...tasks];
        setTasks(newTasks)
    }

    function changeFilter(value: FilterValuesType) {
        setFilter(value)
    }

    let tasksForTodoList = tasks;
    if (filter === 'completed') {
        tasksForTodoList = tasks.filter(t=>t.isDone === true)
    }
    if (filter === 'active') {
        tasksForTodoList = tasks.filter(t=>t.isDone === false)
    }


    return (
        <div className="App">
            <Todolist title={"What to learn"}
                      tasks={tasksForTodoList}
                      removeTask={removeTask}
                      changeFilter={changeFilter}
                      addTask = {addTask}
            />
        </div>
    );
}

export default App;
