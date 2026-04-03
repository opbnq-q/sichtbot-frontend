<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <UiButton variant="outline" :class="['min-w-36 justify-between', props.buttonClass]" :disabled="props.disabled">
        <span class="inline-flex items-center gap-2">
          <component :is="currentIcon" class="size-4" />
          {{ currentLabel }}
        </span>
        <ChevronDown class="size-4 opacity-70" />
      </UiButton>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="start" class="w-44">
      <DropdownMenuItem
        v-for="option in options"
        :key="option.type"
        @select="() => emits('update:modelValue', option.type)"
      >
        <span class="inline-flex items-center gap-2">
          <component :is="option.icon" class="size-4" />
          {{ option.label }}
        </span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script lang="ts" setup>
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EResourceType } from '~/repositories/resources.repository'
import { ChevronDown, Globe, MessageCircle, Send } from 'lucide-vue-next'

interface Props {
  modelValue: EResourceType
  disabled?: boolean
  buttonClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  buttonClass: '',
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: EResourceType): void
}>()

const options = [
  { type: EResourceType.SITE, label: 'Сайт', icon: Globe },
  { type: EResourceType.TELEGRAM, label: 'Telegram', icon: Send },
  { type: EResourceType.VK, label: 'VK', icon: MessageCircle },
]

const currentOption = computed(() =>
  options.find((option) => option.type === props.modelValue) ?? options[0]
)

const currentLabel = computed(() => currentOption.value?.label)
const currentIcon = computed(() => currentOption.value?.icon)
</script>
