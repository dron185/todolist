import React, { useCallback, useEffect, useState } from 'react'
import './App.css'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import { MenuButton } from 'MenuButton'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import CssBaseline from '@mui/material/CssBaseline'
import LinearProgress from '@mui/material/LinearProgress'
import { useSelector } from 'react-redux'
import { useAppDispatch } from './store'
import { selectAppStatus, selectIsInitialized } from 'app/appSlice'
import { Outlet } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import { authThunks, selectIsLoggedIn } from 'features/Login/model/authSlice'
import { ErrorSnackbar } from 'common/components'

// demo-это только для AppWithRedux.stories (если demo=true, то мы наш тестовый стейт загружаем из ReduxStoreProviderDecorator а не с сервака)
type Props = {
  demo?: boolean
}

type ThemeMode = 'dark' | 'light'

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

  const status = useSelector(selectAppStatus)
  const isInitialized = useSelector(selectIsInitialized)
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const dispatch = useAppDispatch()

  const changeModeHandler = () => {
    setThemeMode(themeMode == 'light' ? 'dark' : 'light')
  }

  useEffect(() => {
    if (!demo) {
      dispatch(authThunks.initializeApp())
    }
  }, [])

  const logoutHandler = useCallback(() => {
    dispatch(authThunks.logout())
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
      <AppBar
        position='static'
        sx={{ mb: '30px' }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton color='inherit'>
            <MenuIcon />
          </IconButton>
          <div>
            {isLoggedIn && <MenuButton onClick={logoutHandler}>Log out</MenuButton>}
            <MenuButton background={theme.palette.primary.dark}>Faq</MenuButton>
            <Switch
              color={'default'}
              onChange={changeModeHandler}
            />
          </div>
        </Toolbar>
        {status === 'loading' && <LinearProgress color='secondary' />}
      </AppBar>

      <Container fixed>
        <Outlet />
        {/*<TodolistsList demo={demo}/>*/}
      </Container>
    </ThemeProvider>
  )
}
