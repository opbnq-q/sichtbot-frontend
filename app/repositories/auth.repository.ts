import type { ServerResponse } from "~/types/server-response.type"

export class AuthRepository {
    constructor(private readonly fetch: typeof $fetch) {}

    async login(email: string): Promise<ServerResponse> {
        const response = await this.fetch<ServerResponse>('/auth/login', {
            method: 'POST',
            body: {
                email
            }
        })
        return response
    }
    async confirmOtp(email: string, otp: string): Promise<ServerResponse<{accessToken: string}>> {
        return await this.fetch<ServerResponse<{accessToken: string}>>('/auth/otp/confirm', {
            method: 'POST',
            body: {
                email, otp
            }
        })
    }
    async resendOtp(email: string): Promise<ServerResponse> {
        return await this.fetch<ServerResponse>('/auth/otp/resend', {
            method: 'POST',
            body: {
                email
            }
        })
    }
}