import { BaseRepository } from "./base.repository";

export enum EResourceType {
  SITE = "SITE",
  VK = "VK",
  TELEGRAM = "TELEGRAM",
}

export type CompanyOut = {
  id: number;
  name: string;
  description: string;
};

export type ResourceOut = {
  id: number;
  name: string;
  url: string;
  type: EResourceType;
  company: CompanyOut;
};

export type CreateResourceDto = {
  name: string;
  url: string;
  type: EResourceType;
  companyId: number;
};

export type UpdateResourceDto = Partial<CreateResourceDto>;

export class ResourcesRepository extends BaseRepository {
  async getAll() {
    return await this.fetch<ResourceOut[]>("/resource", {
      method: "GET",
      headers: {
        Authorization: this.getToken(),
      },
    });
  }

  async getById(id: string | number) {
    return await this.fetch<ResourceOut>(`/resource/${id}`, {
      method: "GET",
      headers: {
        Authorization: this.getToken(),
      },
    });
  }

  async create(data: CreateResourceDto) {
    return await this.fetch<ResourceOut>("/resource", {
      method: "POST",
      headers: {
        Authorization: this.getToken(),
      },
      body: data,
    });
  }

  async update(id: string | number, data: UpdateResourceDto) {
    return await this.fetch<ResourceOut>(`/resource/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: this.getToken(),
      },
      body: data,
    });
  }

  async delete(id: string | number) {
    return await this.fetch<void>(`/resource/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: this.getToken(),
      },
    });
  }
}
