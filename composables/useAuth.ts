import type { Login } from '~/interfaces/Login.Interface'
import { useCookie } from '#app'

export const useAuth = () => {
  const baseURL = useRuntimeConfig().public.baseURL || useCookie("BASE_URL").value
  const userCookie = useCookie<Login | null>("user")

  /**
   * Login: envía { email, password } al backend => /auth/login
   */
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
        // Ahora el backend devuelve { name, email, token, role, ... }
        userCookie.value = data.value
        return { success: true }
      }
      return { success: false, msg: 'Credenciales incorrectas' }
    } catch (error) {
      return { success: false, msg: 'Error al iniciar sesión' }
    }
  }

  /**
   * Register: envía { name, email, password, role } => /usuario
   */
  const register = async (name: string, correo: string, contraseña: string): Promise<{ success: boolean; msg?: string }> => {
    try {
      const { data } = await useFetch<any>(`${baseURL}/usuario`, {
        method: 'POST',
        body: {
          name,              // El backend espera "name"
          email: correo,     // El backend espera "email"
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
