<template>
  <section class="rounded-2xl border border-border/70 bg-card/65 p-4 shadow-sm backdrop-blur md:p-8">
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
        <KitAdvantageCard
          title="AI-анализ"
          description="Модель выявляет тренды, аномалии и точки роста, помогает быстро понять, где проседают показатели и что даст наибольший эффект."
          detail="Детализированный анализ включает предиктивную аналитику, выявление неочевидных паттернов поведения пользователей и автоматическое формирование отчетов об аномалиях в метриках в режиме реального времени."
          @open="(title, detail) => emits('openDialog', title, detail)"
        />

        <KitAdvantageCard
          title="SEO-анализ"
          description="SEO — это поисковая оптимизация сайта. SichtBot подсказывает, как улучшить видимость в поиске и увеличить органический трафик."
          detail="Инструмент непрерывно мониторит позиции сайта по ключевым запросам, анализирует семантику конкурентов, проверяет техническое состояние ресурса и генерирует готовые к внедрению рекомендации по On-Page SEO."
          @open="(title, detail) => emits('openDialog', title, detail)"
        />

        <KitAdvantageCard
          title="Сбор данных из разных провайдеров"
          description="Платформа собирает и синхронизирует данные из Telegram, Яндекс, вашего сайта, ВК и других источников, чтобы вы работали с единой аналитикой."
          detail="Единый хаб для всех интеграций: безопасное управление API-ключами, автоматическая синхронизация данных каждые 15 минут, возможность создания кросс-канальных отчетов (например, сопоставление затрат в Яндекс.Директ с продажами из Telegram-бота)."
          :tags="providerTags"
          full-width
          @open="(title, detail) => emits('openDialog', title, detail)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const emits = defineEmits<{
  (e: 'openDialog', title: string, detail: string): void
}>()

const providerTags = ['Telegram', 'Яндекс', 'Сайт', 'ВК', 'Другие провайдеры']
</script>
