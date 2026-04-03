export default defineNuxtRouteMiddleware((to, from) => {
    const isAuthed = useIsAuth()
    if (!isAuthed) return navigateTo('/auth');
})
