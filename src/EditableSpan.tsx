import React, {useState} from 'react';

type PropsType = {
    value: string
    spanClass?: string
}

export const EditableSpan = ({value, spanClass}: PropsType) => {
    const [editMode, setEditMode] = useState(false)

    const activateEditModeHandler = () => {
        setEditMode(true)
    }

    return (
        <>
            {editMode ? <input value={value} autoFocus/> : <span className={spanClass} onDoubleClick={activateEditModeHandler}>{value}</span>}
        </>
    )
};