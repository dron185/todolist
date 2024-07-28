import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../../api/api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../app/store";

export type TasksStateType = {
    [key: string]: TaskType[]
}

type ActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof updateTaskAC>

export let initialTasksState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialTasksState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(el => el.id !== action.taskId)}
        case "ADD-TASK":
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case "UPDATE-TASK":
            return {...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)}
        case "ADD-TODOLIST":
            return {...state, [action.todolist.id]: []}
        case "REMOVE-TODOLIST": {
            const stateCopy = {...state};
            delete stateCopy[action.todolistId]
            return stateCopy
        }
        // фигурные скобки в case нужны тогда, когда мы определяем переменные,
        // чтобы не было пересечения с другими переменными
        case "SET-TODOLISTS":
            const stateCopy = {...state};
            action.todolists.forEach(tl => {
                stateCopy[tl.id] = [];
            })
            return stateCopy
        case "SET-TASKS": {
            return {...state, [action.todolistId]: action.tasks }
            // const stateCopy = {...state}
            // stateCopy[action.todolistId] = action.tasks
            // return stateCopy
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


// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.getTasks(todolistId)
        .then(result => {
            const tasks = result.data.items
            dispatch(setTasksAC(tasks, todolistId))
        })
}
export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(result => {
            dispatch(removeTaskAC(taskId, todolistId))
        })
}
export const addTaskTC = (todolistId: string, taskTitle: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.createTask(todolistId, taskTitle)
        .then(result => {
            dispatch(addTaskAC(result.data.data.item))
        })
}
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) => (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {

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
                dispatch(updateTaskAC(taskId, domainModel, todolistId))
            })
    }
}