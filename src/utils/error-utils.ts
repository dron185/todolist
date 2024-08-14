import {
    setAppErrorAC,
    setAppStatusAC,
    SetAppStatusActionType,
    SetAppErrorActionType,
} from '../app/app-reducer'
import {Dispatch} from 'redux'
import {ResponseType} from '../api/api'

type ErrorUtilsDispatchType = Dispatch<SetAppErrorActionType | SetAppStatusActionType>

// generic function
export const handleServerAppError = <T>(
    data: ResponseType<T>,
    dispatch: ErrorUtilsDispatchType
) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetworkError = (
    error: { message: string },
    dispatch: ErrorUtilsDispatchType
) => {
    dispatch(setAppErrorAC({error: error.message ? error.message : 'Some error occurred'}))
    dispatch(setAppStatusAC({status: 'failed'}))
}