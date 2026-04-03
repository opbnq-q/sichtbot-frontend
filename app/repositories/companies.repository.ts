import type { ServerResponse } from '~/types/server-response.type'

type CompanyApiEntity = {
    id: string
    name: string
    description: string
}

export class CompaniesRepository {
    constructor(
        private readonly fetch: typeof $fetch
    ) {}

    getToken() {
        const token = useToken().value
        return `Bearer ${token}`
    }

    async getAll() {
        return await this.fetch<ServerResponse<CompanyApiEntity[]>>('/company', {
            method: 'GET',
            headers: {
                Authorization: this.getToken()
            }
        })
    }

    async create(data: { name: string, description: string }) {
        return await this.fetch('/company', {
            method: 'POST',
            headers: {
                Authorization: this.getToken()
            },
            body: data
        })
    }

    async delete(id: string) {
        return await this.fetch<ServerResponse>(`/company/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: this.getToken()
            }
        })
    }
}