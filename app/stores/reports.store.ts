/// <reference types="nuxt/app" />
import { defineStore } from "pinia";
import { ReportsRepository } from "~/repositories/reports.repository";
import type { ReportOutDto } from "~/repositories/reports.repository";

export const useReportsStore = defineStore("reports", () => {
  const reports = ref<ReportOutDto[]>([]);
  const isLoading = ref(false);
  const isGenerating = ref(false);
  const hasFetched = ref(false);
  const selectedReportId = ref<string | null>(null);

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

  const selectedReport = computed(() => {
    if (!selectedReportId.value) {
      return null;
    }
    return reports.value.find((r) => r.id === selectedReportId.value) ?? null;
  });

  const setSelectedReportId = (id: string | null) => {
    selectedReportId.value = id;
  };

  const clear = () => {
    reports.value = [];
    isLoading.value = false;
    isGenerating.value = false;
    hasFetched.value = false;
    selectedReportId.value = null;
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
        return;
      }

      reports.value = response.data ?? [];

      if (reports.value.length === 0) {
        selectedReportId.value = null;
        return;
      }

      const exists = selectedReportId.value
        ? reports.value.some((r) => r.id === selectedReportId.value)
        : false;

      if (!exists) {
        const newest = sortedReports.value[0];
        selectedReportId.value = newest?.id ?? null;
      }
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

      selectedReportId.value = created.id;

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
