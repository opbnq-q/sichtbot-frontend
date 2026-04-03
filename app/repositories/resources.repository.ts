import type { ServerResponse } from '~/types/server-response.type'

type ResourceApiEntity = {
  id?: number | string
} & Record<string, unknown>

export class ResourcesRepository {
  constructor(
    private readonly fetch: typeof $fetch,
  ) {}

  getToken() {
    const token = useToken().value
    return `Bearer ${token}`
  }

  async getAll() {
    return await this.fetch<ServerResponse<ResourceApiEntity[]>>('/resource', {
      method: 'GET',
      headers: {
        Authorization: this.getToken(),
      },
    })
  }

  async getById(id: string | number) {
    return await this.fetch<ServerResponse<ResourceApiEntity>>(`/resource/${id}`, {
      method: 'GET',
      headers: {
        Authorization: this.getToken(),
      },
    })
  }

  async create(data: Record<string, unknown>) {
    return await this.fetch<ServerResponse<ResourceApiEntity>>('/resource', {
      method: 'POST',
      headers: {
        Authorization: this.getToken(),
      },
      body: data,
    })
  }

  async update(id: string | number, data: Record<string, unknown>) {
    return await this.fetch<ServerResponse<ResourceApiEntity>>(`/resource/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: this.getToken(),
      },
      body: data,
    })
  }

  async delete(id: string | number) {
    return await this.fetch<ServerResponse>(`/resource/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: this.getToken(),
      },
    })
  }
}
