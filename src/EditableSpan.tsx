import React, {ChangeEvent, useState} from 'react';

type PropsType = {
    oldTitle: string
    spanClass?: string
    updateTitle: (newTitle: string) => void
}

export const EditableSpan = ({oldTitle, spanClass, updateTitle}: PropsType) => {
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
        edit ?
            <input value={newTitle} autoFocus onBlur={editModeHandler} onChange={changeTitleHandler}/> :
            <span className={spanClass} onDoubleClick={editModeHandler}>{oldTitle}</span>
    );
};