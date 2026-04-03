<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center gap-2">
      <UiButton variant="outline" @click="navigateTo('/dashboard')">
        Назад
      </UiButton>

      <Dialog>
        <DialogTrigger as-child>
          <UiButton>
            Ресурсы
          </UiButton>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Цифровые ресурсы компании</DialogTitle>
            <DialogDescription>
              Здесь нужно указать сайт, соцсети.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>

    <div v-if="isLoading || isSaving" class="h-1 w-full overflow-hidden rounded-full bg-muted/60">
      <div class="loading-progress h-full w-1/3 rounded-full bg-primary/80" />
    </div>

    <UiCard class="p-4">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="flex flex-col gap-2">
          <UiCardTitle>{{ company?.name || `Карточка компании #${route.params.id}` }}</UiCardTitle>
          <UiCardDescription>
            {{ isEditing ? 'Режим редактирования' : 'Информация о компании' }}
          </UiCardDescription>
        </div>

        <div class="flex flex-wrap gap-2">
          <UiButton v-if="!isCollapsed" variant="secondary" size="sm" @click="onToggleEdit">
            {{ isEditing ? 'Отменить' : 'Изменить' }}
          </UiButton>
          <UiButton variant="outline" size="sm" @click="isCollapsed = !isCollapsed">
            {{ isCollapsed ? 'Развернуть' : 'Свернуть' }}
          </UiButton>
        </div>
      </div>

      <Transition name="expand">
        <div v-if="!isCollapsed" class="mt-4 overflow-hidden">
        <div v-if="isLoading" class="space-y-3 animate-pulse">
          <div class="h-5 w-1/3 rounded-md bg-muted" />
          <div class="h-4 w-full rounded-md bg-muted/80" />
          <div class="h-4 w-4/5 rounded-md bg-muted/70" />
        </div>

        <div v-else-if="!company" class="rounded-lg border border-border/60 bg-card/80 p-4">
          <p class="text-sm text-muted-foreground">
            Компания не найдена или недоступна.
          </p>
        </div>

        <div v-else-if="!isEditing" class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div class="w-full rounded-lg border border-border/60 bg-card/80 p-3 md:col-span-2">
            <p class="text-xs tracking-wide text-muted-foreground">ID</p>
            <p class="mt-1 text-sm font-medium text-foreground">{{ company.id }}</p>
          </div>

          <div class="rounded-lg border border-border/60 bg-card/80 p-3 md:col-span-2">
            <p class="text-xs tracking-wide text-muted-foreground">Название</p>
            <p class="mt-1 text-sm font-medium text-foreground">{{ company.name }}</p>
          </div>

          <div class="rounded-lg border border-border/60 bg-card/80 p-3 md:col-span-2">
            <p class="text-xs tracking-wide text-muted-foreground">Описание</p>
            <p class="mt-1 text-sm leading-relaxed text-foreground">
              {{ company.description?.trim() ? company.description : 'Описание отсутствует' }}
            </p>
          </div>
        </div>

        <form v-else class="space-y-3" @submit.prevent="onSave">
          <div class="space-y-1">
            <p class="text-sm font-medium">Название</p>
            <UiInput v-model="form.name" required :disabled="isSaving" />
          </div>

          <div class="space-y-1">
            <p class="text-sm font-medium">Описание</p>
            <UiInput v-model="form.description" :disabled="isSaving" />
          </div>

          <div class="flex flex-wrap justify-end gap-2">
            <UiButton type="button" variant="outline" :disabled="isSaving" @click="onCancelEdit">
              Отмена
            </UiButton>
            <UiButton type="submit" :disabled="isSaving" :class="{ 'animate-pulse': isSaving }">
              {{ isSaving ? 'Сохраняем...' : 'Сохранить' }}
            </UiButton>
          </div>
        </form>
        </div>
      </Transition>
    </UiCard>
  </div>
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
import { CompaniesRepository } from '~/repositories/companies.repository'

const route = useRoute()

type Company = {
  id: string | number
  name: string
  description: string
}

const { $ofetch } = useNuxtApp()
const repository = new CompaniesRepository($ofetch)

const company = ref<Company | null>(null)
const isLoading = ref(false)
const isSaving = ref(false)
const isCollapsed = ref(false)
const isEditing = ref(false)

const form = reactive({
  name: '',
  description: '',
})

const fillForm = () => {
  if (!company.value) {
    return
  }

  form.name = company.value.name
  form.description = company.value.description
}

const fetchCompany = async () => {
  isLoading.value = true

  try {
    const response = await repository.getById(String(route.params.id))

    if (response.status !== 'success') {
      company.value = null
      return
    }

    company.value = {
      id: response.data.id,
      name: response.data.name,
      description: response.data.description,
    }

    fillForm()
  } finally {
    isLoading.value = false
  }
}

const onToggleEdit = () => {
  if (!company.value) {
    return
  }

  if (isEditing.value) {
    onCancelEdit()
    return
  }

  fillForm()
  isEditing.value = true
}

const onCancelEdit = () => {
  fillForm()
  isEditing.value = false
}

const onSave = async () => {
  if (!company.value || isSaving.value) {
    return
  }

  const name = form.name.trim()
  const description = form.description.trim()

  if (!name) {
    return
  }

  isSaving.value = true

  try {
    const response = await repository.update(company.value.id, {
      name,
      description,
    })

    if (response.status !== 'success') {
      return
    }

    company.value = {
      id: response.data.id,
      name: response.data.name,
      description: response.data.description,
    }
    isEditing.value = false
  } finally {
    isSaving.value = false
  }
}

definePageMeta({
  middleware: 'auth'
})

onMounted(async () => {
  await fetchCompany()
})
</script>

<style scoped>
.loading-progress {
  animation: loadingBarMove 1s ease-in-out infinite;
}

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

@keyframes loadingBarMove {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(420%);
  }
}
</style>
