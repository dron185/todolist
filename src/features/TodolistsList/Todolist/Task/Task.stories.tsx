import type { Meta, StoryObj } from '@storybook/react'
import { Task } from './Task'
import { fn } from '@storybook/test'
import { useState } from 'react'
import { v1 } from 'uuid'
import { TaskPriorities, TaskStatuses } from 'api/api'
import { RequestStatusType } from 'app/app-reducer'
import { TaskDomainType } from '../../tasks-reducer'

const meta: Meta<typeof Task> = {
  title: 'TODOLISTS/Task',
  component: Task,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    task: {
      id: 'dfdf',
      title: 'JS',
      status: TaskStatuses.New,
      todoListId: 'todolistId1',
      description: '',
      startDate: '',
      deadline: '',
      addedDate: '',
      order: 0,
      priority: TaskPriorities.Low,
      entityStatus: 'idle' as RequestStatusType,
    },
    todolistId: 'dfdsaaa',
    removeTask: fn(),
    changeTaskStatus: fn(),
    updateTaskTitle: fn(),
  },
}

export default meta
type Story = StoryObj<typeof Task>

export const TaskIsNotDoneStory: Story = {}

export const TaskIsDoneStory: Story = {
  args: {
    task: {
      id: 'dfdffghgh',
      title: 'CSS',
      status: TaskStatuses.Completed,
      todoListId: 'todolistId1',
      description: '',
      startDate: '',
      deadline: '',
      addedDate: '',
      order: 0,
      priority: TaskPriorities.Low,
      entityStatus: 'idle',
    },
  },
}

export const TaskToggleStory: Story = {
  render: (args) => {
    const [task, setTask] = useState<TaskDomainType>({
      id: v1(),
      title: 'JS',
      status: TaskStatuses.Completed,
      todoListId: 'todolistId1',
      description: '',
      startDate: '',
      deadline: '',
      addedDate: '',
      order: 0,
      priority: TaskPriorities.Low,
      entityStatus: 'idle',
    })

    function changeTaskStatus() {
      setTask({
        ...task,
        status: task.status === TaskStatuses.Completed ? TaskStatuses.New : TaskStatuses.Completed,
      })
    }

    function updateTaskTitle(todolistId: string, taskId: string, title: string) {
      setTask({ ...task, title: title })
    }

    return (
      <Task
        task={task}
        todolistId={'dfdsaaa'}
        removeTask={args.removeTask}
        changeTaskStatus={changeTaskStatus}
        updateTaskTitle={updateTaskTitle}
      />
    )
  },
}
