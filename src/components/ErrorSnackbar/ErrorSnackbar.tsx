import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'app/store'
import { setAppErrorAC } from 'app/app-reducer'
import { selectAppError } from 'app/app.selectors'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return (
      <MuiAlert
        elevation={6}
        ref={ref}
        variant='filled'
        {...props}
      />
    )
  }
)

export function ErrorSnackbar() {
  const error = useSelector(selectAppError)
  const dispatch = useAppDispatch()

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch(setAppErrorAC({ error: null }))
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
