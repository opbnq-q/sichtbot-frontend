export const useIsAuth = () => {
  return !!useCookie('token').value
}
