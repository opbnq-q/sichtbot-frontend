export const useIsAuth = () => {
  return !!useCookie<string | null>('token', {
    path: '/',
    sameSite: 'lax',
  }).value
}
