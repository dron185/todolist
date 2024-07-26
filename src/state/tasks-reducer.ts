import {TasksStateType} from "../App";
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI} from "../api/api";
import {Dispatch} from "redux";

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>

export type AddTaskActionType = {
    type: 'ADD-TASK'
    payload: {
        title: string
        id: string
    }
}

export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS'
    payload: {
        taskId: string
        status: TaskStatuses
        todolistId: string
    }
}

export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE'
    payload: {
        taskId: string
        newTitle: string
        todolistId: string
    }
}

export type SetTasksActionType = {
    type: 'SET-TASKS'
    tasks: Array<TaskType>
    todolistId: string
}

type ActionsType =
    | RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | SetTasksActionType

export let initialTasksState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialTasksState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter(el => el.id !== action.payload.taskId)
            }
        }
        case "ADD-TASK": {
            const newTask: TaskType = {
                id: v1(),
                title: action.payload.title,
                status: TaskStatuses.New,
                todoListId: action.payload.id,
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low
            }
            return {
                ...state,
                [action.payload.id]: [newTask, ...state[action.payload.id]]
            }
        }
        case "CHANGE-TASK-STATUS": {
            return {
                ...state,
                [action.payload.todolistId]:
                    state[action.payload.todolistId].map(el => el.id === action.payload.taskId ?
                        {...el, status: action.payload.status} : el)
            }
        }
        case "CHANGE-TASK-TITLE": {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(el => el.id === action.payload.taskId ? {
                    ...el,
                    title: action.payload.newTitle
                } : el)
            }
        }

        case "ADD-TODOLIST": {
            // const stateCopy = {...state};
            // stateCopy[action.payload.todolistId] = [];
            // return stateCopy
            return {
                ...state,
                [action.payload.todolistId]: []
            }
        }
        case "REMOVE-TODOLIST": {
            const stateCopy = {...state};
            delete stateCopy[action.payload.id]
            return stateCopy
            // let {[action.payload.id]: aaa, ...rest} = state
            // return rest
        }
        case "SET-TODOLISTS":
            const stateCopy = {...state};
            action.todolists.forEach(tl => {
                stateCopy[tl.id] = [];
            })
            return stateCopy
        case "SET-TASKS": {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = action.tasks
            return stateCopy
        }
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            taskId: taskId,
            todolistId: todolistId,
        }
    } as const
}

export const addTaskAC = (title: string, todolistId: string): AddTaskActionType => {
    return {
        type: 'ADD-TASK',
        payload: {
            title,
            id: todolistId,
        }
    } //  as const - можно не писать если указали тип RemoveTaskActionType
}

export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): ChangeTaskStatusActionType => {
    return {
        type: 'CHANGE-TASK-STATUS',
        payload: {
            taskId,
            status,
            todolistId,
        }
    }
}

export const changeTaskTitleAC = (taskId: string, newTitle: string, todolistId: string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        payload: {
            taskId,
            newTitle,
            todolistId,
        }
    } as const
}

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string): SetTasksActionType => (
    {type: 'SET-TASKS', tasks, todolistId}
)


//Thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.getTasks(todolistId)
        .then(result => {
            const tasks = result.data.items
            dispatch(setTasksAC(tasks, todolistId))
    })
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(result => {
            dispatch(removeTaskAC(taskId, todolistId))
        })
}