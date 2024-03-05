import React from "react";
import {Button} from "./Button";
import {TodoListHeader} from "./TodoListHeader";

export type TaskType = {
    id: number
    title: string
    isDone: boolean
}

type TodolistPropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: number)=>void
}

export const Todolist = ({title, tasks, removeTask}: TodolistPropsType) => {

    //деструктурирующее присваивание: const { title, tasks, date } = props
    const tasksList: JSX.Element = tasks.length === 0 ? (<p>Тасок нет</p>) : <ul>
        {tasks.map((t) => {
            return (
                <li key={t.id}>
                    <input type="checkbox" checked={t.isDone}/>
                    <span>{t.title}</span>
                    <button onClick={()=>{removeTask(t.id)}}>x</button>
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
                <Button title={'All'}/>
                <Button title={'Active'}/>
                <Button title={'Completed'}/>
            </div>
        </div>
    )
}