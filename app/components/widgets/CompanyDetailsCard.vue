<template>
  <Collapsible
    :open="!props.isCollapsed"
    @update:open="onCollapseOpenChange"
  >
  <UiCard class="p-4">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="flex flex-col gap-2">
        <UiCardTitle>{{ props.company?.name || `Карточка компании #${props.routeId}` }}</UiCardTitle>
        <UiCardDescription>
          {{ props.isEditing ? 'Режим редактирования' : 'Профиль компании' }}
        </UiCardDescription>
      </div>

      <div class="flex flex-wrap gap-2">
        <UiButton v-if="!props.isCollapsed" variant="secondary" size="sm" @click="emits('toggleEdit')">
          {{ props.isEditing ? 'Отменить' : 'Изменить' }}
        </UiButton>

        <CollapsibleTrigger as-child>
          <UiButton variant="ghost" size="icon" type="button">
            <ChevronDown
              class="size-4 transition-transform"
              :class="{ 'rotate-180': !props.isCollapsed }"
            />
            <span class="sr-only">Переключить профиль компании</span>
          </UiButton>
        </CollapsibleTrigger>
      </div>
    </div>

    <CollapsibleContent>
      <Transition name="expand">
      <div v-if="!props.isCollapsed" class="mt-4 overflow-hidden">
        <div v-if="props.isLoading" class="space-y-3 animate-pulse">
          <div class="h-5 w-1/3 rounded-md bg-muted" />
          <div class="h-4 w-full rounded-md bg-muted/80" />
          <div class="h-4 w-4/5 rounded-md bg-muted/70" />
        </div>

        <div v-else-if="!props.company" class="space-y-3">
          <WidgetsAuthFlowStepper current-step="setup" />
          <div class="rounded-lg border border-border/60 bg-card/80 p-4">
            <p class="text-sm text-muted-foreground">
              Компания не найдена или недоступна.
            </p>
          </div>
        </div>

        <div v-else-if="!props.isEditing" class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div class="w-full rounded-lg border border-border/60 bg-card/80 p-3 md:col-span-2">
            <p class="text-xs tracking-wide text-muted-foreground">ID</p>
            <p class="mt-1 text-sm font-medium text-foreground">{{ props.company.id }}</p>
          </div>

          <div class="rounded-lg border border-border/60 bg-card/80 p-3 md:col-span-2">
            <p class="text-xs tracking-wide text-muted-foreground">Название</p>
            <p class="mt-1 text-sm font-medium text-foreground">{{ props.company.name }}</p>
          </div>

          <div class="rounded-lg border border-border/60 bg-card/80 p-3 md:col-span-2">
            <p class="text-xs tracking-wide text-muted-foreground">Описание</p>
            <p class="mt-1 text-sm leading-relaxed text-foreground">
              {{ props.company.description?.trim() ? props.company.description : 'Описание отсутствует' }}
            </p>
          </div>
        </div>

        <form v-else class="space-y-3" @submit.prevent="emits('save')">
          <div class="space-y-1">
            <p class="text-sm font-medium">Название</p>
            <UiInput
              :model-value="props.formName"
              required
              :disabled="props.isSaving"
              @update:model-value="(value) => emits('update:formName', String(value))"
            />
          </div>

          <div class="space-y-1">
            <p class="text-sm font-medium">Описание</p>
            <textarea
              :value="props.formDescription"
              rows="4"
              data-slot="textarea"
              class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              :disabled="props.isSaving"
              :placeholder="textareaPlacholder"
              @input="(event) => emits('update:formDescription', (event.target as HTMLTextAreaElement).value)"
            />
          </div>

          <div class="flex flex-wrap justify-end gap-2">
            <UiButton type="button" variant="outline" :disabled="props.isSaving" @click="emits('cancelEdit')">
              Отмена
            </UiButton>
            <UiButton
              type="submit"
              :disabled="props.isSaving"
              :class="{ 'animate-pulse': props.isSaving }"
              v-combinepressed="[Keywords.Ctrl, Keywords.Enter]"
            >
              {{ props.isSaving ? 'Сохраняем...' : 'Сохранить' }}
            </UiButton>
          </div>
        </form>
      </div>
    </Transition>
    </CollapsibleContent>
  </UiCard>
  </Collapsible>
</template>

<script lang="ts" setup>
import { textareaPlacholder } from '~/consts/description.placeholder'
import { Keywords } from '~/types/combinepressed'
import { ChevronDown } from 'lucide-vue-next'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

export type CompanyCardModel = {
  id: string | number
  name: string
  description: string
}

interface Props {
  routeId: string | number
  company: CompanyCardModel | null
  isLoading: boolean
  isSaving: boolean
  isCollapsed: boolean
  isEditing: boolean
  formName: string
  formDescription: string
}

const props = defineProps<Props>()

const emits = defineEmits<{
  (e: 'toggleCollapse'): void
  (e: 'toggleEdit'): void
  (e: 'cancelEdit'): void
  (e: 'save'): void
  (e: 'update:formName', value: string): void
  (e: 'update:formDescription', value: string): void
}>()

const onCollapseOpenChange = (isOpen: boolean) => {
  if (isOpen !== !props.isCollapsed) {
    emits('toggleCollapse')
  }
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: max-height 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease, transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-6px);
}

.expand-enter-to,
.expand-leave-from {
  max-height: 1200px;
  opacity: 1;
  transform: translateY(0);
}
</style>
