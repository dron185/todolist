import React, {ChangeEvent, KeyboardEvent} from "react";
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
    addTask: (title: string) => void
    removeTask: (taskId: string) => void
    changeTaskStatus : (taskId: string) => void
    changeFilter: (value: FilterValuesType) => void
}

export const Todolist = ({
                             title,
                             tasks,
                             addTask,
                             removeTask,
                             changeTaskStatus,
                             changeFilter
}: TodolistPropsType) => {
    //деструктурирующее присваивание: const { title, tasks, removeTask, changeFilter, addTask } = props

    const [newTaskTitle, setNewTaskTitle] = React.useState("")
    const addNewTaskHandler = () => {
        addTask(newTaskTitle)
        setNewTaskTitle("")
    }

    const tasksList: JSX.Element = tasks.length === 0 ? (<p>Тасок нет</p>) : <ul>
        {tasks.map((t) => {
            const removeTaskHandler = () => removeTask(t.id)
            const changeStatusHandler = () => changeTaskStatus(t.id)
            return (
                <li key={t.id}>
                    <input
                        type="checkbox"
                        checked={t.isDone}
                        onChange={changeStatusHandler}
                    />
                    <span>{t.title}</span>
                    <Button title={"x"} onClickHandler={removeTaskHandler}/>
                </li>
            )
        })}
    </ul>

    const changeNewTaskTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
    }

    const addTaskOnKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && e.ctrlKey && isAddTaskPossible) {
            addNewTaskHandler()
        }
    }

    const changeFilterHandlerCreator = (filter: FilterValuesType) => {
        return () => changeFilter(filter)
    }

    const maxTitleLength = 15
    const isAddTaskPossible = newTaskTitle.length && newTaskTitle.length <= maxTitleLength

    return (
        <div className={"todolist"}>
            <TodoListHeader title={title}/>
            <div>
                <input value={newTaskTitle}
                       onChange={changeNewTaskTitleHandler}
                       onKeyDown={addTaskOnKeyDownHandler}
                />
                <Button title={"+"} onClickHandler={addNewTaskHandler} isDisabled={!isAddTaskPossible}/>
                {!newTaskTitle.length && <div>Please, enter title</div>}
                {newTaskTitle.length > maxTitleLength && <div>Task title is too long</div>}
            </div>
            {tasksList}
            <div>
                <Button title={'All'} onClickHandler={changeFilterHandlerCreator('all')}/>
                <Button title={'Active'} onClickHandler={changeFilterHandlerCreator('completed')}/>
                <Button title={'Completed'} onClickHandler={changeFilterHandlerCreator('active')}/>
            </div>
        </div>
    )
}