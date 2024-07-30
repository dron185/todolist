import TextField from '@mui/material/TextField';
import React, {ChangeEvent, useState} from 'react';

type PropsType = {
    oldTitle: string
    spanClass?: string
    updateTitle: (newTitle: string) => void
    disabled?: boolean
}

export const EditableSpan = React.memo( ({oldTitle, spanClass, updateTitle, disabled = false}: PropsType) => {
    const [edit, setEdit] = useState(false)
    const [newTitle, setNewTitle] = useState(oldTitle)

    const editModeHandler = () => {
        setEdit(!edit)
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
            {
                edit ?
                    (
                        <TextField
                            variant={'outlined'}
                            value={newTitle}
                            size={'small'}
                            onChange={changeTitleHandler}
                            onBlur={editModeHandler}
                            autoFocus
                            disabled={disabled}
                        />
                    ) :
                    ( <span className={spanClass} onDoubleClick={editModeHandler}>{oldTitle}</span>)
            }
        </>

    );
} );