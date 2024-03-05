import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from "./Todolist";

function App() {

    let initTasks: Array<TaskType> = [
        {id: 1, title: "HTML&CSS", isDone: true},
        {id: 2, title: "JS", isDone: true},
        {id: 3, title: "React", isDone: false},
        {id: 4, title: 'Redux', isDone: false},
    ]

    let arr  = useState(initTasks);
    let tasks = arr[0];
    let setTasks = arr[1];

    function removeTask(taskId: number) {
        let newFiltredtasks = tasksArr.filter( t => t.id !== taskId )
    }

    return (
        <div className="App">
            <Todolist title={"What to learn"}
                      tasks={tasksArr}
                      removeTask={removeTask}
            />
        </div>
    );
}

export default App;
