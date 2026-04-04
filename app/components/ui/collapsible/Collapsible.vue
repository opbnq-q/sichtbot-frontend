<script setup lang="ts">
import type { CollapsibleRootProps, CollapsibleRootEmits } from "reka-ui"
import { CollapsibleRoot } from "reka-ui"

const props = defineProps<CollapsibleRootProps>()
const emits = defineEmits<CollapsibleRootEmits>()
</script>

<template>
  <CollapsibleRoot
    data-slot="collapsible"
    v-bind="props"
    @update:open="(value) => emits('update:open', value)"
  >
    <slot />
  </CollapsibleRoot>
</template>
