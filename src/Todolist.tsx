import React, {useState} from "react";
import {Button} from "./Button";
import {TodoListHeader} from "./TodoListHeader";
import {FilterValuesType} from "./App";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TodolistPropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string) => void
    changeFilter: (value: FilterValuesType) => void
    addTask: (title: string) => void
}

export const Todolist = ({title, tasks, removeTask, changeFilter, addTask}: TodolistPropsType) => {
    //деструктурирующее присваивание: const { title, tasks, removeTask, changeFilter, addTask } = props

    const [newTaskTitle, setNewTaskTitle] = useState("")

    const tasksList: JSX.Element = tasks.length === 0 ? (<p>Тасок нет</p>) : <ul>
        {tasks.map((t) => {
            return (
                <li key={t.id}>
                    <input type="checkbox" checked={t.isDone}/>
                    <span>{t.title}</span>
                    <button onClick={(e) => {
                        removeTask(t.id)
                    }}>x
                    </button>
                </li>
            )
        })}
    </ul>

    return (
        <div>
            <TodoListHeader title={title}/>
            <div>
                <input value={newTaskTitle} onChange={ (e) => {
                    setNewTaskTitle(e.currentTarget.value)
                } }/>
                <button onClick={()=>{
                    addTask(newTaskTitle);
                    setNewTaskTitle("");
                }}>+</button>
            </div>
            {tasksList}
            <div>
                <Button title={'All'} onClick={() => {
                    changeFilter('all')
                }}/>
                <Button title={'Active'} onClick={() => {
                    changeFilter('completed')
                }}/>
                <Button title={'Completed'} onClick={() => {
                    changeFilter('active')
                }}/>
            </div>
        </div>
    )
}