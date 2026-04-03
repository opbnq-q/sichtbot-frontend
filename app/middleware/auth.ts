export default defineNuxtRouteMiddleware(() => {
  const isAuthed = useIsAuth()
  if (!isAuthed) {
    return navigateTo('/auth')
  }
})
