<script setup lang="ts">
interface Props {
  to: string
  label: string
  active?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
})
</script>

<template>
  <NuxtLink
    :to="props.to"
    class="inline-flex h-8 items-center rounded-md px-3 text-sm font-medium transition-colors duration-200"
    :class="
      props.active
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    "
  >
    {{ props.label }}
  </NuxtLink>
</template>