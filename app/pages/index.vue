<template>
    <div class="relative isolate overflow-hidden">
        <div
            aria-hidden="true"
            class="interactive-bottom-bg pointer-events-none fixed inset-x-0 -bottom-10 z-0 h-72"
        />

        <div class="relative z-10 space-y-6">
    <section class="relative isolate overflow-hidden rounded-2xl border border-border/70 bg-card/70 px-6 py-14 shadow-sm backdrop-blur md:px-10 md:py-20">
        <div
            aria-hidden="true"
            class="pointer-events-none absolute -top-20 left-1/2 z-0 h-64 w-[48rem] -translate-x-1/2 rounded-full bg-linear-to-r from-primary/25 via-accent/20 to-primary/15 blur-3xl"
        />
        <div aria-hidden="true" class="hero-grain pointer-events-none absolute inset-0 z-0 opacity-20" />

        <div class="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
            <p class="mb-4 rounded-full border border-border/60 bg-background/55 px-4 py-1 text-xs font-medium text-muted-foreground">
                AI-помощник для бизнеса
            </p>

            <h1 class="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Управляйте компанией быстрее
                <span class="bg-linear-to-r from-blue-500 via-indigo-300 to-blue-500 bg-clip-text text-transparent">
                    с умной аналитикой
                </span>
            </h1>

            <p class="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
                SichtBot помогает вести интернет-деятельность: собирает ключевые метрики, подсказывает точки роста и поддерживает принятие решений на основе данных.
            </p>

            <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
                <UiButton size="lg" @click="navigateTo('/dashboard')">
                    Открыть дашборд
                </UiButton>
            </div>
        </div>
    </section>

        <section class="rounded-2xl border border-border/70 bg-card/65 p-6 shadow-sm backdrop-blur md:p-8">
            <div class="mx-auto max-w-5xl space-y-6">
                <div class="space-y-2">
                    <h2 class="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                        Полная картина интернет-деятельности в одном месте
                    </h2>
                    <p class="text-sm text-muted-foreground md:text-base">
                        SichtBot объединяет данные из разных каналов, анализирует их с помощью AI и показывает понятные рекомендации для роста бизнеса.
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <UiCard class="border-border/60 bg-card/80 p-4">
                        <UiCardTitle>AI-анализ</UiCardTitle>
                        <UiCardDescription>
                            Модель выявляет тренды, аномалии и точки роста, помогает быстро понять, где проседают показатели и что даст наибольший эффект.
                        </UiCardDescription>
                    </UiCard>

                    <UiCard class="border-border/60 bg-card/80 p-4">
                        <UiCardTitle>SEO-анализ</UiCardTitle>
                        <UiCardDescription>
                            SEO (Search Engine Optimization) — это поисковая оптимизация сайта. SichtBot подсказывает, как улучшить видимость в поиске и увеличить органический трафик.
                        </UiCardDescription>
                    </UiCard>

                    <UiCard class="border-border/60 bg-card/80 p-4 md:col-span-2">
                        <UiCardTitle>Сбор данных из разных провайдеров</UiCardTitle>
                        <UiCardDescription>
                            Платформа собирает и синхронизирует данные из Telegram, Яндекс, вашего сайта, ВК и других подключённых источников, чтобы вы работали с единой аналитикой.
                        </UiCardDescription>
                        <div class="mt-3 flex flex-wrap gap-2">
                            <span class="rounded-md border border-border/60 bg-background/60 px-2 py-1 text-xs text-muted-foreground">Telegram</span>
                            <span class="rounded-md border border-border/60 bg-background/60 px-2 py-1 text-xs text-muted-foreground">Яндекс</span>
                            <span class="rounded-md border border-border/60 bg-background/60 px-2 py-1 text-xs text-muted-foreground">Сайт</span>
                            <span class="rounded-md border border-border/60 bg-background/60 px-2 py-1 text-xs text-muted-foreground">ВК</span>
                            <span class="rounded-md border border-border/60 bg-background/60 px-2 py-1 text-xs text-muted-foreground">Другие провайдеры</span>
                        </div>
                    </UiCard>
                </div>
            </div>
        </section>
        </div>
    </div>

</template>

<script setup lang="ts">
definePageMeta({
    middleware: 'auth'
})
</script>

<style scoped>
.interactive-bottom-bg {
        background:
            radial-gradient(24% 30% at 50% 62%, rgb(250 204 21 / 0.32), transparent 66%),
            radial-gradient(42% 50% at 48% 56%, rgb(34 211 238 / 0.3), transparent 64%),
            radial-gradient(32% 40% at 58% 62%, rgb(99 102 241 / 0.24), transparent 68%),
        conic-gradient(from 180deg at 50% 78%, rgb(34 211 238 / 0.34), rgb(99 102 241 / 0.28), rgb(244 63 94 / 0.26), rgb(34 211 238 / 0.34));
        background-repeat: no-repeat;
        background-position: center bottom;
        filter: blur(32px) saturate(115%);
        -webkit-mask-image: radial-gradient(ellipse 72% 90% at 50% 72%,
            rgb(0 0 0 / 0.98) 14%,
            rgb(0 0 0 / 0.8) 30%,
            rgb(0 0 0 / 0.52) 46%,
            rgb(0 0 0 / 0.24) 60%,
            rgb(0 0 0 / 0.07) 74%,
            rgb(0 0 0 / 0) 88%);
        mask-image: radial-gradient(ellipse 72% 90% at 50% 72%,
            rgb(0 0 0 / 0.98) 14%,
            rgb(0 0 0 / 0.8) 30%,
            rgb(0 0 0 / 0.52) 46%,
            rgb(0 0 0 / 0.24) 60%,
            rgb(0 0 0 / 0.07) 74%,
            rgb(0 0 0 / 0) 88%);
        animation: bottomGlowShift 16s ease-in-out infinite alternate, bottomColorDrift 20s ease-in-out infinite;
}

.interactive-bottom-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
            radial-gradient(circle at 18% 24%, rgb(255 255 255 / 0.38) 0 0.95px, transparent 1.25px),
            radial-gradient(circle at 66% 62%, rgb(255 255 255 / 0.3) 0 1.05px, transparent 1.35px),
            radial-gradient(circle at 42% 78%, rgb(0 0 0 / 0.3) 0 1.15px, transparent 1.45px),
            radial-gradient(circle at 55% 38%, rgb(255 255 255 / 0.22) 0 0.85px, transparent 1.15px);
        background-size: 2px 2px, 3px 3px, 4px 4px, 2px 2px;
        mix-blend-mode: overlay;
        opacity: 0.62;
        filter: blur(0.45px);
        -webkit-mask-image: radial-gradient(ellipse 70% 88% at 50% 70%, rgb(0 0 0 / 1) 22%, rgb(0 0 0 / 0.5) 44%, rgb(0 0 0 / 0.14) 60%, rgb(0 0 0 / 0) 78%);
        mask-image: radial-gradient(ellipse 70% 88% at 50% 70%, rgb(0 0 0 / 1) 22%, rgb(0 0 0 / 0.5) 44%, rgb(0 0 0 / 0.14) 60%, rgb(0 0 0 / 0) 78%);
    animation: bottomGrainShift 12s linear infinite;
}

.interactive-bottom-bg::after {
        content: '';
        position: absolute;
        inset: 0;
        background-image:
            linear-gradient(to right, rgb(255 255 255 / 0.14) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(255 255 255 / 0.14) 1px, transparent 1px);
        background-size: 24px 24px;
        mix-blend-mode: soft-light;
        opacity: 0.2;
        filter: blur(1px);
        -webkit-mask-image: radial-gradient(ellipse 68% 86% at 50% 70%, rgb(0 0 0 / 1) 18%, rgb(0 0 0 / 0.48) 40%, rgb(0 0 0 / 0.12) 58%, rgb(0 0 0 / 0) 78%);
        mask-image: radial-gradient(ellipse 68% 86% at 50% 70%, rgb(0 0 0 / 1) 18%, rgb(0 0 0 / 0.48) 40%, rgb(0 0 0 / 0.12) 58%, rgb(0 0 0 / 0) 78%);
        animation: bottomGridShift 14s linear infinite;
}

.hero-grain {
    background-image:
        radial-gradient(circle at 20% 30%, rgb(255 255 255 / 0.12) 0 0.8px, transparent 1.2px),
        radial-gradient(circle at 70% 60%, rgb(255 255 255 / 0.08) 0 0.9px, transparent 1.3px),
        radial-gradient(circle at 45% 82%, rgb(0 0 0 / 0.12) 0 1px, transparent 1.4px);
    background-size: 3px 3px, 4px 4px, 5px 5px;
    mix-blend-mode: soft-light;
}

@keyframes bottomGlowShift {
        0% {
                transform: translateY(8px) scale(0.98);
        }
        100% {
                transform: translateY(-4px) scale(1.03);
        }
}

@keyframes bottomColorDrift {
    0%,
    100% {
        background-position: 50% 62%, 48% 60%, 58% 64%, center bottom;
    }
    50% {
        background-position: 52% 60%, 52% 56%, 54% 68%, center bottom;
    }
}

@keyframes bottomGridShift {
        0% {
                background-position: 0 0, 0 0;
        }
        100% {
                background-position: 24px 0, 0 24px;
        }
}

@keyframes bottomGrainShift {
    0% {
        background-position: 0 0, 0 0, 0 0;
    }
    100% {
        background-position: 6px 4px, -5px 3px, 4px -6px;
    }
}
</style>