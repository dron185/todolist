import React from 'react'
import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { selectCaptchaUrl, selectIsLoggedIn } from 'features/auth/model/authSlice'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { useLogin } from 'features/auth/lib/useLogin'

export const Login = () => {
  const { formik } = useLogin()

  const isLoggedIn = useSelector(selectIsLoggedIn)
  const captchaUrl = useSelector(selectCaptchaUrl)

  if (isLoggedIn) {
    return <Navigate to={'/todolists'} />
  }

  return (
    <Grid
      container
      justifyContent={'center'}
    >
      <Grid
        item
        justifyContent={'center'}
      >
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered
                <a
                  href={'https://social-network.samuraijs.com/'}
                  target={'_blank'}
                  rel='noreferrer'
                >
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField
                label='Email'
                margin='normal'
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email ? (
                <div style={{ color: 'red' }}>{formik.errors.email}</div>
              ) : null}
              <TextField
                type='password'
                label='Password'
                margin='normal'
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password ? (
                <div style={{ color: 'red' }}>{formik.errors.password}</div>
              ) : null}

              <FormControlLabel
                label={'Remember me'}
                control={
                  <Checkbox
                    checked={formik.values.rememberMe}
                    {...formik.getFieldProps('rememberMe')}
                  />
                }
              />
              {captchaUrl && <img src={captchaUrl} />}
              {captchaUrl && (
                <TextField
                  placeholder={'Symbols from image'}
                  margin='normal'
                  {...formik.getFieldProps('captcha')}
                />
              )}
              <Button
                type={'submit'}
                variant={'contained'}
                color={'primary'}
              >
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  )
}
