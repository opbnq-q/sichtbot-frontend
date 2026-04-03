<template>
  <div class="space-y-4">
    <div v-if="isLoading || isSaving" class="h-1 w-full overflow-hidden rounded-full bg-muted/60">
      <div class="loading-progress h-full w-1/3 rounded-full bg-primary/80" />
    </div>

    <WidgetsCompanyDetailsCard
      :route-id="props.routeIdLabel"
      :company="company"
      :is-loading="isLoading"
      :is-saving="isSaving"
      :is-collapsed="isCollapsed"
      :is-editing="isEditing"
      :form-name="form.name"
      :form-description="form.description"
      @toggle-collapse="onToggleCollapse"
      @toggle-edit="onToggleEdit"
      @cancel-edit="onCancelEdit"
      @save="onSave"
      @update:form-name="(value) => (form.name = value)"
      @update:form-description="(value) => (form.description = value)"
    />
  </div>
</template>

<script lang="ts" setup>
import { CompaniesRepository } from '~/repositories/companies.repository'
import type { CompanyCardModel } from '@/components/widgets/CompanyDetailsCard.vue'

interface Props {
  routeIdLabel: string
}

const props = defineProps<Props>()

const { $ofetch } = useNuxtApp()
const repository = new CompaniesRepository($ofetch)

const company = ref<CompanyCardModel | null>(null)
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
  if (!props.routeIdLabel) {
    company.value = null
    return
  }

  isLoading.value = true

  try {
    const response = await repository.getById(props.routeIdLabel)

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

const onToggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
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

onMounted(async () => {
  await fetchCompany()
})

watch(() => props.routeIdLabel, async () => {
  await fetchCompany()
})
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
</style>
