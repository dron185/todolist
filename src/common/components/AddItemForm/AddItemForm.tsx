import React, { ChangeEvent, KeyboardEvent, memo, useState } from 'react'
import TextField from '@mui/material/TextField/TextField'
import IconButton from '@mui/material/IconButton'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { unwrapResult } from '@reduxjs/toolkit'
import { BaseResponse } from 'common/types'

type Props = {
  addItem: (title: string) => Promise<any>
  disabled?: boolean
}

export const AddItemForm = memo(({ addItem, disabled = false }: Props) => {
  const [newItemTitle, setNewItemTitle] = React.useState('')
  const [inputError, setInputError] = useState<string | null>(null)

  const maxTitleLength = 15
  const isAddItemPossible = newItemTitle.length && newItemTitle.length <= maxTitleLength

  const addNewItemHandler = () => {
    const trimmedTaskTitle = newItemTitle.trim()
    if (trimmedTaskTitle !== '') {
      addItem(trimmedTaskTitle)
        .then(unwrapResult)
        .then(() => {
          setNewItemTitle('')
        })
        .catch((err: BaseResponse) => {
          setInputError(err.messages[0])
        })
    } else {
      setInputError('Title is required')
    }
  }

  const changeNewItemTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewItemTitle(e.currentTarget.value)
  }

  const addItemOnKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (inputError !== null) {
      setInputError(null)
    }

    if (e.key === 'Enter' && isAddItemPossible) {
      addNewItemHandler()
    }
  }

  return (
    <div>
      <TextField
        label='Enter a title'
        variant={'outlined'}
        className={inputError ? 'error' : ''}
        value={newItemTitle}
        size={'small'}
        error={!!inputError}
        helperText={inputError}
        onChange={changeNewItemTitleHandler}
        onKeyUp={addItemOnKeyDownHandler}
        disabled={disabled}
      />

      <IconButton
        onClick={addNewItemHandler}
        color={'primary'}
        disabled={disabled}
      >
        <AddBoxIcon />
      </IconButton>

      {/*{!newItemTitle.length && <div style={{color: inputError ? "red" : "black"}}>Please, enter title</div>}*/}
      {/*{newItemTitle.length > maxTitleLength && <div>Task title is too long</div>}*/}
    </div>
  )
})
