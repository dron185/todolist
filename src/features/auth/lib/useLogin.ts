import { useAppDispatch } from 'app/model/store'
import { useFormik } from 'formik'
import { authThunks } from 'features/auth/model/authSlice'
import { BaseResponse } from 'common/types'
import { LoginParams } from 'features/auth/api/authApi.types'

type FormikError = Omit<Partial<LoginParams>, 'captcha'>

export const useLogin = () => {
  const dispatch = useAppDispatch()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
      captcha: null,
    },
    validate: (values) => {
      const errors: FormikError = {}
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
      console.log(values.captcha)
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

  return { formik }
}
