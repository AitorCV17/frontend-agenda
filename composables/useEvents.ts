// composables/useEvents.ts
import { useCookie, useRuntimeConfig, useFetch, useState } from '#app'
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

  // 🔥 Usamos useState para evitar que los eventos desaparezcan al recargar 🔥
  const events = useState<Event[]>('events', () => [])

  const getEvents = async (): Promise<Event[]> => {
    if (!userCookie.value) throw new Error("Usuario no autenticado")
    const { data, error } = await useFetch<{ success: boolean; data: Event[] }>(`${baseURL}/events`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      },
      server: false
    })
    if (error.value) throw new Error(error.value.message)

    events.value = data.value?.data || []
    return events.value
  }

  const createEvent = async (event: { title: string; description?: string; startTime: string; endTime: string; location?: string }): Promise<Event> => {
    if (!userCookie.value) throw new Error("Usuario no autenticado")
    const { data, error } = await useFetch<{ success: boolean; msg: string; data: Event }>(`${baseURL}/events`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      },
      body: { ...event, userId: userCookie.value.id },
      server: false
    })
    if (error.value) throw new Error(error.value.message)

    events.value.push(data.value!.data) // 🔥 Agregamos el nuevo evento en memoria
    return data.value!.data
  }

  const updateEvent = async (event: { id: number; title?: string; description?: string; startTime?: string; endTime?: string; location?: string }): Promise<Event> => {
    if (!userCookie.value) throw new Error("Usuario no autenticado")
    const { data, error } = await useFetch<{ success: boolean; msg: string; data: Event }>(`${baseURL}/events/${event.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      },
      body: { ...event, userId: userCookie.value.id },
      server: false
    })
    if (error.value) throw new Error(error.value.message)

    // 🔥 Actualizamos el evento en memoria
    const index = events.value.findIndex(e => e.id === event.id)
    if (index !== -1) events.value[index] = data.value!.data

    return data.value!.data
  }

  const deleteEvent = async (id: number): Promise<Event> => {
    if (!userCookie.value) throw new Error("Usuario no autenticado")
    const { data, error } = await useFetch<{ success: boolean; msg: string; data: Event }>(`${baseURL}/events/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      },
      server: false
    })
    if (error.value) throw new Error(error.value.message)

    events.value = events.value.filter(e => e.id !== id) // 🔥 Eliminamos el evento en memoria
    return data.value!.data
  }

  return { getEvents, createEvent, updateEvent, deleteEvent, events }
}
