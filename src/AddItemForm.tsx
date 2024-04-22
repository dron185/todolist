import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
// import {Button} from "./Button";
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField/TextField';


type PropsType = {
    addItem: (title: string) => void
}

export const AddItemForm = ({addItem}: PropsType) => {
    const [newItemTitle, setNewItemTitle] = React.useState("")
    const [inputError, setInputError] = useState<string | null>(null)

    const maxTitleLength = 15
    const isAddItemPossible = newItemTitle.length && newItemTitle.length <= maxTitleLength

    const addNewItemHandler = () => {
        const trimmedTaskTitle = newItemTitle.trim()
        if (trimmedTaskTitle !== '') {
            addItem(trimmedTaskTitle)
        } else {
            setInputError('Title is required')
        }
        setNewItemTitle("")
    }

    const changeNewItemTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewItemTitle(e.currentTarget.value)
    }

    const addItemOnKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setInputError(null)
        if (e.key === 'Enter' && isAddItemPossible) {
            addNewItemHandler()
        }
    }

    return (
        <div>
            <TextField
                label="Enter a title"
                variant={'outlined'}
                className={inputError ? 'error' : ''}
                value={newItemTitle}
                size={'small'}
                error={!!inputError}
                helperText={inputError}
                onChange={changeNewItemTitleHandler}
                onKeyUp={addItemOnKeyDownHandler}
            />

            {/*<input*/}
            {/*    className={inputError ? "input-error" : ""}*/}
            {/*    value={newItemTitle}*/}
            {/*    onChange={changeNewItemTitleHandler}*/}
            {/*    onKeyDown={addItemOnKeyDownHandler}*/}
            {/*/>*/}

            {/*<Button*/}
            {/*    title={"+"}*/}
            {/*    onClickHandler={addNewItemHandler}*/}
            {/*    isDisabled={!isAddItemPossible}*/}
            {/*/>*/}

            <Button variant="contained" onClick={addNewItemHandler}>+</Button>

            {/*{!newItemTitle.length && <div style={{color: inputError ? "red" : "black"}}>Please, enter title</div>}*/}
            {/*{newItemTitle.length > maxTitleLength && <div>Task title is too long</div>}*/}
        </div>
    );
};

export default AddItemForm;