import {Dispatch} from 'redux'
import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType,} from '../../app/app-reducer'
import {authAPI, LoginParamsType} from "../../api/api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTodosDataAC, ClearTodosDataActionType} from "../TodolistsList/todolists-reducer";

const initialState/*: InitialStateType*/ = {
    isLoggedIn: false
}

const slice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(stateDraft, action: PayloadAction<{ value: boolean }>) {
            stateDraft.isLoggedIn = action.payload.value;
        }
    }
})

export const authReducer = slice.reducer;
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC;

// export const authReducer = (
//     state: InitialStateType = initialState,
//     action: ActionsType
// ): InitialStateType => {
//     switch (action.type) {
//         case 'login/SET-IS-LOGGED-IN':
//             return {...state, isLoggedIn: action.value}
//         default:
//             return state
//     }
// }

// actions
// export const setIsLoggedInAC = (value: boolean) =>
//     ({type: 'login/SET-IS-LOGGED-IN', value}) as const

// thunks
export const loginTC = (data: LoginParamsType) =>
    (dispatch: Dispatch/*<ActionsType | SetAppStatusActionType | SetAppErrorActionType>*/) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        authAPI.login(data)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(setIsLoggedInAC({value: true}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(err => {
                handleServerNetworkError(err, dispatch)
            })
    }

export const logoutTC = () =>
    (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        authAPI.logout()
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(setIsLoggedInAC({value: false}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                    dispatch(clearTodosDataAC())
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(err => {
                handleServerNetworkError(err, dispatch)
            })
    }


// types
// type InitialStateType = {
//     isLoggedIn: boolean
// }

type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppStatusActionType | SetAppErrorActionType | ClearTodosDataActionType
