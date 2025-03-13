// composables/useEvents.ts
import { useCookie, useRuntimeConfig, useFetch } from '#app'
import type { Login } from '~/interfaces/Login.Interface'

export interface Event {
  id: number
  title: string
  description?: string
  startTime: string
  endTime: string
  location?: string
  createdAt: string
  updatedAt: string
}

export const useEvents = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.baseURL || useCookie('BASE_URL').value
  const userCookie = useCookie<Login | null>('user')

  const getEvents = async (): Promise<Event[]> => {
    if (!userCookie.value) throw new Error("Usuario no autenticado")
    const { data, error } = await useFetch<{ success: boolean; data: Event[] }>(`${baseURL}/events`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      }
    })
    if (error.value) throw new Error(error.value.message)
    return data.value?.data || []
  }

  const createEvent = async (event: { title: string; description?: string; startTime: string; endTime: string; location?: string }): Promise<Event> => {
    if (!userCookie.value) throw new Error("Usuario no autenticado")
    const { data, error } = await useFetch<{ success: boolean; msg: string; data: Event }>(`${baseURL}/events`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      },
      body: { ...event, userId: userCookie.value.id }
    })
    if (error.value) throw new Error(error.value.message)
    if (!data.value?.data) throw new Error("Error al crear el evento")
    return data.value.data
  }

  const updateEvent = async (event: { id: number; title?: string; description?: string; startTime?: string; endTime?: string; location?: string }): Promise<Event> => {
    if (!userCookie.value) throw new Error("Usuario no autenticado")
    const { data, error } = await useFetch<{ success: boolean; msg: string; data: Event }>(`${baseURL}/events/${event.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      },
      body: { ...event, userId: userCookie.value.id }
    })
    if (error.value) throw new Error(error.value.message)
    if (!data.value?.data) throw new Error("Error al actualizar el evento")
    return data.value.data
  }

  const deleteEvent = async (id: number): Promise<Event> => {
    if (!userCookie.value) throw new Error("Usuario no autenticado")
    const { data, error } = await useFetch<{ success: boolean; msg: string; data: Event }>(`${baseURL}/events/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      }
    })
    if (error.value) throw new Error(error.value.message)
    if (!data.value?.data) throw new Error("Error al eliminar el evento")
    return data.value.data
  }

  return { getEvents, createEvent, updateEvent, deleteEvent }
}
