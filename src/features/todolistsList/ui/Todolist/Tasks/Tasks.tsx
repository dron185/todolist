import List from '@mui/material/List'
import { Task } from 'features/todolistsList/ui/Todolist/Tasks/Task/Task'
import { TodolistDomainType } from 'features/todolistsList/model/todolistsSlice'
import { selectFilteredTasks, TaskDomainType } from 'features/todolistsList/model/tasksSlice'
import { useSelector } from 'react-redux'
import { AppRootStateType } from 'app/store'

type Props = {
  todolist: TodolistDomainType
}

export const Tasks = ({ todolist }: Props) => {
  const tasksForTodoList = useSelector<AppRootStateType, TaskDomainType[]>((state) =>
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
