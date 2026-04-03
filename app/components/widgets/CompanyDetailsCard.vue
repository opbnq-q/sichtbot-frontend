<template>
  <UiCard class="p-4">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="flex flex-col gap-2">
        <UiCardTitle>{{ props.company?.name || `Карточка компании #${props.routeId}` }}</UiCardTitle>
        <UiCardDescription>
          {{ props.isEditing ? 'Режим редактирования' : 'Информация о компании' }}
        </UiCardDescription>
      </div>

      <div class="flex flex-wrap gap-2">
        <UiButton v-if="!props.isCollapsed" variant="secondary" size="sm" @click="emits('toggleEdit')">
          {{ props.isEditing ? 'Отменить' : 'Изменить' }}
        </UiButton>
        <UiButton variant="outline" size="sm" @click="emits('toggleCollapse')">
          {{ props.isCollapsed ? 'Развернуть' : 'Свернуть' }}
        </UiButton>
      </div>
    </div>

    <Transition name="expand">
      <div v-if="!props.isCollapsed" class="mt-4 overflow-hidden">
        <div v-if="props.isLoading" class="space-y-3 animate-pulse">
          <div class="h-5 w-1/3 rounded-md bg-muted" />
          <div class="h-4 w-full rounded-md bg-muted/80" />
          <div class="h-4 w-4/5 rounded-md bg-muted/70" />
        </div>

        <div v-else-if="!props.company" class="rounded-lg border border-border/60 bg-card/80 p-4">
          <p class="text-sm text-muted-foreground">
            Компания не найдена или недоступна.
          </p>
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
            <UiInput
              :model-value="props.formDescription"
              :disabled="props.isSaving"
              @update:model-value="(value) => emits('update:formDescription', String(value))"
            />
          </div>

          <div class="flex flex-wrap justify-end gap-2">
            <UiButton type="button" variant="outline" :disabled="props.isSaving" @click="emits('cancelEdit')">
              Отмена
            </UiButton>
            <UiButton type="submit" :disabled="props.isSaving" :class="{ 'animate-pulse': props.isSaving }">
              {{ props.isSaving ? 'Сохраняем...' : 'Сохранить' }}
            </UiButton>
          </div>
        </form>
      </div>
    </Transition>
  </UiCard>
</template>

<script lang="ts" setup>
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
