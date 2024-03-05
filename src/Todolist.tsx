import React from "react";
import {Button} from "./Button";
import {TodoListHeader} from "./TodoListHeader";
import {FilterValuesType} from "./App";

export type TaskType = {
    id: number
    title: string
    isDone: boolean
}

type TodolistPropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: number) => void
    changeFilter: (value: FilterValuesType) => void
}

export const Todolist = ({title, tasks, removeTask, changeFilter}: TodolistPropsType) => {

    //деструктурирующее присваивание: const { title, tasks, date } = props
    const tasksList: JSX.Element = tasks.length === 0 ? (<p>Тасок нет</p>) : <ul>
        {tasks.map((t) => {
            return (
                <li key={t.id}>
                    <input type="checkbox" checked={t.isDone}/>
                    <span>{t.title}</span>
                    <button onClick={() => {
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
                <input/>
                <button>+</button>
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