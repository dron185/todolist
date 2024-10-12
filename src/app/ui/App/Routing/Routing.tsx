import { Outlet } from 'react-router-dom'
import Container from '@mui/material/Container'
import React from 'react'

export const Routing = () => {
  return (
    <Container fixed>
      <Outlet />
    </Container>
  )
}
