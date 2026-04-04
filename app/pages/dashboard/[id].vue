<template>
    <div class="space-y-4">
        <div class="flex max-md:flex-col gap-2 justify-between">
            <div class="flex gap-2 max-md:flex-col">
                <UiButton
                    class="w-full"
                    variant="outline"
                    @click="navigateTo('/dashboard')"
                >
                    Назад
                </UiButton>

                <WidgetsCompanyResourcesManager
                    class="w-full"
                    :company-id="companyId"
                />
            </div>

            <KitReportBorderButton
                class="max-md:w-full"
                @click="handleGenerateReport"
            >
                Сформировать отчет
            </KitReportBorderButton>
        </div>

        <WidgetsAuthFlowStepper current-step="report" />

        <WidgetsCompanyDetailsManager :route-id-label="routeIdLabel" />

        <WidgetsReportViewerCard
            :report="selectedReport"
            :is-generating="reportsStore.isGenerating"
            :is-loading="reportsStore.isLoading && !reportsStore.hasFetched"
            :company-resources="companyResources"
            @open-export="isExportDialogOpen = true"
        />

        <WidgetsReportHistoryCard
            :reports="reportsStore.sortedReports"
            :selected-report-id="reportsStore.selectedReportId"
            @select="selectReportWithAnimation"
        />
    </div>

    <WidgetsReportExportDialog
        v-model:open="isExportDialogOpen"
        :report="selectedReport"
    />
</template>

<script lang="ts" setup>
import type { ResourceOut } from "~/repositories/resources.repository";
import type { CompanyOut } from "~/repositories/resources.repository";
import { useReportsStore } from "~/stores/reports.store";
import type { ServerResponse } from "~/types/server-response.type";
import { toast } from "vue-sonner";

const route = useRoute();

const routeIdLabel = computed(() => {
    const id = route.params.id;
    if (Array.isArray(id)) {
        return id[0] ?? "";
    }
    return id ?? "";
});

const companyId = computed(() => Number(route.params.id));

const reportsStore = useReportsStore();
const selectedReport = computed(() => reportsStore.selectedReport);
const isExportDialogOpen = ref(false);

const { $ofetch } = useNuxtApp();
const companyResources = ref<ResourceOut[]>([]);
const companyDescription = ref("");

const getAuthHeader = () => {
    const token = useToken().value;
    return {
        Authorization: `Bearer ${token}`,
    };
};

const unwrapServerResponse = <T>(response: T | ServerResponse<T>) => {
    if (response && typeof response === "object" && "status" in response) {
        const wrapped = response as ServerResponse<T>;
        if (wrapped.status !== "success") {
            return null;
        }
        return wrapped.data;
    }

    return response as T;
};

const fetchCompanyDescription = async () => {
    if (!Number.isFinite(companyId.value)) {
        companyDescription.value = "";
        return;
    }

    try {
        const response = await $ofetch<ServerResponse<CompanyOut>>(
            `/company/${companyId.value}`,
            {
                method: "GET",
                headers: getAuthHeader(),
                cache: "no-store",
                query: {
                    _t: Date.now(),
                },
            },
        );

        const company = unwrapServerResponse(response);
        companyDescription.value = company?.description ?? "";
    } catch {
        companyDescription.value = "";
    }
};

const fetchCompanyResources = async () => {
    if (!Number.isFinite(companyId.value)) {
        companyResources.value = [];
        return;
    }

    try {
        const response = await $ofetch<
            ResourceOut[] | ServerResponse<ResourceOut[]>
        >("/resource", {
            method: "GET",
            headers: getAuthHeader(),
            cache: "no-store",
            query: {
                _t: Date.now(),
            },
        });

        const all = unwrapServerResponse(response) ?? [];

        companyResources.value = all.filter(
            (resource) => resource.company.id === companyId.value,
        );
    } catch {
        companyResources.value = [];
    }
};

const selectReportWithAnimation = async (id: string) => {
    try {
        await reportsStore.setSelectedReportId(id);
    } catch {
        // keep list payload if details endpoint is temporarily unavailable
    }
};

const handleGenerateReport = async () => {
    await Promise.all([fetchCompanyResources(), fetchCompanyDescription()]);

    const hasDescription = companyDescription.value.trim().length > 0;
    const hasResources = companyResources.value.length > 0;

    if (!hasDescription && !hasResources) {
        toast.error("Невозможно сформировать отчет", {
            description:
                "Заполни информацию о компании и ресурсах. Сервер вернет BadRequest.",
        });
        return;
    }

    if (!hasDescription && hasResources) {
        toast.warning("Будет создан отчет: только метрики", {
            description:
                "Заполни информацию о компании, чтобы получить полный отчет.",
        });
    }

    if (hasDescription && !hasResources) {
        toast.warning("Будет создан отчет: только рекомендации", {
            description: "Добавь хотя бы один ресурс, чтобы получить метрики.",
        });
    }

    try {
        await reportsStore.generateReport(companyId.value);
    } catch (error) {
        const status = Number(
            (error as { status?: number })?.status ??
                (error as { statusCode?: number })?.statusCode ??
                (error as { response?: { status?: number } })?.response
                    ?.status,
        );

        if (status === 400) {
            toast.error("BadRequest", {
                description:
                    "Недостаточно данных для отчета. Заполни описание компании и/или добавь ресурсы.",
            });
        }
    }
};

onMounted(async () => {
    await Promise.all([
        reportsStore.fetchReports(companyId.value),
        fetchCompanyResources(),
        fetchCompanyDescription(),
    ]);
});

watch(companyId, async () => {
    reportsStore.clear();
    await Promise.all([
        reportsStore.fetchReports(companyId.value),
        fetchCompanyResources(),
        fetchCompanyDescription(),
    ]);
});

definePageMeta({
    middleware: "auth",
});
</script>
