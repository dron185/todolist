import TextField from '@mui/material/TextField'
import React, { ChangeEvent, useState } from 'react'
import { RequestStatus } from 'app/model/appSlice'

type Props = {
  oldTitle: string
  spanClass?: string
  updateTitle: (newTitle: string) => void
  disabled?: boolean
  entityStatus: RequestStatus
}

export const EditableSpan = React.memo(
  ({ oldTitle, spanClass, updateTitle, disabled = false, entityStatus }: Props) => {
    const [edit, setEdit] = useState(false)
    const [newTitle, setNewTitle] = useState(oldTitle)

    const editModeHandler = () => {
      entityStatus !== 'loading' && setEdit(!edit)
      if (edit) {
        updateTitleHandler()
      }
    }

    const changeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
      setNewTitle(e.currentTarget.value)
    }

    const updateTitleHandler = () => {
      updateTitle(newTitle.trim())
    }

    return (
      <>
        {edit ? (
          <TextField
            variant={'outlined'}
            value={newTitle}
            size={'small'}
            onChange={changeTitleHandler}
            onBlur={editModeHandler}
            autoFocus
            disabled={disabled}
          />
        ) : (
          <span
            className={spanClass}
            onDoubleClick={editModeHandler}
          >
            {oldTitle}
          </span>
        )}
      </>
    )
  }
)
