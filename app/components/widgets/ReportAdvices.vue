<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { ReportAdvicesDto, ReportOutDto } from "~/repositories/reports.repository";
import { ChevronDown } from "lucide-vue-next";
import { marked } from "marked";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

const props = defineProps<{
    report: ReportOutDto;
    class?: HTMLAttributes["class"];
}>();

const defaultOpenState = () => ({
    analysis: true,
    mistakes: true,
    recommendations: true,
});

onMounted(() => console.log(props.report.advices))

const adviceSectionOpenState = ref<Record<string, boolean>>(defaultOpenState());

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
    if (!value || !value.trim()) {
        return "";
    }

    return marked.parse(value, {
        breaks: true,
        gfm: true,
    }) as string;
};

watch(
    () => props.report.id,
    () => {
        adviceSectionOpenState.value = defaultOpenState();
    },
);
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
                                    <ChevronDown
                                        class="size-4 transition-transform"
                                        :class="{
                                            'rotate-180': isAdviceSectionOpen(section.id),
                                        }"
                                    />
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
            v-else
            class="rounded-lg border border-border/60 bg-card p-4"
        >
            <p class="text-sm text-muted-foreground">
                Для этого отчета нет текстовых рекомендаций.
            </p>
        </div>
    </div>
</template>

<style scoped>
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
