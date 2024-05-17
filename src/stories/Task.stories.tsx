import type {Meta, StoryObj} from '@storybook/react';
import {Task} from "../Task";
import {fn} from "@storybook/test";
import {useState} from "react";
import {v1} from "uuid";

const meta: Meta<typeof Task> = {
    title: 'TODOLISTS/Task',
    component: Task,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        task: {id: 'dfdf', isDone: false, title: 'JS'},
        todolistId: 'dfdsaaa',
        removeTask: fn(),
        changeTaskStatus: fn(),
        updateTaskTitle: fn()
    },
};

export default meta;
type Story = StoryObj<typeof Task>;

export const TaskIsNotDoneStory: Story = {}

export const TaskIsDoneStory: Story = {
    args: {
        task: {id: 'dfdffghgh', isDone: true, title: 'CSS'},
    }
}

export const TaskToggleStory: Story = {
    render: (args) => {
        const [task, setTask] = useState({id: v1(), isDone: false, title: 'JS'})

        function changeTaskStatus () {
            setTask({...task, isDone: !task.isDone})
        }

         function updateTaskTitle (todolistId: string, taskId: string, title: string) {
            setTask({...task, title: title})
        }

        return <Task
            task={task}
            todolistId={'dfdsaaa'}
            removeTask={args.removeTask}
            changeTaskStatus={changeTaskStatus}
            updateTaskTitle={updateTaskTitle}
        />
    }
}