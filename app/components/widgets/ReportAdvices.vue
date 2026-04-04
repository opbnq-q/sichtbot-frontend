<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { ReportOutDto, ReportAdvicesDto } from "~/repositories/reports.repository";
import { marked } from "marked";
import { cn } from "@/lib/utils";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

const props = defineProps<{
    report: ReportOutDto;
    class?: HTMLAttributes["class"];
}>();

const adviceSectionOpenState = ref<Record<string, boolean>>({
    analysis: true,
    mistakes: true,
    recommendations: true,
});

const isAdviceContentVisible = (value: string | null | undefined) => {
    if (!value || !value.trim()) {
        return false;
    }

    const normalized = value.trim().toLowerCase();
    return !normalized.startsWith("ошибка генерации");
};

const adviceSections = (advices: ReportAdvicesDto) => {
    return [
        {
            id: "analysis",
            title: "Детальный анализ",
            content: advices.analysis,
        },
        {
            id: "mistakes",
            title: "Ошибки",
            content: advices.mistakes,
        },
        {
            id: "recommendations",
            title: "Рекомендации",
            content: advices.recommendations,
        },
    ].filter((section) => isAdviceContentVisible(section.content));
};

const adviceSectionsForSelectedReport = computed(() => {
    if (!props.report.advices) {
        return [];
    }
    return adviceSections(props.report.advices);
});

const isAdviceSectionOpen = (sectionId: string) => {
    return adviceSectionOpenState.value[sectionId] ?? true;
};

const setAdviceSectionOpen = (sectionId: string, isOpen: boolean) => {
    adviceSectionOpenState.value = {
        ...adviceSectionOpenState.value,
        [sectionId]: isOpen,
    };
};

const renderMarkdown = (value: string | null | undefined) => {
    if (!value) return "";
    try {
        const raw = marked.parse(value);
        return typeof raw === "string" ? raw : "";
    } catch {
        return value;
    }
};
</script>

<template>
    <div :class="props.class">
        <UiCard v-if="report.advices" class="border-border/60">
            <UiCardHeader class="px-4 py-3">
                <UiCardTitle class="text-sm">Результаты и рекомендации</UiCardTitle>
            </UiCardHeader>

            <UiSeparator />

            <UiCardContent
                v-if="adviceSectionsForSelectedReport.length > 0"
                class="px-4 py-0"
            >
                <section
                    v-for="(section, index) in adviceSectionsForSelectedReport"
                    :key="section.id"
                    class="py-3"
                >
                    <Collapsible
                        :open="isAdviceSectionOpen(section.id)"
                        @update:open="(value: boolean) => setAdviceSectionOpen(section.id, value)"
                    >
                        <div class="flex items-center justify-between gap-2">
                            <p class="text-xs text-muted-foreground">
                                {{ section.title }}
                            </p>

                            <CollapsibleTrigger as-child>
                                <UiButton
                                    variant="ghost"
                                    size="icon-sm"
                                    type="button"
                                    class="size-7"
                                >
                                    <div
                                        class="size-4 transition-transform duration-200"
                                        :class="{ 'rotate-180': isAdviceSectionOpen(section.id) }"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                    </div>
                                </UiButton>
                            </CollapsibleTrigger>
                        </div>

                        <CollapsibleContent>
                            <div
                                class="mt-2 text-base text-foreground report-markdown"
                                v-html="renderMarkdown(section.content)"
                            />
                        </CollapsibleContent>
                    </Collapsible>

                    <UiSeparator
                        v-if="index < adviceSectionsForSelectedReport.length - 1"
                        class="mt-3"
                    />
                </section>
            </UiCardContent>
        </UiCard>

        <div
            v-else-if="!report.advices || (adviceSectionsForSelectedReport.length === 0 && report.reportType !== 'metrics-only')"
            class="rounded-lg border border-border/60 bg-card p-4"
        >
            <p class="text-sm text-muted-foreground">
                Для этого отчета нет текстовых рекомендаций.
            </p>
        </div>
    </div>
</template>
