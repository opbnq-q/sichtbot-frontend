<template>
    <UiCard class="overflow-hidden border-border/60">
        <UiCardHeader class="px-4 py-2 md:px-5">
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="space-y-1">
                    <div class="flex items-center gap-2">
                        <UiCardTitle>Отчеты</UiCardTitle>
                        <Badge variant="secondary">{{ props.reports.length }}</Badge>
                    </div>
                </div>

                <div class="flex items-center gap-1 rounded-lg border border-border/50 bg-muted/40 p-1">
                    <UiButton
                        variant="outline"
                        size="icon-sm"
                        class="bg-background/80"
                        aria-label="Влево"
                        :disabled="isPrevDisabled"
                        @click="scrollReports('left')"
                    >
                        <ChevronLeft class="size-4" />
                    </UiButton>

                    <UiButton
                        variant="outline"
                        size="icon-sm"
                        class="bg-background/80"
                        aria-label="Вправо"
                        :disabled="isNextDisabled"
                        @click="scrollReports('right')"
                    >
                        <ChevronRight class="size-4" />
                    </UiButton>
                </div>
            </div>
        </UiCardHeader>

        <UiCardContent class="px-4 py-2 md:px-5">
            <div
                v-if="props.reports.length === 0"
                class="rounded-lg border border-border/60 bg-card/80 p-4"
            >
                <p class="text-sm text-muted-foreground">Пока нет отчетов.</p>
            </div>

            <div v-else>
                <div
                    ref="reportsSliderRef"
                    class="reports-slider flex gap-1.5 overflow-x-auto pb-1"
                >
                    <UiButton
                        v-for="(report, index) in reportButtons"
                        :key="report.id"
                        :data-report-id="report.id"
                        variant="outline"
                        size="sm"
                        class="h-auto min-w-38 shrink-0 justify-start rounded-lg px-3 py-2 report-chip"
                        :class="{
                            'border-primary text-primary report-chip--active':
                                props.selectedReportId === report.id,
                        }"
                        @click="selectReportWithAnimation(report.id)"
                    >
                        <div
                            class="flex min-w-0 flex-col items-start gap-0.5 text-left leading-tight"
                        >
                            <span class="font-medium"
                                >Отчет №{{ reportNumber(index) }}</span
                            >
                            <span class="text-xs text-muted-foreground">
                                {{ formatShortDate(report.createdAt) }}
                            </span>
                        </div>
                    </UiButton>
                </div>

                <div class="mt-1 h-1.5 w-full rounded-full bg-muted/60">
                    <div
                        class="h-full rounded-full bg-primary transition-[width,transform] duration-300 ease-out"
                        :style="{
                            width: `${sliderProgress}%`,
                        }"
                    />
                </div>
            </div>
        </UiCardContent>
    </UiCard>
</template>

<script setup lang="ts">
import type { ReportOutDto } from "~/repositories/reports.repository";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";

const props = defineProps<{
    reports: ReportOutDto[];
    selectedReportId: string | null;
}>();

const emit = defineEmits<{
    (event: "select", id: string): void;
}>();

const reportButtons = computed(() => props.reports.slice().reverse());
const reportNumber = (index: number) => reportButtons.value.length - index;

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

const pulseSelectedButton = (id: string) => {
    const el = reportsSliderRef.value;
    if (!el) {
        return;
    }

    const btn = el.querySelector<HTMLButtonElement>(`[data-report-id="${id}"]`);
    if (!btn) {
        return;
    }

    btn.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
    });

    btn.classList.remove("report-chip--pulse");
    void btn.offsetWidth;
    btn.classList.add("report-chip--pulse");
};

const selectReportWithAnimation = async (id: string) => {
    emit("select", id);
    await nextTick();
    pulseSelectedButton(id);
    updateSliderState();
};

const formatShortDate = (value: string) => {
    const time = Date.parse(value);
    if (!Number.isFinite(time)) {
        return value;
    }
    return new Date(time).toLocaleDateString();
};

onMounted(() => {
    const el = reportsSliderRef.value;
    if (!el) {
        updateSliderState();
        return;
    }

    el.addEventListener("scroll", updateSliderState, { passive: true });
    updateSliderState();
});

onUnmounted(() => {
    reportsSliderRef.value?.removeEventListener("scroll", updateSliderState);
});

watch(
    () => props.reports.length,
    async () => {
        await nextTick();
        updateSliderState();
    },
);

watch(
    () => props.selectedReportId,
    async (id) => {
        await nextTick();
        updateSliderState();

        if (id) {
            pulseSelectedButton(id);
        }
    },
);
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
        border-color 180ms ease,
        background-color 180ms ease;
}
.report-chip:hover {
    transform: translateY(-2px);
}
.report-chip--active {
    background: hsl(var(--accent));
    box-shadow: 0 0 0 2px hsl(var(--primary) / 0.25);
}
.report-chip--pulse {
    animation: reportChipPulse 420ms ease-out;
}

@keyframes reportChipPulse {
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 hsl(var(--primary) / 0);
    }
    55% {
        transform: scale(1.03);
        box-shadow: 0 0 0 6px hsl(var(--primary) / 0.18);
    }
    100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 hsl(var(--primary) / 0);
    }
}
</style>
