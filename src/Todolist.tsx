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
    todolistId: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    addTask: (title: string) => void
    removeTask: (taskId: string) => void
    changeTaskStatus: (taskId: string, newIsDoneValue: boolean) => void
    changeFilter: (todolistId: string, value: FilterValuesType) => void
}

export const Todolist = ({
                             todolistId,
                             title,
                             tasks,
                             filter,
                             addTask,
                             removeTask,
                             changeTaskStatus,
                             changeFilter
                         }: TodolistPropsType) => {
    //деструктурирующее присваивание: const { title, tasks, removeTask, changeFilter, addTask } = props

    const [newTaskTitle, setNewTaskTitle] = React.useState("")
    const [inputError, setInputError] = useState<boolean>(false)

    const addNewTaskHandler = () => {
        const trimmedTaskTitle = newTaskTitle.trim()
        if (trimmedTaskTitle) {
            addTask(trimmedTaskTitle)
        } else {
            setInputError(true)
            setTimeout(()=>setInputError(false), 3000)
        }
        setNewTaskTitle("")
    }

    const tasksList: JSX.Element = tasks.length === 0 ? (<p>Тасок нет</p>) : <ul>
        {tasks.map((t) => {
            const removeTaskHandler = () => removeTask(t.id)
            const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => changeTaskStatus(t.id, e.currentTarget.checked)
            return (
                <li key={t.id}>
                    <input
                        type="checkbox"
                        checked={t.isDone} // true || false
                        onChange={changeStatusHandler}
                    />
                    <span className={t.isDone ? "task-done" : "task"}>{t.title}</span>
                    <Button title={"x"} onClickHandler={removeTaskHandler}/>
                </li>
            )
        })}
    </ul>

    const changeNewTaskTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        inputError &&  setInputError(false)
        setNewTaskTitle(e.currentTarget.value)
    }

    const addTaskOnKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && e.ctrlKey && isAddTaskPossible) {
            addNewTaskHandler()
        }
    }

    const changeFilterHandlerCreator = (filter: FilterValuesType) => {
        return () => changeFilter(todolistId, filter)
    }

    const maxTitleLength = 15
    const isAddTaskPossible = newTaskTitle.length && newTaskTitle.length <= maxTitleLength

    return (
        <div className={"todolist"}>
            <TodoListHeader title={title}/>
            <div>
                <input
                    className={inputError ? "input-error" : ""}
                    value={newTaskTitle}
                    onChange={changeNewTaskTitleHandler}
                    onKeyDown={addTaskOnKeyDownHandler}
                />
                <Button
                    title={"+"}
                    onClickHandler={addNewTaskHandler}
                    isDisabled={!isAddTaskPossible}
                />
                {!newTaskTitle.length && <div style={{color: inputError ? "red" : "black"}}>Please, enter title</div>}
                {newTaskTitle.length > maxTitleLength && <div>Task title is too long</div>}
            </div>
            {tasksList}
            <div>
                <Button
                    classes={filter === "all" ? "btn-active" : ""}
                    title={'All'}
                    onClickHandler={changeFilterHandlerCreator('all')}
                />
                <Button
                    classes={filter === "active" ? "btn-active" : ""}
                    title={'Active'}
                    onClickHandler={changeFilterHandlerCreator('active')}
                />
                <Button
                    classes={filter === "completed" ? "btn-active" : ""}
                    title={'Completed'}
                    onClickHandler={changeFilterHandlerCreator('completed')}
                />
            </div>
        </div>
    )
}