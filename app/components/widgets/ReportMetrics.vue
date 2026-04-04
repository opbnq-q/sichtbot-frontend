<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { ReportOutDto, ReportMetricDto } from "~/repositories/reports.repository";
import { cn } from "@/lib/utils";
import { Globe, Send, MessageCircle } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";

const props = defineProps<{
    report: ReportOutDto;
    class?: HTMLAttributes["class"];
}>();

const resourceMeta = (resource: { resourceType?: string; name?: string; url?: string }) => {
    let name = resource.name ?? "";
    let url = resource.url ?? "";

    if (!name && resource.resourceType) {
        if (resource.resourceType === "SITE") name = "Веб-сайт";
        if (resource.resourceType === "VK") name = "ВКонтакте";
        if (resource.resourceType === "TELEGRAM") name = "Telegram";
    }

    if (!name) name = "Ресурс";

    return { name, url };
};

const resourceTypeIcon = (type: string) => {
    const uc = type?.toUpperCase() ?? "";
    if (uc === "SITE") return Globe;
    if (uc === "TELEGRAM") return Send;
    if (uc === "VK") return MessageCircle;
    return Globe;
};

const metricPercent = (metric: ReportMetricDto) => {
    const min = metric.minValue ?? 0;
    const max = metric.maxValue ?? 100;
    const val = metric.currentValue ?? 0;

    if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min || !Number.isFinite(val)) {
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
        : value.toLocaleString("ru-RU", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 2,
          });

    return postfix ? `${normalized} ${postfix}` : normalized;
};

const formatMetricAxisValue = (value: number) => {
    return Number.isInteger(value)
        ? String(value)
        : value.toLocaleString("ru-RU", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
          });
};

const metricScaleTickValues = (metric: ReportMetricDto) => {
    const min = metric.minValue ?? 0;
    const max = metric.maxValue ?? 100;

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

                <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div
                        v-for="metric in resource.metrics"
                        :key="metric.id"
                        class="rounded-md border border-border/40 bg-card p-3"
                    >
                        <div class="flex items-start justify-between gap-2">
                            <p class="text-sm font-medium leading-none text-foreground">
                                {{ metric.title }}
                            </p>

                            <Badge
                                variant="outline"
                                class="font-mono text-[10px] leading-none tracking-tight h-5 px-1.5"
                                :class="metricBadgeClass(metricPercent(metric))"
                            >
                                {{ metricPercent(metric) }}%
                            </Badge>
                        </div>

                        <div class="mt-1 flex items-baseline gap-1">
                            <p class="text-[10px] text-muted-foreground leading-none">
                                Значение
                            </p>
                            <p class="text-xs font-semibold leading-none text-foreground">
                                {{ formatMetricValue(metric.currentValue, metric.postfix) }}
                            </p>
                        </div>

                        <div class="relative mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                class="h-full rounded-full metric-bar transition-[width] duration-500 ease-out"
                                :class="metricFillClass(metricPercent(metric))"
                                :style="{ width: metricBarWidth(metric) }"
                            />
                        </div>

                        <div class="mt-1.5 grid grid-cols-5 text-[10px] text-muted-foreground">
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