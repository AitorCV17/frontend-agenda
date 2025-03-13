// composables/useTasks.ts
import { useCookie, useRuntimeConfig, useFetch, useState } from '#app'
import type { Login } from '~/interfaces/Login.Interface'

export interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export const useTasks = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.baseURL || useCookie('BASE_URL').value
  const userCookie = useCookie<Login | null>('user')

  // 🔥 Guardamos las tareas en memoria para que no desaparezcan 🔥
  const tasks = useState<Task[]>('tasks', () => [])

  const getTasks = async (): Promise<Task[]> => {
    if (!userCookie.value) throw new Error("Usuario no autenticado")
    const { data, error } = await useFetch<{ success: boolean; data: Task[] }>(`${baseURL}/tasks`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      },
      server: false
    })
    if (error.value) throw new Error(error.value.message)

    tasks.value = data.value?.data || []  // 🔥 Guardamos las tareas en memoria
    return tasks.value
  }

  const createTask = async (task: { title: string; description?: string; dueDate?: string; completed?: boolean }): Promise<Task> => {
    if (!userCookie.value) throw new Error("Usuario no autenticado")
    const { data, error } = await useFetch<{ success: boolean; msg: string; data: Task }>(`${baseURL}/tasks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      },
      body: { ...task, userId: userCookie.value.id },
      server: false
    })
    if (error.value) throw new Error(error.value.message)
    if (!data.value?.data) throw new Error("Error al crear la tarea")

    tasks.value.push(data.value.data)  // 🔥 Agregamos la nueva tarea a la lista en memoria
    return data.value.data
  }

  const updateTask = async (task: { id: number; title?: string; description?: string; dueDate?: string; completed?: boolean }): Promise<Task> => {
    if (!userCookie.value) throw new Error("Usuario no autenticado")
    const { data, error } = await useFetch<{ success: boolean; msg: string; data: Task }>(`${baseURL}/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      },
      body: { ...task, userId: userCookie.value.id },
      server: false
    })
    if (error.value) throw new Error(error.value.message)
    if (!data.value?.data) throw new Error("Error al actualizar la tarea")

    // 🔥 Reemplazamos la tarea en la lista en memoria
    const index = tasks.value.findIndex(t => t.id === task.id)
    if (index !== -1) tasks.value[index] = data.value.data

    return data.value.data
  }

  const deleteTask = async (id: number): Promise<Task> => {
    if (!userCookie.value) throw new Error("Usuario no autenticado")
    const { data, error } = await useFetch<{ success: boolean; msg: string; data: Task }>(`${baseURL}/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      },
      server: false
    })
    if (error.value) throw new Error(error.value.message)
    if (!data.value?.data) throw new Error("Error al eliminar la tarea")

    // 🔥 Eliminamos la tarea de la lista en memoria
    tasks.value = tasks.value.filter(t => t.id !== id)

    return data.value.data
  }

  return { getTasks, createTask, updateTask, deleteTask, tasks }
}
