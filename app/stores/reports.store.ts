/// <reference types="nuxt/app" />
import { defineStore } from "pinia";
import { ReportsRepository } from "~/repositories/reports.repository";
import type { ReportOutDto } from "~/repositories/reports.repository";
import type { ReportListItemDto } from "~/repositories/reports.repository";
import type { ServerResponse } from "~/types/server-response.type";

export const useReportsStore = defineStore("reports", () => {
  const reports = ref<ReportOutDto[]>([]);
  const isLoading = ref(false);
  const isGenerating = ref(false);
  const hasFetched = ref(false);
  const selectedReportId = ref<string | null>(null);
  const selectedReport = ref<ReportOutDto | null>(null);
  const activeCompanyId = ref<number | null>(null);

  const { $ofetch } = useNuxtApp();
  const repository = new ReportsRepository($ofetch);

  const normalizeReportId = (value: unknown): string | null => {
    if (typeof value === "string") {
      const normalized = value.trim();
      return normalized.length > 0 ? normalized : null;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }

    return null;
  };

  const normalizeReport = (report: ReportOutDto): ReportOutDto => {
    const normalizedId = normalizeReportId((report as { id?: unknown }).id);
    return {
      ...report,
      id: normalizedId ?? report.id,
    };
  };

  const isReportType = (value: unknown): value is ReportOutDto["reportType"] => {
    return (
      value === "full" || value === "metrics-only" || value === "advices-only"
    );
  };

  const extractReportFromUnknown = (value: unknown): ReportOutDto | null => {
    if (!value) {
      return null;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        const extracted = extractReportFromUnknown(item);
        if (extracted) {
          return extracted;
        }
      }
      return null;
    }

    if (typeof value !== "object") {
      return null;
    }

    const obj = value as Record<string, unknown>;

    if (!["status", "data", "report", "item", "result"].some((k) => k in obj)) {
      if (obj.id || obj.reportType) {
        const id = normalizeReportId(obj.id);
        if (!id) {
          return null;
        }

        const createdAt = typeof obj.createdAt === "string" ? obj.createdAt : "";
        const reportType = isReportType(obj.reportType) ? obj.reportType : "full";

        const report: ReportOutDto = {
          id,
          createdAt,
          reportType,
          resources: (obj.resources as ReportOutDto["resources"]) ?? null,
          advices: (obj.advices as ReportOutDto["advices"]) ?? null,
        };

        return normalizeReport(report);
      }
    }

    if ("status" in obj) {
      const wrapped = value as ServerResponse<unknown>;
      if (wrapped.status === "success") {
        const unwrapped = extractReportFromUnknown(wrapped.data);
        if (unwrapped) return unwrapped;
      }
    }

    const nestedKeys = ["data", "report", "item", "result"] as const;
    for (const key of nestedKeys) {
      if (key in obj) {
        const extracted = extractReportFromUnknown(obj[key]);
        if (extracted) {
          return extracted;
        }
      }
    }

    return null;
  };

  const toPreviewReport = (item: ReportListItemDto): ReportOutDto | null => {
    if (!item || typeof item !== "object") {
      return null;
    }

    const raw = item as Partial<ReportOutDto> & { id?: unknown };
    const id = normalizeReportId(raw.id);

    if (!id) {
      return null;
    }

    return {
      id,
      reportType:
        raw.reportType === "metrics-only" ||
        raw.reportType === "advices-only" ||
        raw.reportType === "full"
          ? raw.reportType
          : "full",
      createdAt:
        typeof raw.createdAt === "string" && raw.createdAt.trim().length > 0
          ? raw.createdAt
          : "",
      resources: null,
      advices: null,
    };
  };

  const unwrapResponse = <T>(value: T | ServerResponse<T>): T | null => {
    if (value && typeof value === "object" && "status" in value) {
      const wrapped = value as ServerResponse<T>;
      if (wrapped.status !== "success") {
        return null;
      }
      return wrapped.data;
    }

    return value as T;
  };

  const sortedReports = computed(() => {
    return [...reports.value].sort((a, b) => {
      const aTime = Date.parse(a.createdAt);
      const bTime = Date.parse(b.createdAt);
      return (
        (Number.isFinite(bTime) ? bTime : 0) -
        (Number.isFinite(aTime) ? aTime : 0)
      );
    });
  });

  const extractReportId = (item: ReportListItemDto): string | null => {
    if (typeof item === "string") {
      return normalizeReportId(item);
    }

    if (item && typeof item === "object" && "id" in item) {
      return normalizeReportId((item as { id?: unknown }).id);
    }

    return null;
  };

  const setSelectedReportId = async (id: string | number | null) => {
    const normalizedId = normalizeReportId(id);
    selectedReportId.value = normalizedId;

    if (!normalizedId) {
      selectedReport.value = null;
      return;
    }

    selectedReport.value = null;

    const response = await repository.getById(normalizedId);
    const report = extractReportFromUnknown(response);

    if (selectedReportId.value !== normalizedId) {
      return;
    }

    if (!report) {
      selectedReport.value = null;
      return;
    }

    selectedReport.value = report;
  };

  const clear = () => {
    reports.value = [];
    isLoading.value = false;
    isGenerating.value = false;
    hasFetched.value = false;
    selectedReportId.value = null;
    selectedReport.value = null;
    activeCompanyId.value = null;
  };

  const fetchReports = async (companyId: number) => {
    if (!Number.isFinite(companyId)) {
      clear();
      return;
    }

    activeCompanyId.value = companyId;
    isLoading.value = true;

    try {
      const response = await repository.getByCompanyId(companyId);
      const list = unwrapResponse(
        response as ReportListItemDto[] | ServerResponse<ReportListItemDto[]>,
      );

      if (!list) {
        reports.value = [];
        selectedReportId.value = null;
        selectedReport.value = null;
        return;
      }

      const ids = Array.from(
        new Set(
          list
            .map((item) => extractReportId(item))
            .filter((id): id is string => Boolean(id)),
        ),
      );

      if (ids.length > 0) {
        const details = await Promise.all(
          ids.map((id) => repository.getById(id)),
        );
        reports.value = details
          .map((item) => extractReportFromUnknown(item))
          .filter((item): item is ReportOutDto => Boolean(item))
          .map((item) => normalizeReport(item));

        if (reports.value.length === 0) {
          reports.value = list
            .map((item) => toPreviewReport(item))
            .filter((item): item is ReportOutDto => Boolean(item));
        }
      } else {
        reports.value = list
          .map((item) => toPreviewReport(item))
          .filter((item): item is ReportOutDto => Boolean(item));
      }

      if (reports.value.length === 0) {
        selectedReportId.value = null;
        selectedReport.value = null;
        return;
      }

      const exists = selectedReportId.value
        ? reports.value.some((r) => r.id === selectedReportId.value)
        : false;

      if (!exists) {
        const newest = sortedReports.value[0];
        selectedReportId.value = normalizeReportId(newest?.id) ?? null;
      }

      await setSelectedReportId(selectedReportId.value);
    } finally {
      hasFetched.value = true;
      isLoading.value = false;
    }
  };

  const generateReport = async (companyId: number) => {
    if (isGenerating.value || !Number.isFinite(companyId)) {
      return null;
    }

    activeCompanyId.value = companyId;
    isGenerating.value = true;

    try {
      const response = await repository.createForCompany(companyId);
      const created = unwrapResponse(
        response as ReportOutDto | ServerResponse<ReportOutDto>,
      );

      if (!created) {
        return null;
      }

      const next = [
        normalizeReport(created),
        ...reports.value.filter((r) => r.id !== created.id),
      ];
      reports.value = next;

      await setSelectedReportId(created.id);

      return created;
    } finally {
      isGenerating.value = false;
    }
  };

  return {
    reports,
    sortedReports,
    selectedReportId,
    selectedReport,
    isLoading,
    isGenerating,
    hasFetched,
    setSelectedReportId,
    clear,
    fetchReports,
    generateReport,
  };
});
