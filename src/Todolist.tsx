import React, {ChangeEvent, KeyboardEvent, useState} from "react";
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
    const addTaskHandler = () => {
        addTask(newTaskTitle)
        setNewTaskTitle("")
    }

    const tasksList: JSX.Element = tasks.length === 0 ? (<p>Тасок нет</p>) : <ul>
        {tasks.map((t) => {
            const removeTaskHandler = () => {removeTask(t.id)}
            return (
                <li key={t.id}>
                    <input type="checkbox" checked={t.isDone}/>
                    <span>{t.title}</span>
                    <button onClick={removeTaskHandler}>x</button>
                </li>
            )
        })}
    </ul>

    const changeNewTaskTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
    }

    const addTaskOnKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            addTaskHandler()
        }
    }

    const changeFilterHandlerCreator = (filter: FilterValuesType) => {
        return () => changeFilter(filter)
    }

    return (
        <div>
            <TodoListHeader title={title}/>
            <div>
                <input value={newTaskTitle}
                       onChange={changeNewTaskTitleHandler}
                       onKeyDown={addTaskOnKeyDownHandler}
                />
                <Button title={"+"} onClick={addTaskHandler} />
                {/*<button onClick={()=>{addTask(newTaskTitle); setNewTaskTitle("");}}>+</button>*/}
            </div>
            {tasksList}
            <div>
                <Button title={'All'} onClick={changeFilterHandlerCreator('all')}/>
                <Button title={'Active'} onClick={changeFilterHandlerCreator('completed')}/>
                <Button title={'Completed'} onClick={changeFilterHandlerCreator('active')}/>
            </div>
        </div>
    )
}