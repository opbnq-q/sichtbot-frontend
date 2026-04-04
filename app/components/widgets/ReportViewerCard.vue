<template>
    <UiCard class="relative overflow-hidden">
        <div
            v-if="props.isGenerating"
            class="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/70 backdrop-blur-[1px]"
        >
            <KitHammerLoadingAnimation />
        </div>

        <UiCardHeader class="px-4 pt-4 pb-3 md:px-6">
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="space-y-1">
                    <div class="flex items-center gap-2">
                        <UiCardTitle>Анализ ресурсов</UiCardTitle>
                        <Badge variant="secondary">{{ getReportTypeTitle(props.report?.reportType ?? 'empty') }}</Badge>
                    </div>
                    <UiCardDescription
                        v-if="props.report"
                        class="text-muted-foreground"
                    >
                        {{ formatCreatedAt(props.report.createdAt) }}
                    </UiCardDescription>
                </div>

                <UiButton
                    variant="outline"
                    size="sm"
                    class="ml-auto"
                    :disabled="!props.report"
                    @click="emit('open-export')"
                >
                    Экспорт
                </UiButton>
            </div>
        </UiCardHeader>

        <UiSeparator />

        <UiCardContent class="px-4 py-4 md:px-6">
            <div v-if="props.isLoading" class="space-y-3 animate-pulse">
                <div class="h-5 w-1/3 rounded-md bg-muted" />
                <div class="h-4 w-full rounded-md bg-muted/80" />
                <div class="h-4 w-4/5 rounded-md bg-muted/70" />
            </div>

            <Transition name="report-fade" mode="out-in">
                <div
                    v-if="!props.report"
                    key="empty"
                    class="rounded-lg border border-border/60 bg-card p-4"
                >
                    <p class="text-sm text-muted-foreground">
                        Нет выбранного отчета. Сформируй новый или выбери из
                        списка ниже.
                    </p>
                </div>

                <div v-else :key="props.report.id" class="space-y-4">
                    <WidgetsReportMetrics
                    :report="props.report"
                    :company-resources="props.companyResources"
                    />
                    <WidgetsReportAdvices :report="props.report" />
                </div>
            </Transition>
        </UiCardContent>
    </UiCard>
</template>

<script setup lang="ts">
import type { ReportOutDto } from "~/repositories/reports.repository";
import type { ResourceOut } from "~/repositories/resources.repository";
import { Badge } from "@/components/ui/badge";

const props = defineProps<{
    report: ReportOutDto | null;
    isGenerating: boolean;
    isLoading: boolean;
    companyResources: ResourceOut[];
}>();

const emit = defineEmits<{
    (event: "open-export"): void;
}>();

const formatCreatedAt = (value: string) => {
    const time = Date.parse(value);
    if (!Number.isFinite(time)) {
        return value;
    }
    return new Date(time).toLocaleString();
};
</script>

<style scoped>
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
</style>
