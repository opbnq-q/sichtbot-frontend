export type ServerResponse<T=unknown> = {
    status: 'success'
    data: T
} | {
    status: 'error'
    message: string
}