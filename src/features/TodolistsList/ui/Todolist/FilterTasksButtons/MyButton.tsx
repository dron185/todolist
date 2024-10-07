import { ButtonProps } from '@mui/material/Button/Button'
import React, { memo } from 'react'
import Button from '@mui/material/Button'

type Props = {} & ButtonProps

export const MyButton = memo(({ variant, color, onClick, title, ...rest }: Props) => {
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      {...rest}
    >
      {title}
    </Button>
  )
})
