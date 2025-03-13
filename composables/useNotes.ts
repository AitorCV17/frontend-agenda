// composables/useNotes.ts
import { useCookie, useRuntimeConfig, useFetch, useState } from '#app'
import type { Login } from '~/interfaces/Login.Interface'

export interface Note {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export const useNotes = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.baseURL || useCookie('BASE_URL').value
  const userCookie = useCookie<Login | null>('user')

  // 🔥 Usamos useState para mantener las notas en memoria y evitar que desaparezcan 🔥
  const notes = useState<Note[]>('notes', () => [])

  const getNotes = async (): Promise<Note[]> => {
    if (!userCookie.value) throw new Error("Usuario no autenticado")
    const { data, error } = await useFetch<{ success: boolean; data: Note[] }>(`${baseURL}/notes`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      },
      server: false
    })
    if (error.value) throw new Error(error.value.message)

    notes.value = data.value?.data || []
    return notes.value
  }

  const createNote = async (note: { title: string; content: string }): Promise<Note> => {
    if (!userCookie.value) throw new Error("Usuario no autenticado")
    const { data, error } = await useFetch<{ success: boolean; msg: string; data: Note }>(`${baseURL}/notes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      },
      body: { ...note, userId: userCookie.value.id },
      server: false
    })
    if (error.value) throw new Error(error.value.message)

    notes.value.push(data.value!.data) // 🔥 Agregamos la nueva nota en memoria
    return data.value!.data
  }

  const updateNote = async (note: { id: number; title?: string; content?: string }): Promise<Note> => {
    if (!userCookie.value) throw new Error("Usuario no autenticado")
    const { data, error } = await useFetch<{ success: boolean; msg: string; data: Note }>(`${baseURL}/notes/${note.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      },
      body: { ...note, userId: userCookie.value.id },
      server: false
    })
    if (error.value) throw new Error(error.value.message)

    // 🔥 Actualizamos la nota en memoria
    const index = notes.value.findIndex(n => n.id === note.id)
    if (index !== -1) notes.value[index] = data.value!.data

    return data.value!.data
  }

  const deleteNote = async (id: number): Promise<Note> => {
    if (!userCookie.value) throw new Error("Usuario no autenticado")
    const { data, error } = await useFetch<{ success: boolean; msg: string; data: Note }>(`${baseURL}/notes/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      },
      server: false
    })
    if (error.value) throw new Error(error.value.message)

    notes.value = notes.value.filter(n => n.id !== id) // 🔥 Eliminamos la nota en memoria
    return data.value!.data
  }

  return { getNotes, createNote, updateNote, deleteNote, notes }
}
