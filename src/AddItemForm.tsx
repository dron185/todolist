import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {Button} from "./Button";

type PropsType = {
    addItem: (title: string) => void
}

export const AddItemForm = ({addItem}: PropsType) => {
    const [newItemTitle, setNewItemTitle] = React.useState("")
    const [inputError, setInputError] = useState<boolean>(false)

    const maxTitleLength = 15
    const isAddItemPossible = newItemTitle.length && newItemTitle.length <= maxTitleLength

    const addNewItemHandler = () => {
        const trimmedTaskTitle = newItemTitle.trim()
        if (trimmedTaskTitle) {
            addItem(trimmedTaskTitle)
        } else {
            setInputError(true)
            setTimeout(()=>setInputError(false), 3000)
        }
        setNewItemTitle("")
    }

    const changeNewItemTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        inputError &&  setInputError(false)
        setNewItemTitle(e.currentTarget.value)
    }

    const addItemOnKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && e.ctrlKey && isAddItemPossible) {
            addNewItemHandler()
        }
    }

    return (
        <div>
            <input
                className={inputError ? "input-error" : ""}
                value={newItemTitle}
                onChange={changeNewItemTitleHandler}
                onKeyDown={addItemOnKeyDownHandler}
            />
            <Button
                title={"+"}
                onClickHandler={addNewItemHandler}
                isDisabled={!isAddItemPossible}
            />
            {!newItemTitle.length && <div style={{color: inputError ? "red" : "black"}}>Please, enter title</div>}
            {newItemTitle.length > maxTitleLength && <div>Task title is too long</div>}
        </div>
    );
};

export default AddItemForm;