// composables/useNotes.ts
import { useCookie, useRuntimeConfig, useFetch } from '#app'
import type { Login } from '~/interfaces/Login.Interface'
import type { Ref } from 'vue'

export interface Note {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

// Definimos la cookie tipada para el usuario fuera de la función
const userCookie = useCookie<Login | null>('user')

export const useNotes = () => {
  const baseURL = useRuntimeConfig().public.baseURL || useCookie('BASE_URL').value

  // Obtiene todas las notas del usuario
  const getNotes = async (): Promise<Note[]> => {
    if (!userCookie.value) {
      throw new Error("Usuario no autenticado")
    }
    const { data, error } = await useFetch<{ success: boolean; data: Note[] }>(`${baseURL}/notes`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      }
    })
    if (error.value) throw new Error(error.value.message)
    if (!data.value?.data) return []
    return data.value.data
  }

  // Crea una nueva nota
  const createNote = async (note: { title: string; content: string }): Promise<Note> => {
    if (!userCookie.value) {
      throw new Error("Usuario no autenticado")
    }
    const { data, error } = await useFetch<{ success: boolean; msg: string; data: Note }>(`${baseURL}/notes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      },
      body: { ...note, userId: userCookie.value.id }
    })
    if (error.value) throw new Error(error.value.message)
    if (!data.value?.data) throw new Error("Error al crear la nota")
    return data.value.data
  }

  // Actualiza una nota existente
  const updateNote = async (note: { id: number; title?: string; content?: string }): Promise<Note> => {
    if (!userCookie.value) {
      throw new Error("Usuario no autenticado")
    }
    const { data, error } = await useFetch<{ success: boolean; msg: string; data: Note }>(`${baseURL}/notes/${note.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      },
      body: { ...note, userId: userCookie.value.id }
    })
    if (error.value) throw new Error(error.value.message)
    if (!data.value?.data) throw new Error("Error al actualizar la nota")
    return data.value.data
  }

  // Elimina una nota
  const deleteNote = async (id: number): Promise<Note> => {
    if (!userCookie.value) {
      throw new Error("Usuario no autenticado")
    }
    const { data, error } = await useFetch<{ success: boolean; msg: string; data: Note }>(`${baseURL}/notes/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userCookie.value.token}`
      }
    })
    if (error.value) throw new Error(error.value.message)
    if (!data.value?.data) throw new Error("Error al eliminar la nota")
    return data.value.data
  }

  return { getNotes, createNote, updateNote, deleteNote }
}
