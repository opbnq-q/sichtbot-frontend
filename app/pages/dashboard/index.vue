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
      <div v-if="isLoading" class="mb-3 h-1 w-full overflow-hidden rounded-full bg-muted/60">
        <div class="loading-progress h-full w-1/3 rounded-full bg-primary/80" />
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <KitCompanyCard
          v-for="company in companies"
          :key="company.id"
          :id="company.id"
          :title="company.title"
          :description="company.description"
          :summary="company.summary"
          :is-deleting="isDeleting(company.id)"
          @delete="onDeleteCompany(company.id)"
        ></KitCompanyCard>
      </div>

      <UiCard v-if="hasFetched && !isLoading && companies.length === 0" class="mt-4 p-4">
        <UiCardTitle>Компаний пока нет</UiCardTitle>
        <UiCardDescription>
          Добавьте первую компанию через кнопку внизу справа.
        </UiCardDescription>
      </UiCard>

      <AlertDialog v-model:open="isCreateOpen">
        <AlertDialogTrigger as-child>
          <UiButton
            class="fixed right-6 bottom-6 z-20 size-12 rounded-full text-2xl leading-none shadow-lg"
            aria-label="Открыть форму добавления компании"
            v-combinepressed="[Keywords.Ctrl, Keywords.Enter]"
          >
            <Plus></Plus>
          </UiButton>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Добавить компанию</AlertDialogTitle>
            <AlertDialogDescription>
              Заполните навание для новой карточки. Описание — по желанию.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form class="space-y-3" @submit.prevent="onCreateCompany">
            <div class="space-y-1">
              <p class="text-sm font-medium">Название</p>
              <UiInput v-model="form.title" placeholder="Название компании" required :disabled="isCreating" />
            </div>
            <div class="space-y-1">
              <p class="text-sm font-medium">Описание</p>
              <textarea
                v-model="form.description"
                rows="4"
                data-slot="textarea"
                class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                :placeholder="textareaPlacholder"
                :disabled="isCreating"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel type="button" @click="onCancelCreate" :disabled="isCreating">Отмена</AlertDialogCancel>
              <UiButton
                type="submit"
                :disabled="isCreating"
                v-combinepressed="[Keywords.Ctrl, Keywords.Enter]"
              >
                Сохранить
              </UiButton>
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

import { storeToRefs } from 'pinia'

const isCreateOpen = ref(false)
const form = reactive({
  title: '',
  description: '',
})

const companiesStore = useCompaniesStore()
const { companies, isLoading, hasFetched, isCreating } = storeToRefs(companiesStore)
const { fetchCompanies, deleteCompany, createCompany, isDeleting } = companiesStore

const onCreateCompany = async () => {
  const title = form.title.trim()
  const description = form.description.trim()

  if (!title) {
    return
  }

  await createCompany({
    title,
    description,
  })

  form.title = ''
  form.description = ''
  isCreateOpen.value = false
}

const onDeleteCompany = async (id: string) => {
  await deleteCompany(id)
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
import { Keywords } from '~/types/combinepressed'
import { textareaPlacholder } from '~/consts/description.placeholder'

onMounted(async () => {
  await fetchCompanies()
})

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
</style>
