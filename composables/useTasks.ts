// composables/useTasks.ts
import { useCookie, useRuntimeConfig, useFetch } from '#app'
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

// Definimos la cookie tipada para el usuario
const userCookie = useCookie<Login | null>('user')

export const useTasks = () => {
  const baseURL = useRuntimeConfig().public.baseURL || useCookie('BASE_URL').value

  // Obtiene todas las tareas del usuario
  const getTasks = async (): Promise<Task[]> => {
    if (!userCookie.value) throw new Error("Usuario no autenticado")
    const { data, error } = await useFetch<{ success: boolean; data: Task[] }>(`${baseURL}/tasks`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      }
    })
    if (error.value) throw new Error(error.value.message)
    return data.value?.data || []
  }

  // Crea una nueva tarea
  const createTask = async (task: { title: string; description?: string; dueDate?: string; completed?: boolean }): Promise<Task> => {
    if (!userCookie.value) throw new Error("Usuario no autenticado")
    const { data, error } = await useFetch<{ success: boolean; msg: string; data: Task }>(`${baseURL}/tasks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      },
      // Se añade el userId obtenido de la cookie, y se envía completed si se incluye
      body: { ...task, userId: userCookie.value.id }
    })
    if (error.value) throw new Error(error.value.message)
    if (!data.value?.data) throw new Error("Error al crear la tarea")
    return data.value.data
  }

  // Actualiza una tarea existente
  const updateTask = async (task: { id: number; title?: string; description?: string; dueDate?: string; completed?: boolean }): Promise<Task> => {
    if (!userCookie.value) throw new Error("Usuario no autenticado")
    const { data, error } = await useFetch<{ success: boolean; msg: string; data: Task }>(`${baseURL}/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      },
      // Se añade el userId para asegurar la actualización de la tarea asociada
      body: { ...task, userId: userCookie.value.id }
    })
    if (error.value) throw new Error(error.value.message)
    if (!data.value?.data) throw new Error("Error al actualizar la tarea")
    return data.value.data
  }

  // Elimina una tarea
  const deleteTask = async (id: number): Promise<Task> => {
    if (!userCookie.value) throw new Error("Usuario no autenticado")
    const { data, error } = await useFetch<{ success: boolean; msg: string; data: Task }>(`${baseURL}/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      }
    })
    if (error.value) throw new Error(error.value.message)
    if (!data.value?.data) throw new Error("Error al eliminar la tarea")
    return data.value.data
  }

  return { getTasks, createTask, updateTask, deleteTask }
}
