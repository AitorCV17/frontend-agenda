// /middleware/auth.global.ts
import type { Login } from "~/interfaces/Login.Interface";

export default defineNuxtRouteMiddleware((to, from) => {
  const userLogin = useCookie<Login | null>("user");

  // Rutas públicas: las de autenticación
  const publicPaths = ["/", "/auth/login", "/auth/register"];

  if (publicPaths.includes(to.path)) {
    if (userLogin.value && userLogin.value.token) {
      return navigateTo("/inicio");
    }
    return;
  }

  // Para rutas protegidas: si no hay token, redirige a login
  if (!userLogin.value || !userLogin.value.token) {
    return navigateTo("/auth/login");
  }
});
