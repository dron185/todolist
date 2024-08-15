import {
    addTodolistAC,
    AddTodolistActionType,
    changeTodolistEntityStatusAC,
    ChangeTodolistEntityStatusActionType, removeTodolistAC,
    RemoveTodolistActionType, setTodolistsAC,
    SetTodolistsActionType
} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../../api/api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../app/store";
import {RequestStatusType, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

export let initialTasksState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialTasksState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(el => el.id !== action.taskId)}
        case "ADD-TASK":
            return {...state, [action.task.todoListId]: [{...action.task, entityStatus: 'idle'}, ...state[action.task.todoListId]]}
        case "UPDATE-TASK":
            return {...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)}
        case addTodolistAC.type:
            return {...state, [action.payload.todolist.id]: []}
        case removeTodolistAC.type: {
            const stateCopy = {...state};
            delete stateCopy[action.payload.todolistId]
            return stateCopy
        }
        // фигурные скобки в case нужны тогда, когда мы определяем переменные,
        // чтобы не было пересечения с другими переменными
        case setTodolistsAC.type:
            const stateCopy = {...state};
            action.payload.todolists.forEach(tl => {
                stateCopy[tl.id] = [];
            })
            return stateCopy
        case "SET-TASKS": {
            return {...state, [action.todolistId]: action.tasks.map(t => ({...t, entityStatus: 'idle'})) }
            //return {...state, [action.todolistId]: action.tasks }

            // const stateCopy = {...state}
            // stateCopy[action.todolistId] = action.tasks
            // return stateCopy
        }
        case 'CHANGE-TASK-ENTITY-STATUS': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, entityStatus: action.status} : t)
            }
        }
        default:
            return state
    }
}

// actions
export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: 'REMOVE-TASK', taskId, todolistId } as const)

export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
//as const - можно не писать если указали тип RemoveTaskActionType

export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) => ({
    type: 'UPDATE-TASK',
    model,
    todolistId,
    taskId
} as const)

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
    ({type: 'SET-TASKS', tasks, todolistId} as const)

export const changeTaskEntityStatusAC = (todolistId: string, taskId: string, status: RequestStatusType) =>
    ({type: 'CHANGE-TASK-ENTITY-STATUS', todolistId, taskId, status} as const)


// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: ThunkDispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.getTasks(todolistId)
        .then(result => {
            const tasks = result.data.items
            dispatch(setTasksAC(tasks, todolistId))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}
export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: ThunkDispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'loading'))
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(result => {
            if (result.data.resultCode === 0) {
                dispatch(removeTaskAC(taskId, todolistId))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(result.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}
export const addTaskTC = (todolistId: string, taskTitle: string) => (dispatch: ThunkDispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({todolistId, status: 'loading'}))
    todolistsAPI.createTask(todolistId, taskTitle)
        .then(result => {
            if (result.data.resultCode === 0) {
                dispatch(addTaskAC(result.data.data.item))
                dispatch(setAppStatusAC({status: 'succeeded'}))
                dispatch(changeTodolistEntityStatusAC({todolistId, status: 'succeeded'}))
            } else {
                handleServerAppError(result.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) => (dispatch: ThunkDispatch, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'loading'))
    const allTasksFromState = getState().tasks
    const tasksForCurrentTodolist = allTasksFromState[todolistId]
    const task = tasksForCurrentTodolist.find(t => t.id === taskId)

    if (task) {
        const apiModel: UpdateTaskModelType = {
            title: task.title,
            startDate: task.startDate,
            priority: task.priority,
            description: task.description,
            deadline: task.deadline,
            status: task.status,
            ...domainModel
        }
        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC(taskId, domainModel, todolistId))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(err => {
                handleServerNetworkError(err, dispatch)
            })
            .finally(() => {
                dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'succeeded'))
            })
    }
}

// types

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

// export type TasksStateType = {
//     [key: string]: TaskType[]
// }

export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}

export type TasksStateType = {
    [key: string]: TaskDomainType[]
}

type ChangeTaskEntityStatusActionType = ReturnType<typeof changeTaskEntityStatusAC>

type ActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof updateTaskAC>
    | ChangeTodolistEntityStatusActionType
    | ChangeTaskEntityStatusActionType


type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>

