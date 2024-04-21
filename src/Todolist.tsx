import React, {ChangeEvent} from "react";
// import {Button} from "./Button";
import {FilterValuesType} from "./App";
import AddItemForm from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button';

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
    addTask: (todolistId: string, title: string) => void
    removeTask: (todolistId: string, taskId: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, newIsDoneValue: boolean) => void
    changeFilter: (todolistId: string, value: FilterValuesType) => void
    removeTodolist: (todolistId: string) => void
    updateTaskTitle: (todolistId: string, taskId: string, newTitle: string) => void
    updateTodolistTitle: (todolistId: string, newTitle: string) => void
}

export const Todolist = ({
                             removeTodolist,
                             todolistId,
                             title,
                             tasks,
                             filter,
                             addTask,
                             removeTask,
                             changeTaskStatus,
                             changeFilter,
                             updateTaskTitle,
                             updateTodolistTitle
                         }: TodolistPropsType) => {
    //деструктурирующее присваивание: const { title, tasks, removeTask, changeFilter, addTask } = props

    const tasksList: JSX.Element = tasks.length === 0 ? (<p>Тасок нет</p>) : <ul>
        {tasks.map((t) => {
            const removeTaskHandler = () => removeTask(t.id, todolistId)
            const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => changeTaskStatus(todolistId, t.id, e.currentTarget.checked)
            // const updateTaskTitleHandler = (newTitle: string) => {
            //     updateTaskTitle(todolistId, t.id, newTitle)
            // }
            return (
                <li key={t.id}>
                    <input
                        type="checkbox"
                        checked={t.isDone} // true || false
                        onChange={changeStatusHandler}
                    />
                    {/*<span className={t.isDone ? "task-done" : "task"}>{t.title}</span>*/}
                    <EditableSpan oldTitle={t.title}
                                  spanClass={t.isDone ? "task-done" : "task"}
                                  updateTitle={(newTitle: string)=>updateTaskTitleHandler(t.id, newTitle)}
                    />
                    {/*<Button title={"x"} onClickHandler={removeTaskHandler}/>*/}
                    <IconButton onClick={removeTaskHandler}>
                        <DeleteIcon />
                    </IconButton>
                </li>
            )
        })}
    </ul>

    // const changeNewTaskTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    //     inputError &&  setInputError(false)
    //     setNewTaskTitle(e.currentTarget.value)
    // }
    //
    // const addTaskOnKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    //     if (e.key === 'Enter' && e.ctrlKey && isAddTaskPossible) {
    //         addNewTaskHandler()
    //     }
    // }

    const changeFilterHandlerCreator = (filter: FilterValuesType) => {
        return () => changeFilter(todolistId, filter)
    }

    // const maxTitleLength = 15
    // const isAddTaskPossible = newTaskTitle.length && newTaskTitle.length <= maxTitleLength

    const removeTodolistHandler = () => {
        removeTodolist(todolistId)
    }

    const addTaskHandler = (title: string) => {
        addTask(todolistId, title)
    }

    const updateTodolistTitleHandler = (newTitle: string) => {
        updateTodolistTitle(todolistId, newTitle)
    }

    const updateTaskTitleHandler = (newTitle: string, taskId: string) => {
        updateTaskTitle(todolistId, taskId, newTitle)
    }

    return (
        <div className={"todolist"}>
            {/*<TodoListHeader title={title}/>*/}
            <div className={'todolist-title-container'}>
                <EditableSpan oldTitle={title}
                              // spanClass={t.isDone ? "task-done" : "task"}
                              updateTitle={updateTodolistTitleHandler}
                />
                {/*<h3 style={{margin: 0}}>{title}</h3>*/}
                <IconButton onClick={removeTodolistHandler}>
                    <DeleteIcon />
                </IconButton>
                {/*<Button title={"x"} onClickHandler={removeTodolistHandler}/>*/}
            </div>
            <AddItemForm addItem={addTaskHandler}/>
            {tasksList}
            <div>
                {/*<Button*/}
                {/*    classes={filter === "all" ? "btn-active" : ""}*/}
                {/*    title={'All'}*/}
                {/*    onClickHandler={changeFilterHandlerCreator('all')}*/}
                {/*/>*/}

                <Button
                    variant={filter === 'all' ? 'outlined' : 'contained'}
                    color={'secondary'}
                    onClick={changeFilterHandlerCreator('all')}
                >All</Button>

                {/*<Button*/}
                {/*    classes={filter === "active" ? "btn-active" : ""}*/}
                {/*    title={'Active'}*/}
                {/*    onClickHandler={changeFilterHandlerCreator('active')}*/}
                {/*/>*/}

                <Button
                    variant={filter === 'active' ? 'outlined' : 'contained'}
                    color={'error'}
                    onClick={changeFilterHandlerCreator('active')}
                >Active</Button>

                {/*<Button*/}
                {/*    classes={filter === "completed" ? "btn-active" : ""}*/}
                {/*    title={'Completed'}*/}
                {/*    onClickHandler={changeFilterHandlerCreator('completed')}*/}
                {/*/>*/}

                <Button
                    variant={filter === 'completed' ? 'outlined' : 'contained'}
                    color={'secondary'}
                    onClick={changeFilterHandlerCreator('completed')}
                >Completed</Button>
            </div>
        </div>
    )
}