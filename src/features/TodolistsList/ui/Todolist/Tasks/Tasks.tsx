import List from '@mui/material/List'
import { Task } from 'features/TodolistsList/ui/Todolist/Task/Task'
import { TodolistDomainType } from 'features/TodolistsList/model/todolistsSlice'
import { TaskStatuses } from 'features/TodolistsList/lib'
import { TaskDomainType } from 'features/TodolistsList/model/tasksSlice'

type Props = {
  todolist: TodolistDomainType
  tasks: Array<TaskDomainType>
}

export const Tasks = ({ todolist, tasks }: Props) => {
  const { id, filter } = todolist

  let tasksForTodoList = tasks

  if (filter === 'completed') {
    tasksForTodoList = tasks.filter((t) => t.status === TaskStatuses.Completed)
  }
  if (filter === 'active') {
    tasksForTodoList = tasks.filter((t) => t.status === TaskStatuses.New)
  }
  return (
    <>
      {tasks.length === 0 ? (
        <p>There are no tasks</p>
      ) : (
        <List>
          {tasksForTodoList.map((t) => {
            return (
              <Task
                key={t.id}
                task={t}
                todolistId={id}
              />
            )
          })}
        </List>
      )}
    </>
  )
}
