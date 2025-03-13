// composables/useAuth.ts
import type { Login } from '~/interfaces/Login.Interface'
import { useCookie, useRuntimeConfig } from '#app'

export const useAuth = () => {
  const config = useRuntimeConfig()
  // Se obtiene la URL base y la cookie dentro de la función
  const baseURL = config.public.baseURL || useCookie("BASE_URL").value
  const userCookie = useCookie<Login | null>("user")

  const login = async (correo: string, contraseña: string): Promise<{ success: boolean; msg?: string }> => {
    try {
      const { data } = await useFetch<Login>(`${baseURL}/auth/login`, {
        method: 'POST',
        body: {
          email: correo,
          password: contraseña
        }
      })
      
      if (data.value && data.value.token) {
        userCookie.value = data.value
        return { success: true }
      }
      return { success: false, msg: 'Credenciales incorrectas' }
    } catch (error) {
      return { success: false, msg: 'Error al iniciar sesión' }
    }
  }

  const register = async (name: string, correo: string, contraseña: string): Promise<{ success: boolean; msg?: string }> => {
    try {
      const { data } = await useFetch<any>(`${baseURL}/usuario`, {
        method: 'POST',
        body: {
          name,
          email: correo,
          password: contraseña,
          role: 'REGULAR'
        }
      })
      if (data.value && data.value.exito) {
        return { success: true }
      }
      return { success: false, msg: data.value?.msg || 'Error al registrar' }
    } catch (error) {
      return { success: false, msg: 'Error al registrar el usuario' }
    }
  }

  return { login, register }
}
