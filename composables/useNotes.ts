// composables/useNotes.ts
import { useCookie, useRuntimeConfig, useFetch } from '#app'
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
    return data.value?.data || []
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
    if (!data.value?.data) throw new Error("Error al crear la nota")
    return data.value.data
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
    if (!data.value?.data) throw new Error("Error al actualizar la nota")
    return data.value.data
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
    if (!data.value?.data) throw new Error("Error al eliminar la nota")
    return data.value.data
  }

  return { getNotes, createNote, updateNote, deleteNote }
}
