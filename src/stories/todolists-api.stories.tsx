import React, { useEffect, useState } from 'react'
import { todolistsApi } from 'features/todolistsList/api/todolistsApi'
import { tasksApi } from 'features/todolistsList/api/tasksApi'

export default {
  title: 'API',
}

export const GetTodolists = () => {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    // здесь мы будем делать запрос и ответ закидывать в стейт.
    // который в виде строки будем отображать в div-ке
    todolistsApi.getTodolists().then((res) => {
      setState(res.data)
    })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const title: string = 'CSS'

    todolistsApi.createTodolist(title).then((res) => {
      setState(res.data)
    })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = '0bd27111-3cd1-497f-8380-95b439432597'
    todolistsApi.deleteTodolist(todolistId).then((res) => {
      setState(res.data)
    })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = 'ef4970d5-e271-4533-8d7a-a760ad07ca36'
    const title = 'StoryBook'
    todolistsApi.updateTodolist({ todolistId, title }).then((res) => {
      setState(res.data)
    })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

//tasks
export const GetTasks = () => {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    const todolistId = '7c61320f-410a-4016-90ec-197c3956e41c'
    tasksApi.getTasks(todolistId).then((res) => {
      setState(res.data)
    })
  }, [])
  return <div>{JSON.stringify(state)}</div>
}
