import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'app/model/store'
import { appActions, selectAppError } from 'app/model/appSlice'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return (
    <MuiAlert
      elevation={6}
      ref={ref}
      variant='filled'
      {...props}
    />
  )
})

export function ErrorSnackbar() {
  const error = useSelector(selectAppError)
  const dispatch = useAppDispatch()

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch(appActions.setAppError({ error: null }))
  }
  return (
    <Snackbar
      open={error !== null}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity='error'
        sx={{ width: '100%' }}
      >
        {error}
      </Alert>
    </Snackbar>
  )
}
