import {TasksStateType} from "../App";
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolists-reducer";

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>

// export type RemoveTaskActionType = {
//     type: 'REMOVE-TASK'
//     payload: {
//         taskId: string
//         todolistId: string
//     }
// }

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
        newIsDoneValue: boolean
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

type ActionsType =
    | RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType

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
            const newTask = {
                id: v1(),
                title: action.payload.title,
                isDone: false
            }
            return {...state,
                [action.payload.id]: [newTask, ...state[action.payload.id]]
            }
        }
        case "CHANGE-TASK-STATUS": {
            return {...state,
                [action.payload.todolistId]:
                    state[action.payload.todolistId].map(el => el.id === action.payload.taskId ?
                        {...el, isDone: action.payload.newIsDoneValue} : el)
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
                [action.payload.todolistId] : []
            }
        }
        case "REMOVE-TODOLIST": {
            const stateCopy = {...state};
            delete stateCopy[action.payload.id]
            return stateCopy
            // let {[action.payload.id]: aaa, ...rest} = state
            // return rest
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

export const changeTaskStatusAC = (taskId: string, newIsDoneValue: boolean, todolistId: string): ChangeTaskStatusActionType => {
    return {
        type: 'CHANGE-TASK-STATUS',
        payload: {
            taskId,
            newIsDoneValue,
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

