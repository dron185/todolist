import type { Meta, StoryObj } from '@storybook/react'
import { Task } from 'features/todolistsList/ui/Todolist/Tasks/Task/Task'
import { fn } from '@storybook/test'
import { useState } from 'react'
import { v1 } from 'uuid'
import { RequestStatus } from 'app/model/appSlice'
import { TaskDomain } from 'features/todolistsList/model/tasksSlice'
import { TaskPriorities, TaskStatuses } from 'features/todolistsList/lib'

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
      entityStatus: 'idle' as RequestStatus,
    },
    todolistId: 'dfdsaaa',
    // removeTask: fn(),
    // changeTaskStatus: fn(),
    // updateTaskTitle: fn(),
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
    const [task, setTask] = useState<TaskDomain>({
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
        // removeTask={args.removeTask}
        // changeTaskStatus={changeTaskStatus}
        // updateTaskTitle={updateTaskTitle}
      />
    )
  },
}
