import type { ServerResponse } from "~/types/server-response.type";
import { BaseRepository } from "./base.repository";

type CompanyApiEntity = {
  id: string;
  name: string;
  description: string;
};

export class CompaniesRepository extends BaseRepository {
  async getAll() {
    return await this.fetch<ServerResponse<CompanyApiEntity[]>>("/company", {
      method: "GET",
      headers: {
        Authorization: this.getToken(),
      },
    });
  }

  async create(data: { name: string; description: string }) {
    return await this.fetch("/company", {
      method: "POST",
      headers: {
        Authorization: this.getToken(),
      },
      body: data,
    });
  }

  async getById(id: string | number) {
    return await this.fetch<ServerResponse<CompanyApiEntity>>(
      `/company/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: this.getToken(),
        },
      },
    );
  }

  async update(
    id: string | number,
    data: { name: string; description: string },
  ) {
    return await this.fetch<ServerResponse<CompanyApiEntity>>(
      `/company/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: this.getToken(),
        },
        body: data,
      },
    );
  }

  async delete(id: string) {
    return await this.fetch<ServerResponse>(`/company/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: this.getToken(),
      },
    });
  }
}
