/// <reference types="nuxt/app" />
import { defineStore } from "pinia";
import { ReportsRepository } from "~/repositories/reports.repository";
import type { ReportOutDto } from "~/repositories/reports.repository";
import type { ReportListItemDto } from "~/repositories/reports.repository";

export const useReportsStore = defineStore("reports", () => {
  const reports = ref<ReportOutDto[]>([]);
  const isLoading = ref(false);
  const isGenerating = ref(false);
  const hasFetched = ref(false);
  const selectedReportId = ref<string | null>(null);
  const selectedReport = ref<ReportOutDto | null>(null);

  const { $ofetch } = useNuxtApp();
  const repository = new ReportsRepository($ofetch);

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
      return item;
    }

    if (item && typeof item === "object" && "id" in item) {
      const id = item.id;
      return typeof id === "string" && id.length > 0 ? id : null;
    }

    return null;
  };

  const setSelectedReportId = async (id: string | null) => {
    selectedReportId.value = id;

    if (!id) {
      selectedReport.value = null;
      return;
    }

    selectedReport.value = null;

    const response = await repository.getById(id);

    if (selectedReportId.value !== id) {
      return;
    }

    if (response.status !== "success" || !response.data) {
      selectedReport.value = null;
      return;
    }

    selectedReport.value = response.data;
  };

  const clear = () => {
    reports.value = [];
    isLoading.value = false;
    isGenerating.value = false;
    hasFetched.value = false;
    selectedReportId.value = null;
    selectedReport.value = null;
  };

  const fetchReports = async (companyId: number) => {
    if (!Number.isFinite(companyId)) {
      clear();
      return;
    }

    isLoading.value = true;

    try {
      const response = await repository.getByCompanyId(companyId);

      if (response.status !== "success") {
        reports.value = [];
        selectedReportId.value = null;
        selectedReport.value = null;
        return;
      }

      const ids = Array.from(
        new Set(
          (response.data ?? [])
            .map((item) => extractReportId(item))
            .filter((id): id is string => Boolean(id)),
        ),
      );

      if (ids.length > 0) {
        const details = await Promise.all(ids.map((id) => repository.getById(id)));
        reports.value = details
          .filter(
            (item): item is { status: "success"; data: ReportOutDto } =>
              item.status === "success",
          )
          .map((item) => item.data);
      } else {
        reports.value = [];
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
        selectedReportId.value = newest?.id ?? null;
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

    isGenerating.value = true;

    try {
      const response = await repository.createForCompany(companyId);

      if (response.status !== "success") {
        return null;
      }

      const created = response.data;

      const next = [
        created,
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
