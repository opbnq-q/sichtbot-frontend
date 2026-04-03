<template>
  <UiCard
    class="cursor-interactive cursor-pointer relative z-20 border-border/60 bg-card/80 p-4 transition-all duration-300 hover:border-primary/50 hover:bg-card"
    :class="{ 'md:col-span-2': props.fullWidth }"
    @click="emits('open', props.title, props.detail)"
  >
    <UiCardTitle>{{ props.title }}</UiCardTitle>
    <UiCardDescription>
      {{ props.description }}
    </UiCardDescription>

    <div v-if="props.tags?.length" class="mt-3 flex flex-wrap gap-2">
      <span
        v-for="tag in props.tags"
        :key="tag"
        class="rounded-md border border-border/60 bg-background/60 px-2 py-1 text-xs text-muted-foreground"
      >
        {{ tag }}
      </span>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  detail: string
  fullWidth?: boolean
  tags?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  fullWidth: false,
  tags: () => [],
})

const emits = defineEmits<{
  (e: 'open', title: string, detail: string): void
}>()
</script>
