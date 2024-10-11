// import { AppDispatch } from 'app/store'
// import { BaseResponse } from 'common/types/types'
// import { appActions } from 'app/appSlice'
//
// /**
//  * Handles server errors and updates the application state accordingly.
//  *
//  * @template T - The type of data returned by the server.
//  * @param {BaseResponse<T>} data - The server response object containing error information.
//  * @param {AppDispatch} dispatch - The function to dispatch actions to the Redux store.
//  * @param {boolean} [isShowError=true] - A flag indicating whether to display the error to the user.
//  *
//  * @returns {void} void
//  */
//
// export const handleServerAppError = <T>(data: BaseResponse<T>, dispatch: AppDispatch, isShowError: boolean = true) => {
//   if (isShowError) {
//     const error = data.messages.length ? data.messages[0] : 'Some error occurred'
//     dispatch(appActions.setAppError({ error }))
//   }
//   dispatch(appActions.setAppStatus({ status: 'failed' }))
// }
