<template>
  <div class="relative isolate overflow-hidden">
    <div
      aria-hidden="true"
      class="pointer-events-none fixed -top-36 left-1/2 z-0 h-120 w-230 -translate-x-1/2 rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#22d3ee_0deg,#6366f1_120deg,#f43f5e_240deg,#22d3ee_360deg)] opacity-40 blur-3xl"
    />
    <div
      aria-hidden="true"
      class="pointer-events-none fixed top-0 left-1/2 z-0 h-96 w-230 -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_70%)]"
    />
    <div aria-hidden="true" class="dashboard-grain pointer-events-none fixed top-0 left-1/2 z-0 h-96 w-230 -translate-x-1/2 opacity-35" />

    <div class="relative z-10">
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <KitCompanyCard
          v-for="company in companies"
          :key="company.id"
          :id="company.id"
          :title="company.title"
          :description="company.description"
          :summary="company.summary"
        ></KitCompanyCard>
      </div>

      <AlertDialog v-model:open="isCreateOpen">
        <AlertDialogTrigger as-child>
          <UiButton
            class="fixed right-6 bottom-6 z-20 size-12 rounded-full text-2xl leading-none shadow-lg"
            aria-label="Открыть форму добавления компании"
          >
            <Plus></Plus>
          </UiButton>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Добавить компанию</AlertDialogTitle>
            <AlertDialogDescription>
              Заполните title и description для новой карточки.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form class="space-y-3" @submit.prevent="onCreateCompany">
            <div class="space-y-1">
              <p class="text-sm font-medium">Title</p>
              <UiInput v-model="form.title" placeholder="Название компании" required />
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium">Description</p>
              <UiInput v-model="form.description" placeholder="Краткое описание" required />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel type="button" @click="onCancelCreate">Отмена</AlertDialogCancel>
              <UiButton type="submit">Сохранить</UiButton>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: 'auth'
})

type Company = {
  id: string
  title: string
  description: string
  summary: string
}

const initialCompanies: Company[] = [
  {
    id: '1',
    title: 'Company title',
    description: 'Company description',
    summary: 'Ключевые показатели, аналитика и активность за последнюю неделю.',
  },
  {
    id: '2',
    title: 'Tech company',
    description: 'Digital products and growth strategy',
    summary: 'Продуктовые гипотезы, воронка активации и приоритетные эксперименты.',
  },
  {
    id: '3',
    title: 'Retail company',
    description: 'Omnichannel sales and analytics',
    summary: 'Динамика онлайн/офлайн продаж, маржинальность и прогноз спроса.',
  },
  {
    id: '4',
    title: 'Service company',
    description: 'Automation and customer support',
    summary: 'Нагрузка команды, SLA по обращениям и зона оптимизации процессов.',
  },
]

const companies = ref<Company[]>(initialCompanies)

const isCreateOpen = ref(false)
const form = reactive({
  title: '',
  description: '',
})

const onCreateCompany = () => {
  const title = form.title.trim()
  const description = form.description.trim()

  if (!title || !description) {
    return
  }

  const nextId = String(companies.value.length + 1)

  companies.value.unshift({
    id: nextId,
    title,
    description,
    summary: description,
  })

  form.title = ''
  form.description = ''
  isCreateOpen.value = false
}

const onCancelCreate = () => {
  form.title = ''
  form.description = ''
  isCreateOpen.value = false
}

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Plus } from 'lucide-vue-next'

</script>

<style scoped>
.dashboard-grain {
  border-radius: 9999px;
  background-image:
    radial-gradient(circle at 20% 30%, rgb(255 255 255 / 0.3) 0 0.9px, transparent 1.3px),
    radial-gradient(circle at 70% 60%, rgb(255 255 255 / 0.24) 0 1px, transparent 1.4px),
    radial-gradient(circle at 40% 80%, rgb(0 0 0 / 0.28) 0 1.1px, transparent 1.5px);
  background-size: 3px 3px, 4px 4px, 5px 5px;
  mix-blend-mode: soft-light;
  filter: blur(0.5px);
  -webkit-mask-image: radial-gradient(ellipse at center, rgb(0 0 0 / 1) 42%, rgb(0 0 0 / 0) 78%);
  mask-image: radial-gradient(ellipse at center, rgb(0 0 0 / 1) 42%, rgb(0 0 0 / 0) 78%);
}
</style>
