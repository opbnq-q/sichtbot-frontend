<template>
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
        <UiButton
          id="demo-btn"
          size="lg"
          class="cursor-interactive group transition-all duration-300 active:scale-95"
          @click="navigateTo('/dashboard')"
        >
          Открыть дашборд
        </UiButton>
      </div>
    </div>
  </section>
</template>
