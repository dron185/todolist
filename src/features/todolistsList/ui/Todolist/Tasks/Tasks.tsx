import List from '@mui/material/List'
import { Task } from 'features/todolistsList/ui/Todolist/Tasks/Task/Task'
import { TodolistDomain } from 'features/todolistsList/model/todolistsSlice'
import { selectFilteredTasks, TaskDomain } from 'features/todolistsList/model/tasksSlice'
import { useSelector } from 'react-redux'
import { AppRootState } from 'app/model/store'

type Props = {
  todolist: TodolistDomain
}

export const Tasks = ({ todolist }: Props) => {
  const tasksForTodoList = useSelector<AppRootState, TaskDomain[]>((state) =>
    selectFilteredTasks(state, todolist.id, todolist.filter)
  )

  return (
    <>
      {tasksForTodoList.length === 0 ? (
        <p>There are no tasks</p>
      ) : (
        <List>
          {tasksForTodoList.map((t) => {
            return (
              <Task
                key={t.id}
                task={t}
                todolistId={todolist.id}
              />
            )
          })}
        </List>
      )}
    </>
  )
}
