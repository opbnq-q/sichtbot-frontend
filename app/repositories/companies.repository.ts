export class CompaniesRepository {
    constructor(
        private readonly fetch: typeof $fetch
    ) {}

    getToken() {
        const token = useToken().value
        return `Bearer ${token}`
    }

    async getAll() {
        return await this.fetch('/api/company', {
            method: 'GET',
            headers: {
                Authorization: this.getToken()
            }
        })
    }

    async create(data: { name: string, description: string }) {
        return await this.fetch('/api/company', {
            method: 'POST',
            headers: {
                Authorization: this.getToken()
            },
            body: data
        })
    }
}