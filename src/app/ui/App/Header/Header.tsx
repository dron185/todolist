import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { MenuButton } from 'MenuButton'
import Switch from '@mui/material/Switch'
import LinearProgress from '@mui/material/LinearProgress'
import AppBar from '@mui/material/AppBar'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { selectAppStatus } from 'app/model/appSlice'
import { authThunks, selectIsLoggedIn } from 'features/auth/model/authSlice'
import { ThemeMode } from 'app/ui/App/App'
import { useAppDispatch } from 'app/model/store'

type Props = {
  themeMode: ThemeMode
  setThemeMode: (value: ThemeMode) => void
}

export const Header = ({ themeMode, setThemeMode }: Props) => {
  const status = useSelector(selectAppStatus)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()

  const changeModeHandler = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light')
  }

  const logoutHandler = useCallback(() => {
    dispatch(authThunks.logout())
  }, [])

  return (
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
          <Switch
            color={'default'}
            onChange={changeModeHandler}
          />
        </div>
      </Toolbar>
      {status === 'loading' && <LinearProgress color='secondary' />}
    </AppBar>
  )
}
