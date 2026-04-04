<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { ReportMetricDto, ReportOutDto } from "~/repositories/reports.repository";
import {
    type ResourceOut,
    EResourceType,
} from "~/repositories/resources.repository";
import { Globe, MessageCircle, Send } from "lucide-vue-next";

const props = defineProps<{
    report: ReportOutDto;
    companyResources?: ResourceOut[];
    class?: HTMLAttributes["class"];
}>();

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
        ? (props.companyResources ?? []).find((r) => r.type === type)
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

const resourceTypeIcon = (type: string) => {
    if (type === "SITE") return Globe;
    if (type === "TELEGRAM") return Send;
    if (type === "VK") return MessageCircle;
    return Globe;
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

const formatMetricValue = (value: number, postfix?: string) => {
    const normalized = Number.isInteger(value)
        ? String(value)
        : value
              .toFixed(2)
              .replace(/\.00$/, "")
              .replace(/(\.\d)0$/, "$1");

    return postfix ? `${normalized} ${postfix}` : normalized;
};

const formatMetricAxisValue = (value: number) => {
    return Number.isInteger(value)
        ? String(value)
        : value
              .toFixed(2)
              .replace(/\.00$/, "")
              .replace(/(\.\d)0$/, "$1");
};

const metricScaleTickValues = (metric: ReportMetricDto) => {
    const min = metric.minValue;
    const max = metric.maxValue;

    if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) {
        return [0, 25, 50, 75, 100];
    }

    const step = (max - min) / 4;
    return [0, 1, 2, 3, 4].map((index) => min + step * index);
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
</script>

<template>
    <div :class="props.class">
        <div v-if="report.resources && report.resources.length > 0" class="space-y-3">
            <div
                v-for="resource in report.resources"
                :key="resource.resourceType"
                class="rounded-md border border-border/50 bg-background/40 p-3"
            >
                <div class="flex flex-wrap items-center gap-2 min-w-0">
                    <component
                        :is="resourceTypeIcon(resource.resourceType)"
                        class="size-4 shrink-0 text-muted-foreground"
                    />

                    <p class="truncate text-sm font-medium text-foreground">
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

                <div class="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div
                        v-for="metric in resource.metrics"
                        :key="metric.id"
                        class="flex h-full flex-col rounded-md border border-border/60 bg-card p-3"
                    >
                        <div class="flex items-start justify-between gap-2">
                            <p
                                class="text-sm font-medium leading-snug text-foreground"
                            >
                                {{ metric.title }}
                            </p>

                            <p
                                class="shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium"
                                :class="metricBadgeClass(metricPercent(metric))"
                            >
                                {{ metricPercent(metric) }}%
                            </p>
                        </div>

                        <div class="mt-2 flex items-center justify-between gap-3 text-xs">
                            <div class="min-w-0">
                                <p class="text-[11px] text-muted-foreground">Значение</p>
                                <p class="truncate font-medium text-foreground">
                                    {{
                                        formatMetricValue(
                                            metric.currentValue,
                                            metric.postfix,
                                        )
                                    }}
                                </p>
                            </div>
                        </div>

                        <div
                            class="relative mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted"
                        >
                            <div
                                class="h-full rounded-full metric-bar transition-[width] duration-500 ease-out"
                                :class="metricFillClass(metricPercent(metric))"
                                :style="{ width: metricBarWidth(metric) }"
                            />
                        </div>

                        <div
                            class="mt-1.5 grid grid-cols-5 text-[10px] text-muted-foreground"
                        >
                            <span
                                v-for="tick in metricScaleTickValues(metric)"
                                :key="`${metric.id}-${tick}`"
                                class="text-center first:text-left last:text-right"
                            >
                                {{ formatMetricAxisValue(tick) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-else-if="report.reportType === 'metrics-only'"
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
</template>