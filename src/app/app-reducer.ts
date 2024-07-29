export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

// const initialState: InitialStateType = {
//     status: 'idle',
//     error: null,
// }
//
// type InitialStateType = {
//     status: RequestStatusType
//     error: string | null
// }

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
}

type InitialStateType = typeof initialState

export const appReducer = (
    state: InitialStateType = initialState,
    action: ActionsType
): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return { ...state, status: action.status }
        case 'APP/SET-ERROR':
            return {...state, error: action.error }
        default:
            return state
    }
}

export type SetAppStatusActinType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActinType = ReturnType<typeof setAppErrorAC>

type ActionsType = SetAppStatusActinType | SetAppErrorActinType

export const setAppStatusAC = (status: RequestStatusType) =>
    ({type: 'APP/SET-STATUS', status} as const)

export const setAppErrorAC = (error: string | null) =>
    ({type: 'APP/SET-ERROR', error} as const)
