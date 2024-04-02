import React, {ChangeEvent, useState} from 'react';

type PropsType = {
    value: string
    spanClass?: string
}

export const EditableSpan = ({value, spanClass}: PropsType) => {
    const [editMode, setEditMode] = useState(false)
    const [title, setTitle] = useState(value)

    const activateEditModeHandler = () => {
        setEditMode(true)
    }
    const deactivateEditModeHandler = () => {
        setEditMode(false)
    }
    const changeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return (
        <>
            {editMode ?
                <input value={title} autoFocus onBlur={deactivateEditModeHandler} onChange={changeTitleHandler}/> :
                <span className={spanClass} onDoubleClick={activateEditModeHandler}>{value}</span>}
        </>
    )
};