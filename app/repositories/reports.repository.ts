import type { ServerResponse } from "~/types/server-response.type";
import { BaseRepository } from "./base.repository";
import type { EResourceType } from "./resources.repository";

export type ReportType = "metrics-only" | "advices-only" | "full";

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
  name?: string;
  url?: string;
  metrics: ReportMetricDto[];
};

export type ReportAdvicesDto = {
  analysis: string;
  mistakes: string;
  recommendations: string;
};

export type ReportOutDto = {
  id: string;
  reportType: ReportType;
  createdAt: string;
  resources: ReportResourceDto[] | null;
  advices: ReportAdvicesDto | null;
};

export type ReportListItemDto = ReportOutDto | { id: string } | string;

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
    return await this.fetch<ServerResponse<ReportListItemDto[]>>(
      `/report/company/${companyId}`,
      {
        method: "GET",
        headers: {
          Authorization: this.getToken(),
        },
      },
    );
  }

  async getById(id: string | number, companyId?: string | number | null) {
    const candidates = [
      `/report/${id}`,
      companyId !== undefined && companyId !== null
        ? `/report/company/${companyId}/${id}`
        : null,
      companyId !== undefined && companyId !== null
        ? `/report/company/${companyId}/report/${id}`
        : null,
    ].filter((url): url is string => Boolean(url));

    let lastError: unknown = null;

    for (const url of candidates) {
      try {
        const result = await this.fetch<
          ServerResponse<ReportOutDto> | ReportOutDto | Record<string, unknown>
        >(url, {
          method: "GET",
          headers: {
            Authorization: this.getToken(),
          },
        });

        if (result && typeof result === "object" && "status" in result) {
          const wrapped = result as ServerResponse<ReportOutDto>;
          if (wrapped.status === "error") {
            lastError = wrapped;
            continue;
          }
        }

        return result;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  }
}
