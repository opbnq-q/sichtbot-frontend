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

        <UiCard class="relative p-4">
            <div
                v-if="reportsStore.isGenerating"
                class="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/70 backdrop-blur-[1px]"
            >
                <KitHammerLoadingAnimation />
            </div>

            <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="space-y-1">
                    <UiCardTitle>Отчет</UiCardTitle>
                </div>

                <div
                    v-if="selectedReport"
                    class="flex flex-wrap items-center gap-2"
                >
                    <span
                        class="rounded-md border border-border/60 bg-background/60 px-2 py-1 text-xs text-muted-foreground"
                    >
                        {{ reportTypeLabel(selectedReport.reportType) }}
                    </span>
                    <span class="text-xs text-muted-foreground">
                        {{ formatCreatedAt(selectedReport.createdAt) }}
                    </span>
                </div>
            </div>

            <div
                v-if="reportsStore.isLoading && !reportsStore.hasFetched"
                class="space-y-3 animate-pulse"
            >
                <div class="h-5 w-1/3 rounded-md bg-muted" />
                <div class="h-4 w-full rounded-md bg-muted/80" />
                <div class="h-4 w-4/5 rounded-md bg-muted/70" />
            </div>

            <Transition name="report-fade" mode="out-in">
                <div
                    v-if="!selectedReport"
                    key="empty"
                    class="rounded-lg border border-border/60 bg-card/80 p-4"
                >
                    <p class="text-sm text-muted-foreground">
                        Нет выбранного отчета. Сформируй новый или выбери из
                        списка ниже.
                    </p>
                </div>

                <div v-else :key="selectedReport.id" class="space-y-4">
                    <div v-if="selectedReport.advices" class="space-y-2">
                        <div
                            class="rounded-md border border-border/50 bg-background/40 p-3"
                        >
                            <p
                                class="text-xs tracking-wide text-muted-foreground"
                            >
                                Анализ
                            </p>
                            <div
                                class="mt-1 text-sm text-foreground report-markdown"
                                v-html="
                                    renderMarkdown(
                                        selectedReport.advices.analysis,
                                    )
                                "
                            />
                        </div>

                        <div
                            class="rounded-md border border-border/50 bg-background/40 p-3"
                        >
                            <p
                                class="text-xs tracking-wide text-muted-foreground"
                            >
                                Ошибки
                            </p>
                            <div
                                class="mt-1 text-sm text-foreground report-markdown"
                                v-html="
                                    renderMarkdown(
                                        selectedReport.advices.mistakes,
                                    )
                                "
                            />
                        </div>

                        <div
                            class="rounded-md border border-border/50 bg-background/40 p-3"
                        >
                            <p
                                class="text-xs tracking-wide text-muted-foreground"
                            >
                                Рекомендации
                            </p>
                            <div
                                class="mt-1 text-sm text-foreground report-markdown"
                                v-html="
                                    renderMarkdown(
                                        selectedReport.advices
                                            .recommendations,
                                    )
                                "
                            />
                        </div>
                    </div>

                    <div
                        v-else
                        class="rounded-lg border border-border/60 bg-card/80 p-4"
                    >
                        <p class="text-sm text-muted-foreground">
                            Для этого отчета нет текстовых рекомендаций.
                        </p>
                    </div>

                    <div
                        v-if="
                            selectedReport.resources &&
                            selectedReport.resources.length > 0
                        "
                        class="space-y-3"
                    >
                        <div
                            v-for="resource in selectedReport.resources"
                            :key="resource.resourceType"
                            class="rounded-md border border-border/50 bg-background/40 p-3"
                        >
                            <div
                                class="flex flex-wrap items-center gap-2 min-w-0"
                            >
                                <component
                                    :is="
                                        resourceTypeIcon(resource.resourceType)
                                    "
                                    class="size-4 shrink-0 text-muted-foreground"
                                />

                                <p
                                    class="truncate text-sm font-medium text-foreground"
                                >
                                    {{ resourceMeta(resource).name }}
                                </p>

                                <a
                                    v-if="resourceMeta(resource).url"
                                    class="truncate text-sm text-muted-foreground underline-offset-4 hover:underline"
                                    :href="resourceMeta(resource).url"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {{ resourceMeta(resource).url }}
                                </a>
                            </div>

                            <div
                                class="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2"
                            >
                                <div
                                    v-for="metric in resource.metrics"
                                    :key="metric.id"
                                    class="rounded-md border border-border/60 bg-card p-3"
                                >
                                    <div
                                        class="flex items-start justify-between gap-2"
                                    >
                                        <p class="text-sm font-medium text-foreground">
                                            {{ metric.title }}
                                        </p>
                                        <p
                                            class="rounded-full border px-2 py-0.5 text-xs font-medium"
                                            :class="metricBadgeClass(metricPercent(metric))"
                                        >
                                            {{ metricPercent(metric) }}%
                                        </p>
                                    </div>

                                    <div
                                        class="relative mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted"
                                    >
                                        <div
                                            class="h-full rounded-full metric-bar transition-[width] duration-500 ease-out"
                                            :class="metricFillClass(metricPercent(metric))"
                                            :style="{
                                                width: metricBarWidth(metric),
                                            }"
                                        />
                                    </div>

                                    <div
                                        class="mt-1.5 grid grid-cols-5 text-[10px] text-muted-foreground"
                                    >
                                        <span
                                            v-for="tick in metricScaleTicks"
                                            :key="`${metric.id}-${tick}`"
                                            class="text-center first:text-left last:text-right"
                                        >
                                            {{ tick }}
                                        </span>
                                    </div>

                                    <div
                                        class="mt-2 flex items-center justify-between text-xs text-muted-foreground"
                                    >
                                        <span>
                                            {{
                                                formatMetricValue(
                                                    metric.currentValue,
                                                    metric.postfix,
                                                )
                                            }}
                                        </span>
                                        <span>
                                            {{
                                                formatMetricValue(
                                                    metric.minValue,
                                                    metric.postfix,
                                                )
                                            }}
                                            —
                                            {{
                                                formatMetricValue(
                                                    metric.maxValue,
                                                    metric.postfix,
                                                )
                                            }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        v-else-if="selectedReport.reportType === 'metrics-only'"
                        class="rounded-lg border border-border/60 bg-card/80 p-4"
                    >
                        <p class="text-sm text-muted-foreground">
                            Для этого отчета метрики недоступны.
                        </p>
                    </div>

                    <div
                        v-else
                        class="rounded-lg border border-border/60 bg-card/80 p-4"
                    >
                        <p class="text-sm text-muted-foreground">
                            Для этого отчета нет данных по ресурсам.
                        </p>
                    </div>
                </div>
            </Transition>
        </UiCard>

        <UiCard class="p-4">
            <div class="flex flex-wrap items-start justify-between gap-2">
                <div class="space-y-1">
                    <UiCardTitle>Отчеты</UiCardTitle>
                </div>

                <div class="flex items-center gap-2">
                    <UiButton
                        variant="outline"
                        size="icon-sm"
                        aria-label="Влево"
                        :disabled="isPrevDisabled"
                        @click="scrollReports('left')"
                    >
                        <ChevronLeft class="size-4" />
                    </UiButton>

                    <UiButton
                        variant="outline"
                        size="icon-sm"
                        aria-label="Вправо"
                        :disabled="isNextDisabled"
                        @click="scrollReports('right')"
                    >
                        <ChevronRight class="size-4" />
                    </UiButton>
                </div>
            </div>

            <div
                v-if="reportsStore.sortedReports.length === 0"
                class="mt-4 rounded-lg border border-border/60 bg-card/80 p-4"
            >
                <p class="text-sm text-muted-foreground">Пока нет отчетов.</p>
            </div>

            <div v-else class="mt-4">
                <div
                    ref="reportsSliderRef"
                    class="reports-slider flex gap-2 overflow-x-auto pb-2"
                >
                    <UiButton
                        v-for="(report, index) in reportButtons"
                        :key="report.id"
                        :data-report-id="report.id"
                        variant="outline"
                        size="sm"
                        class="shrink-0 report-chip"
                        :class="{
                            'border-primary text-primary report-chip--active':
                                reportsStore.selectedReportId === report.id,
                        }"
                        @click="selectReportWithAnimation(report.id)"
                    >
                        <span class="font-medium">№{{ reportNumber(index) }}</span>
                        <span class="text-muted-foreground">
                            {{ formatShortDate(report.createdAt) }}
                        </span>
                    </UiButton>
                </div>

                <div class="mt-2 h-1 w-full rounded-full bg-muted/50">
                    <div
                        class="h-full rounded-full bg-primary/70 transition-[width,transform] duration-300 ease-out"
                        :style="{
                            width: `${sliderProgress}%`,
                        }"
                    />
                </div>
            </div>
        </UiCard>
    </div>

</template>

<script lang="ts" setup>
import type { ReportMetricDto } from "~/repositories/reports.repository";
import {
    type ResourceOut,
    EResourceType,
} from "~/repositories/resources.repository";
import type { CompanyOut } from "~/repositories/resources.repository";
import { useReportsStore } from "~/stores/reports.store";
import type { ServerResponse } from "~/types/server-response.type";
import {
    ChevronLeft,
    ChevronRight,
    Globe,
    MessageCircle,
    Send,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import { marked } from "marked";

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
const reportButtons = computed(() => reportsStore.sortedReports.slice().reverse());
const reportNumber = (index: number) => reportButtons.value.length - index;

const selectedReport = computed(() => reportsStore.selectedReport);

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
        const response = await $ofetch<ResourceOut[] | ServerResponse<ResourceOut[]>>(
            "/resource",
            {
                method: "GET",
                headers: getAuthHeader(),
                cache: "no-store",
                query: {
                    _t: Date.now(),
                },
            },
        );

        const all = unwrapServerResponse(response) ?? [];

        companyResources.value = all.filter(
            (r) => r.company.id === companyId.value,
        );
    } catch {
        companyResources.value = [];
    }
};

const normalizeResourceType = (type: unknown): EResourceType | null => {
    if (typeof type !== "string") {
        return null;
    }

    const normalized = type.trim().toUpperCase();

    if (normalized === EResourceType.SITE) return EResourceType.SITE;
    if (normalized === EResourceType.VK) return EResourceType.VK;
    if (normalized === EResourceType.TELEGRAM) return EResourceType.TELEGRAM;

    return null;
};

const normalizeUrl = (url: unknown): string => {
    if (typeof url !== "string") {
        return "";
    }

    const trimmed = url.trim();

    if (!trimmed) {
        return "";
    }

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed;
    }

    return `https://${trimmed}`;
};

const resourceMeta = (resource: {
    resourceType: unknown;
    name?: string;
    url?: string;
}) => {
    const type = normalizeResourceType(resource.resourceType);

    const reportName =
        typeof resource.name === "string" ? resource.name.trim() : "";
    const reportUrl = normalizeUrl(resource.url);

    if (reportName || reportUrl) {
        return {
            name: reportName || "Ресурс",
            url: reportUrl,
            type,
        };
    }

    const found = type
        ? companyResources.value.find((r) => r.type === type)
        : undefined;

    const fallbackName =
        type === EResourceType.SITE
            ? "Сайт"
            : type === EResourceType.TELEGRAM
              ? "Telegram"
              : type === EResourceType.VK
                ? "VK"
                : "Ресурс";

    return {
        name: found?.name ?? fallbackName,
        url: normalizeUrl(found?.url),
        type,
    };
};

const reportsSliderRef = ref<HTMLElement | null>(null);
const sliderProgress = ref(0);
const isPrevDisabled = ref(true);
const isNextDisabled = ref(false);

const updateSliderState = () => {
    const el = reportsSliderRef.value;
    if (!el) {
        sliderProgress.value = 0;
        isPrevDisabled.value = true;
        isNextDisabled.value = true;
        return;
    }

    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    const left = el.scrollLeft;

    sliderProgress.value = max === 0 ? 100 : Math.round((left / max) * 100);
    isPrevDisabled.value = left <= 2;
    isNextDisabled.value = left >= max - 2;
};

const scrollReports = (dir: "left" | "right") => {
    const el = reportsSliderRef.value;
    if (!el) {
        return;
    }

    const amount = Math.max(220, Math.round(el.clientWidth * 0.7));
    el.scrollTo({
        left: dir === "left" ? el.scrollLeft - amount : el.scrollLeft + amount,
        behavior: "smooth",
    });
};

const selectReportWithAnimation = (id: string) => {
    reportsStore.setSelectedReportId(id);
    nextTick(() => {
        const el = reportsSliderRef.value;
        if (!el) {
            return;
        }
        const btn = el.querySelector<HTMLButtonElement>(
            `[data-report-id="${id}"]`,
        );
        if (btn) {
            btn.classList.remove("report-chip--pulse");
            void btn.offsetWidth;
            btn.classList.add("report-chip--pulse");
        }
    });
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
            description: "Заполни информацию о компании, чтобы получить полный отчет.",
        });
    }

    if (hasDescription && !hasResources) {
        toast.warning("Будет создан отчет: только рекомендации", {
            description: "Добавь хотя бы один ресурс, чтобы получить метрики.",
        });
    }

    try {
        await reportsStore.generateReport(companyId.value);
        nextTick(() => updateSliderState());
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

const renderMarkdown = (value: string | null | undefined) => {
    if (!value || !value.trim()) {
        return "";
    }

    return marked.parse(value, {
        breaks: true,
        gfm: true,
    }) as string;
};

const formatCreatedAt = (value: string) => {
    const time = Date.parse(value);
    if (!Number.isFinite(time)) {
        return value;
    }
    return new Date(time).toLocaleString();
};

const formatShortDate = (value: string) => {
    const time = Date.parse(value);
    if (!Number.isFinite(time)) {
        return value;
    }
    return new Date(time).toLocaleDateString();
};

const metricPercent = (metric: ReportMetricDto) => {
    const min = metric.minValue;
    const max = metric.maxValue;
    const val = metric.currentValue;

    if (
        !Number.isFinite(min) ||
        !Number.isFinite(max) ||
        max <= min ||
        !Number.isFinite(val)
    ) {
        return 0;
    }

    const clamped = Math.min(max, Math.max(min, val));
    const ratio = (clamped - min) / (max - min);
    return Math.max(0, Math.min(100, Math.round(ratio * 100)));
};

const metricBarWidth = (metric: ReportMetricDto) => {
    return `${metricPercent(metric)}%`;
};

const metricScaleTicks = [0, 25, 50, 75, 100] as const;

const formatMetricValue = (value: number, postfix?: string) => {
    const normalized = Number.isInteger(value)
        ? String(value)
        : value
              .toFixed(2)
              .replace(/\.00$/, "")
              .replace(/(\.\d)0$/, "$1");

    return postfix ? `${normalized} ${postfix}` : normalized;
};

const metricFillClass = (pct: number) => {
    if (pct < 35) return "bg-destructive/80";
    if (pct < 70) return "bg-primary/70";
    return "bg-primary";
};

const metricBadgeClass = (pct: number) => {
    if (pct < 35) return "border-destructive/40 bg-destructive/10 text-destructive";
    if (pct < 70) return "border-primary/30 bg-primary/10 text-primary";
    return "border-primary/40 bg-primary/15 text-primary";
};

const resourceTypeIcon = (type: string) => {
    if (type === "SITE") return Globe;
    if (type === "TELEGRAM") return Send;
    if (type === "VK") return MessageCircle;
    return Globe;
};

const reportTypeLabel = (type: string) => {
    if (type === "full") return "Полный отчет";
    if (type === "metrics-only") return "Только метрики";
    if (type === "advices-only") return "Только рекомендации";
    return type;
};

onMounted(async () => {
    await Promise.all([
        reportsStore.fetchReports(companyId.value),
        fetchCompanyResources(),
        fetchCompanyDescription(),
    ]);
    nextTick(() => updateSliderState());
});

watch(companyId, async () => {
    reportsStore.clear();
    await Promise.all([
        reportsStore.fetchReports(companyId.value),
        fetchCompanyResources(),
        fetchCompanyDescription(),
    ]);
    nextTick(() => updateSliderState());
});

onMounted(() => {
    const el = reportsSliderRef.value;
    if (!el) {
        return;
    }
    el.addEventListener("scroll", updateSliderState, { passive: true });
    updateSliderState();
});

watch(
    () => reportsStore.sortedReports.length,
    async () => {
        await nextTick();
        updateSliderState();
    },
);

definePageMeta({
    middleware: "auth",
});
</script>

<style scoped>
.reports-slider {
    scrollbar-width: none;
}
.reports-slider::-webkit-scrollbar {
    display: none;
}

.report-chip {
    transition:
        transform 180ms ease,
        box-shadow 180ms ease,
        border-color 180ms ease;
}
.report-chip:hover {
    transform: translateY(-1px);
}
.report-chip--active {
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.18);
}
.report-chip--pulse {
    animation: reportChipPulse 420ms ease-out;
}

@keyframes reportChipPulse {
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgb(59 130 246 / 0);
    }
    55% {
        transform: scale(1.03);
        box-shadow: 0 0 0 6px rgb(59 130 246 / 0.18);
    }
    100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgb(59 130 246 / 0);
    }
}

.report-fade-enter-active,
.report-fade-leave-active {
    transition:
        opacity 180ms ease,
        transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}
.report-fade-enter-from,
.report-fade-leave-to {
    opacity: 0;
    transform: translateY(6px);
}
.report-fade-enter-to,
.report-fade-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.report-markdown :deep(p) {
    margin-top: 0.35rem;
    line-height: 1.5;
}

.report-markdown :deep(ul),
.report-markdown :deep(ol) {
    margin-top: 0.35rem;
    margin-left: 1rem;
}

.report-markdown :deep(li) {
    margin-top: 0.15rem;
}

.report-markdown :deep(strong) {
    color: hsl(var(--foreground));
    font-weight: 600;
}
</style>
