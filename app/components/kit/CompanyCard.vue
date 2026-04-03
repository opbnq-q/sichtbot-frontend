<template>
  <UiCard class="relative isolate h-full overflow-hidden border-border/70 bg-card/90 p-4 backdrop-blur">
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -top-10 left-1/2 z-0 h-24 w-56 -translate-x-1/2 rounded-full bg-linear-to-br from-primary/30 via-primary/10 to-transparent opacity-35 blur-2xl"
    />
    <div
      aria-hidden="true"
      class="pointer-events-none absolute top-8 -right-10 z-0 h-28 w-52 rounded-full bg-linear-to-bl from-accent/35 via-accent/10 to-transparent opacity-20 blur-3xl"
    />
    <div aria-hidden="true" class="company-grain pointer-events-none absolute inset-0 z-0 opacity-12" />

    <div class="relative z-10 flex h-full flex-col gap-4">
      <div class="space-y-2">
        <UiCardTitle>{{ props.title }}</UiCardTitle>
        <UiCardDescription v-if="hasDescription">{{ props.description }}</UiCardDescription>
        <p
          v-if="hasSummary"
          class="truncate rounded-md border border-border/40 text-primary px-2 py-1 text-sm italic"
          :title="props.summary"
        >
          {{ props.summary }}
        </p>
      </div>
      <UiCardAction class="mt-auto flex justify-end">
        <div class="flex flex-wrap justify-end gap-2">
          <UiButton size="sm" @click="navigateTo(`/dashboard/${props.id}`)">Открыть панель</UiButton>
          <UiButton
            variant="secondary"
            size="sm"
            :disabled="props.isDeleting"
            @click="emits('delete')"
          >
            Удалить
          </UiButton>
        </div>
      </UiCardAction>
    </div>
  </UiCard>
</template>

<script lang="ts" setup>
interface Props {
  id?: string
  title?: string
  description?: string
  summary?: string
  isDeleting?: boolean
}

const emits = defineEmits<{
  (e: 'delete'): void
}>()

const props = withDefaults(defineProps<Props>(), {
  id: '1',
  title: 'Company title',
  description: 'Company description',
  summary: 'Short company summary',
  isDeleting: false,
})

const hasDescription = computed(() => Boolean(props.description?.trim()))
const hasSummary = computed(() => Boolean(props.summary?.trim()))
</script>

<style scoped>
.company-grain {
  background-image:
    radial-gradient(circle at 25% 35%, rgb(255 255 255 / 0.12) 0 0.8px, transparent 1.2px),
    radial-gradient(circle at 72% 62%, rgb(255 255 255 / 0.08) 0 0.9px, transparent 1.3px),
    radial-gradient(circle at 45% 82%, rgb(0 0 0 / 0.12) 0 1px, transparent 1.4px);
  background-size: 3px 3px, 4px 4px, 5px 5px;
  mix-blend-mode: soft-light;
}
</style>
