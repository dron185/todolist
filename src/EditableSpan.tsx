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
    const deactivateEditModeHandler = () => {
        setEditMode(false)
    }

    return (
        <>
            {editMode ?
                <input value={value} autoFocus onBlur={deactivateEditModeHandler}/> :
                <span className={spanClass} onDoubleClick={activateEditModeHandler}>{value}</span>}
        </>
    )
};