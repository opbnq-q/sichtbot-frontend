import type { ServerResponse } from "~/types/server-response.type";
import { BaseRepository } from "./base.repository";
import type { EResourceType } from "./resources.repository";

export type ReportMetricDto = {
  id: string;
  title: string;
  currentValue: number;
  maxValue: number;
  minValue: number;
  postfix: string;
};

export type ReportResourceDto = {
  resourceType: EResourceType;
  metrics: ReportMetricDto[];
};

export type ReportAdvicesDto = {
  analysis: string;
  mistakes: string;
  recommendations: string;
};

export type ReportOutDto = {
  id: string;
  reportType: "week" | "month";
  createdAt: string;
  resources: ReportResourceDto[] | null;
  advices: ReportAdvicesDto | null;
};

export class ReportsRepository extends BaseRepository {
  async createForCompany(companyId: string | number) {
    return await this.fetch<ServerResponse<ReportOutDto>>(
      `/report/company/${companyId}`,
      {
        method: "POST",
        headers: {
          Authorization: this.getToken(),
        },
      },
    );
  }

  async getByCompanyId(
    companyId: string | number,
    params?: { limit?: number; offset?: number },
  ) {
    const limit = params?.limit ?? 10;
    const offset = params?.offset ?? 0;

    return await this.fetch<ServerResponse<ReportOutDto[]>>(
      `/report/company/${companyId}`,
      {
        method: "GET",
        headers: {
          Authorization: this.getToken(),
        },
        query: {
          limit,
          offset,
        },
      },
    );
  }
}
