import React from 'react'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import { filterButtonsContainerSx } from 'features/TodolistsList/ui/Todolist/Todolist.styles'
import { TodolistDomainType, todolistsThunks } from 'features/TodolistsList/model/todolistsSlice'
import { TaskDomainType, tasksThunks } from 'features/TodolistsList/model/tasksSlice'
import { AddItemForm, EditableSpan } from 'common/components'
import { useAppDispatch } from 'app/store'
import { FilterTasksButtons } from 'features/TodolistsList/ui/Todolist/FilterTasksButtons/FilterTasksButtons'
import { Tasks } from 'features/TodolistsList/ui/Todolist/Tasks/Tasks'

type TodolistPropsType = {
  todolist: TodolistDomainType
  tasks: Array<TaskDomainType>
  demo?: boolean
}

export const Todolist = ({ todolist, tasks, demo = false }: TodolistPropsType) => {
  const dispatch = useAppDispatch()

  // const tasksList: JSX.Element =
  //   tasks.length === 0 ? (
  //     <p>There are no tasks</p>
  //   ) : (
  //     <List>
  //       {tasksForTodoList.map((t) => {
  //         return (
  //           <Task
  //             key={t.id}
  //             task={t}
  //             todolistId={todolist.id}
  //           />
  //         )
  //       })}
  //     </List>
  //   )

  const removeTodolistHandler = () => {
    dispatch(todolistsThunks.removeTodolist(todolist.id))
  }

  const addTaskHandler = (taskTitle: string) => {
    dispatch(tasksThunks.addTask({ todolistId: todolist.id, taskTitle }))
  }

  const updateTodolistTitleHandler = (title: string) => {
    dispatch(todolistsThunks.changeTodolistTitle({ todolistId: todolist.id, title }))
  }

  return (
    <div className={'todolist'}>
      {/*TodolistTitle*/}
      <div className={'todolist-title-container'}>
        <EditableSpan
          oldTitle={todolist.title}
          updateTitle={updateTodolistTitleHandler}
          disabled={todolist.entityStatus === 'loading'}
          entityStatus={todolist.entityStatus}
        />
        <IconButton
          onClick={removeTodolistHandler}
          disabled={todolist.entityStatus === 'loading'}
        >
          <DeleteIcon />
        </IconButton>
      </div>

      <AddItemForm
        addItem={addTaskHandler}
        disabled={todolist.entityStatus === 'loading'}
      />

      {/*Tasks*/}
      <Tasks
        todolist={todolist}
        tasks={tasks}
      />

      {/*FilterTasksButtons*/}
      <Box sx={filterButtonsContainerSx}>
        <FilterTasksButtons todolist={todolist} />
      </Box>
    </div>
  )
}
