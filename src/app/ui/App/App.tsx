import React, { useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'app/model/store'
import { selectIsInitialized } from 'app/model/appSlice'
import CircularProgress from '@mui/material/CircularProgress'
import { authThunks } from 'features/auth/model/authSlice'
import { ErrorSnackbar } from 'common/components'
import { Routing } from 'app/ui/App/Routing/Routing'
import { Header } from 'app/ui/App/Header/Header'

// demo-это только для AppWithRedux.stories (если demo=true, то мы наш тестовый стейт загружаем из ReduxStoreProviderDecorator а не с сервака)
type Props = {
  demo?: boolean
}

export type ThemeMode = 'dark' | 'light'

export function App({ demo = false }: Props) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light')
  const theme = createTheme({
    palette: {
      mode: themeMode === 'light' ? 'light' : 'dark',
      primary: {
        main: '#087EA4',
      },
    },
  })

  const isInitialized = useSelector(selectIsInitialized)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!demo) {
      dispatch(authThunks.initializeApp())
    }
  }, [])

  if (!isInitialized) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '30%',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <CircularProgress color='secondary' />
      </div>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <ErrorSnackbar />
      <CssBaseline />
      <Header
        themeMode={themeMode}
        setThemeMode={setThemeMode}
      />
      <Routing />
    </ThemeProvider>
  )
}
