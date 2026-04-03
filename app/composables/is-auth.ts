export const useIsAuth = () => {
  return !!useToken().value
}
