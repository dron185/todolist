import React from 'react'
import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useFormik } from 'formik'
import { useAppDispatch } from 'app/store'
import { authThunks, selectIsLoggedIn } from 'features/Login/model/authSlice'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { BaseResponse } from 'common/types'

type FormikErrorType = {
  email?: string
  password?: string
  rememberMe?: boolean
}

export const Login = () => {
  const dispatch = useAppDispatch()
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: (values) => {
      const errors: FormikErrorType = {}
      if (!values.email) {
        errors.email = 'Required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
      }

      if (!values.password) {
        errors.password = 'Required'
      } else if (values.password.length < 6) {
        errors.password = 'Must be 6 characters or more'
      }

      return errors
    },
    onSubmit: (values, formikHelpers) => {
      //alert(JSON.stringify(values, null, 2))
      dispatch(authThunks.login(values))
        .unwrap()
        .then((res) => {})
        .catch((err: BaseResponse) => {
          err.fieldsErrors?.forEach((fieldError) => {
            formikHelpers.setFieldError(fieldError.field, fieldError.error)
          })
        })
      formik.resetForm()
    },
  })

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
                //type='email'
                {...formik.getFieldProps('email')}
                // name="email"
                // onChange={formik.handleChange}
                // value={formik.values.email}
                // onBlur={formik.handleBlur}
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
                    // onChange={formik.handleChange}
                    // name="rememberMe"
                  />
                }
              />
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
