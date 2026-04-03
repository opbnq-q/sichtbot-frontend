export const useToken = () => {
  const token = useCookie('token', {
    path: '/',
    sameSite: 'lax',
  })
  return token
}
