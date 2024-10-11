// import { AppDispatch } from 'app/store'
// import axios from 'axios'
// import { appActions } from 'app/appSlice'
//
// /**
//  * Handles server network errors by dispatching appropriate actions to update the application state.
//  * This function checks the type of the error and extracts an appropriate error message, which is then
//  * dispatched to the Redux store along with a status update.
//  *
//  * @param {unknown} err - The error object to be handled. This can be of any type, but typically it will be
//  *                        an instance of `Error` or an Axios error.
//  * @param {AppDispatch} dispatch - The dispatch function from the Redux store, used to dispatch actions.
//  * @returns {void}
//  * @example
//  * try {
//  *   await someAsyncOperation();
//  * } catch (error) {
//  *   handleServerNetworkError(error, dispatch);
//  * }
//  */
//
// export const handleServerNetworkError = (err: unknown, dispatch: AppDispatch): void => {
//   let errorMessage = 'Some error occurred'
//
//   // ❗Проверка на наличие axios ошибки
//   if (axios.isAxiosError(err)) {
//     // ⏺️ err.response?.data?.message - например получение тасок с невалидной todolistId
//     // ⏺️ err?.message - например при создании таски в offline режиме
//     errorMessage = err.response?.data?.message || err?.message || errorMessage
//     // ❗ Проверка на наличие нативной ошибки
//   } else if (err instanceof Error) {
//     errorMessage = `Native error: ${err.message}`
//     // ❗Какой-то непонятный кейс
//   } else {
//     errorMessage = JSON.stringify(err)
//   }
//
//   dispatch(appActions.setAppError({ error: errorMessage }))
//   dispatch(appActions.setAppStatus({ status: 'failed' }))
// }
