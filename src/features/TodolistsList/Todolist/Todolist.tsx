import React, { memo, useCallback, useMemo } from 'react'
import AddItemForm from 'components/AddItemForm/AddItemForm'
import { EditableSpan } from 'components/EditableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import Box from '@mui/material/Box'
import { filterButtonsContainerSx } from './Todolist.styles'
import { ButtonProps } from '@mui/material/Button/Button'
import { Task } from './Task/Task'
import { FilterValuesType, TodolistDomainType } from '../todolists-reducer'
import { TaskStatuses } from 'api/api'
import { useAppDispatch } from 'app/store'
import { TaskDomainType } from '../tasks-reducer'

type TodolistPropsType = {
  todolist: TodolistDomainType
  tasks: Array<TaskDomainType>
  addTask: (todolistId: string, title: string) => void
  removeTask: (todolistId: string, taskId: string) => void
  changeTaskStatus: (todolistId: string, taskId: string, status: TaskStatuses) => void
  changeFilter: (todolistId: string, value: FilterValuesType) => void
  removeTodolist: (todolistId: string) => void
  updateTaskTitle: (todolistId: string, taskId: string, newTitle: string) => void
  updateTodolistTitle: (todolistId: string, newTitle: string) => void
  demo?: boolean
}

export const Todolist = memo(
  ({
    todolist,
    removeTodolist,
    tasks,
    addTask,
    removeTask,
    changeTaskStatus,
    changeFilter,
    updateTaskTitle,
    updateTodolistTitle,
    demo = false,
  }: TodolistPropsType) => {
    //деструктурирующее присваивание: const { title, tasks, removeTask, changeFilter, addTask } = props

    //const dispatch = useAppDispatch()
    // useEffect(() => {
    //     if (demo) {
    //         return;
    //     }
    //     dispatch(fetchTasksTC(todolist.id))
    // }, []);

    let tasksForTodoList = tasks

    tasksForTodoList = useMemo(() => {
      if (todolist.filter === 'completed') {
        tasksForTodoList = tasks.filter((t) => t.status === TaskStatuses.Completed)
      }
      if (todolist.filter === 'active') {
        tasksForTodoList = tasks.filter((t) => t.status === TaskStatuses.New)
      }
      return tasksForTodoList
    }, [tasks, todolist.filter])

    const tasksList: JSX.Element =
      tasks.length === 0 ? (
        <p>There are no tasks</p>
      ) : (
        <List>
          {tasksForTodoList.map((t) => {
            return (
              <Task
                key={t.id}
                task={t}
                todolistId={todolist.id}
                removeTask={removeTask}
                changeTaskStatus={changeTaskStatus}
                updateTaskTitle={updateTaskTitle}
              />
            )
          })}
        </List>
      )

    const OnAllClickHandler = useCallback(() => changeFilter(todolist.id, 'all'), [changeFilter, todolist.id])
    const OnActiveClickHandler = useCallback(() => changeFilter(todolist.id, 'active'), [changeFilter, todolist.id])
    const OnCompletedClickHandler = useCallback(
      () => changeFilter(todolist.id, 'completed'),
      [changeFilter, todolist.id]
    )

    const removeTodolistHandler = () => {
      removeTodolist(todolist.id)
    }

    const addTaskHandler = useCallback(
      (title: string) => {
        addTask(todolist.id, title)
      },
      [addTask, todolist.id]
    )

    const updateTodolistTitleHandler = useCallback(
      (newTitle: string) => {
        updateTodolistTitle(todolist.id, newTitle)
      },
      [updateTodolistTitle, todolist.id]
    )

    return (
      <div className={'todolist'}>
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
        {tasksList}
        <Box sx={filterButtonsContainerSx}>
          <MyButton
            variant={todolist.filter === 'all' ? 'outlined' : 'contained'}
            color={'info'}
            onClick={OnAllClickHandler}
            title={'All'}
          />
          <MyButton
            variant={todolist.filter === 'active' ? 'outlined' : 'contained'}
            color={'secondary'}
            onClick={OnActiveClickHandler}
            title={'Active'}
          />
          <MyButton
            variant={todolist.filter === 'completed' ? 'outlined' : 'contained'}
            color={'success'}
            onClick={OnCompletedClickHandler}
            title={'Completed'}
          />
        </Box>
      </div>
    )
  }
)

type MyButtonPropsType = {} & ButtonProps

const MyButton = memo(({ variant, color, onClick, title, ...rest }: MyButtonPropsType) => {
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      {...rest}
    >
      {title}
    </Button>
  )
})
