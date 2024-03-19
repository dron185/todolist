import React from 'react';

type ButtonPropsType = {
    title: string
    onClickHandler?: ()=> void
    isDisabled?: boolean
    classes?: string
}

export const Button = ({title, onClickHandler, isDisabled, classes}: ButtonPropsType) => {
    return (
        <button className={classes} disabled={isDisabled} onClick={onClickHandler}>{title}</button>
    );
};