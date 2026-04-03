import type { ServerResponse } from "~/types/server-response.type"

export class AuthRepository {
    constructor(private readonly fetch: typeof $fetch) {}

    async login(email: string): Promise<ServerResponse> {
        return ({
            status: 'success',
            data: undefined
        })
    }
    async confirmOtp(email: string, otp: string): Promise<ServerResponse<{token: string}>> {
        return ({ data: { token: '' }, status: 'success'})
    }
    async resendOtp(email: string): Promise<ServerResponse> {
        return ({
            status: 'success',
            data: undefined
        })
    }
}