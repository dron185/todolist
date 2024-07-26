import {v1} from "uuid";
import {todolistsAPI, TodolistType} from "../api/api";
import {Dispatch} from "redux";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    payload: {
        id: string
    }
}

export type AddTodolistActionType = {
    type: 'ADD-TODOLIST'
    payload: {
        title: string
        todolistId: string
    }
}

export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    payload: {
        id: string
        title: string
    }
}

export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER'
    payload: {
        id: string
        filter: FilterValuesType
    }
}

export type SetTodolistsActionType = {
    type: 'SET-TODOLISTS'
    todolists: Array<TodolistType>
}

export type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistsActionType

export let initialTodolistsState: TodolistDomainType[] = []

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export const todolistsReducer = (state: TodolistDomainType[] = initialTodolistsState, action: ActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(el => el.id !== action.payload.id)
        }
        case 'ADD-TODOLIST': {
            const newTodolist: TodolistDomainType = {
                id: action.payload.todolistId,
                title: action.payload.title,
                filter: 'all',
                addedDate: '',
                order: 0
            }
            return [...state, newTodolist]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(el => el.id === action.payload.id ?
                {...el, title: action.payload.title} : el)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(el => el.id === action.payload.id ? {...el, filter: action.payload.filter} : el)
        }
        case "SET-TODOLISTS":
            return action.todolists.map(tl => ({...tl, filter: 'all'}))
        default:
            return state
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            id: todolistId
        }
    } as const
}

export const addTodolistAC = (title: string): AddTodolistActionType => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            title: title,
            todolistId: v1(),
        }
    } as const
}

export const changeTodolistTitleAC = (todolistId: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', payload: {id: todolistId, title: title}} as const
}

export const changeTodolistFilterAC = (todolistId: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', payload: {id: todolistId, filter: filter}} as const
}

export const setTodolistsAC = (todolists: Array<TodolistType>): SetTodolistsActionType => ({
    type: 'SET-TODOLISTS',
    todolists
})


//Thunks
export const fetchTodolistsTC = () => (dispatch: Dispatch) => {
    todolistsAPI.getTodolists()
        .then(res => {
            dispatch(setTodolistsAC(res.data))
        })
}


