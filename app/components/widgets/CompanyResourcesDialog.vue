<template>
  <Dialog :open="props.open" @update:open="(value) => emits('update:open', value)">
    <DialogTrigger as-child class="w-full">
      <UiButton>
        Ресурсы
      </UiButton>
    </DialogTrigger>

    <DialogContent class="sm:max-w-xl max-h-[80vh] flex flex-col">
      <DialogHeader class="shrink-0">
        <DialogTitle>Цифровые ресурсы компании</DialogTitle>
        <DialogDescription>
          Выберите тип ресурса, укажите название и URL, затем выполните действие рядом с полем.
        </DialogDescription>
      </DialogHeader>

      <div v-if="props.resourcesBusy" class="h-1 w-full shrink-0 overflow-hidden rounded-full bg-muted/60 mt-2">
        <div class="loading-progress h-full w-1/3 rounded-full bg-primary/80" />
      </div>

      <div class="space-y-4 overflow-y-auto pr-2 mt-4 flex-1">
        <div class="grid grid-cols-1 gap-3 rounded-lg border border-border/60 bg-card/80 p-3">
          <KitResourceTypeSelect
            :model-value="props.newResourceType"
            class="w-full"
            :disabled="props.isCreatingResource"
            @update:model-value="(value) => emits('update:newResourceType', value)"
          />

          <UiInput
            :model-value="props.newResourceName"
            class="w-full"
            placeholder="Название ресурса"
            :disabled="props.isCreatingResource"
            @update:model-value="(value) => emits('update:newResourceName', String(value))"
          />

          <UiInput
            :model-value="props.newResourceUrl"
            class="w-full"
            placeholder="URL ресурса"
            :disabled="props.isCreatingResource"
            @update:model-value="(value) => emits('update:newResourceUrl', String(value))"
          />

          <UiButton
            class="w-full"
            v-combinepressed="[Keywords.Ctrl, Keywords.Enter]"
            :disabled="props.isCreatingResource"
            :class="{ 'animate-pulse': props.isCreatingResource }"
            @click="emits('create')"
          >
            <Plus class="mr-1 size-4" />
            {{ props.isCreatingResource ? 'Создание...' : 'Создать' }}
          </UiButton>
        </div>

        <div v-if="!props.resourcesLoading && props.resourceRows.length === 0" class="rounded-lg border border-border/60 bg-card/80 p-3 text-sm text-muted-foreground">
          Ресурсов пока нет.
        </div>

        <div
          v-for="resource in props.resourceRows"
          :key="resource.id"
          class="grid grid-cols-1 gap-3 rounded-lg border border-border/60 bg-card/80 p-3"
        >
          <KitResourceTypeSelect
            :model-value="resource.type"
            class="w-full"
            :disabled="props.isUpdating(resource.id) || props.isDeleting(resource.id)"
            @update:model-value="(value) => emits('update:rowType', resource.id, value)"
          />

          <UiInput
            :model-value="resource.name"
            class="w-full"
            placeholder="Название ресурса"
            :disabled="props.isUpdating(resource.id) || props.isDeleting(resource.id)"
            @update:model-value="(value) => emits('update:rowName', resource.id, String(value))"
          />

          <UiInput
            :model-value="resource.url"
            class="w-full"
            placeholder="URL ресурса"
            :disabled="props.isUpdating(resource.id) || props.isDeleting(resource.id)"
            @update:model-value="(value) => emits('update:rowUrl', resource.id, String(value))"
          />

          <div class="grid grid-cols-2 gap-2 w-full">
            <UiButton
              variant="secondary"
              class="w-full"
              :disabled="props.isUpdating(resource.id) || props.isDeleting(resource.id)"
              :class="{ 'animate-pulse': props.isUpdating(resource.id) }"
              @click="emits('update:row', resource.id)"
            >
              <Save class="mr-1 size-4" />
              {{ props.isUpdating(resource.id) ? 'Сохранение...' : 'Обновить' }}
            </UiButton>

            <UiButton
              variant="outline"
              class="w-full"
              :disabled="props.isDeleting(resource.id) || props.isUpdating(resource.id)"
              :class="{ 'animate-pulse': props.isDeleting(resource.id) }"
              @click="emits('delete:row', resource.id)"
            >
              <Trash2 class="mr-1 size-4" />
              {{ props.isDeleting(resource.id) ? 'Удаление...' : 'Удалить' }}
            </UiButton>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Save, Trash2 } from 'lucide-vue-next'
import { EResourceType } from '~/repositories/resources.repository'
import { Keywords } from '~/types/combinepressed'

export type ResourceRow = {
  id: number
  name: string
  url: string
  type: EResourceType
}

interface Props {
  open: boolean
  resourcesBusy: boolean
  resourcesLoading: boolean
  isCreatingResource: boolean
  newResourceType: EResourceType
  newResourceName: string
  newResourceUrl: string
  resourceRows: ResourceRow[]
  isUpdating: (id: number) => boolean
  isDeleting: (id: number) => boolean
}

const props = defineProps<Props>()

const emits = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'update:newResourceType', value: EResourceType): void
  (e: 'update:newResourceName', value: string): void
  (e: 'update:newResourceUrl', value: string): void
  (e: 'update:rowType', id: number, value: EResourceType): void
  (e: 'update:rowName', id: number, value: string): void
  (e: 'update:rowUrl', id: number, value: string): void
  (e: 'create'): void
  (e: 'update:row', id: number): void
  (e: 'delete:row', id: number): void
}>()
</script>

<style scoped>
.loading-progress {
  animation: loadingBarMove 1s ease-in-out infinite;
}

@keyframes loadingBarMove {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(420%);
  }
}

/* Стили для кастомного скроллбара (опционально) */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: hsl(var(--border) / 0.6);
  border-radius: 20px;
}
</style>