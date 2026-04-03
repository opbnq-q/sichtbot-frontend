<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center gap-2">
      <UiButton variant="outline" @click="navigateTo('/dashboard')">
        Назад
      </UiButton>

      <WidgetsCompanyResourcesDialog
        :open="isResourcesDialogOpen"
        :resources-busy="isResourcesBusy"
        :resources-loading="isResourcesLoading"
        :is-creating-resource="isCreatingResource"
        :new-resource-type="newResource.type"
        :new-resource-name="newResource.name"
        :new-resource-url="newResource.url"
        :resource-rows="resourceRows"
        :is-updating="isUpdating"
        :is-deleting="isDeleting"
        @update:open="(value) => (isResourcesDialogOpen = value)"
        @update:new-resource-type="setNewType"
        @update:new-resource-name="setNewName"
        @update:new-resource-url="setNewUrl"
        @update:row-type="setRowType"
        @update:row-name="setRowName"
        @update:row-url="setRowUrl"
        @create="onCreateResource"
        @update:row="onUpdateResource"
        @delete:row="onDeleteResource"
      />
    </div>

    <div v-if="isLoading || isSaving" class="h-1 w-full overflow-hidden rounded-full bg-muted/60">
      <div class="loading-progress h-full w-1/3 rounded-full bg-primary/80" />
    </div>

    <WidgetsCompanyDetailsCard
      :route-id="routeIdLabel"
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
import { EResourceType, ResourcesRepository } from '~/repositories/resources.repository'
import type { ServerResponse } from '~/types/server-response.type'
import type { CompanyCardModel } from '@/components/widgets/CompanyDetailsCard.vue'
import type { ResourceRow } from '@/components/widgets/CompanyResourcesDialog.vue'

const route = useRoute()
const routeIdLabel = computed(() => {
  const id = route.params.id

  if (Array.isArray(id)) {
    return id[0] ?? ''
  }

  return id ?? ''
})

const { $ofetch } = useNuxtApp()
const repository = new CompaniesRepository($ofetch)
const resourcesRepository = new ResourcesRepository($ofetch)

const company = ref<CompanyCardModel | null>(null)
const isLoading = ref(false)
const isSaving = ref(false)
const isCollapsed = ref(false)
const isEditing = ref(false)
const isResourcesDialogOpen = ref(false)

const isResourcesLoading = ref(false)
const isCreatingResource = ref(false)
const updatingResourceIds = ref<number[]>([])
const deletingResourceIds = ref<number[]>([])

const resourceRows = ref<ResourceRow[]>([])

const newResource = reactive({
  type: EResourceType.SITE,
  name: '',
  url: '',
})

const isResourcesBusy = computed(() =>
  isResourcesLoading.value ||
  isCreatingResource.value ||
  updatingResourceIds.value.length > 0 ||
  deletingResourceIds.value.length > 0
)

const form = reactive({
  name: '',
  description: '',
})

const isUpdating = (id: number) => updatingResourceIds.value.includes(id)
const isDeleting = (id: number) => deletingResourceIds.value.includes(id)

const setNewType = (type: EResourceType) => {
  newResource.type = type
}

const setNewName = (value: string) => {
  newResource.name = value
}

const setNewUrl = (value: string) => {
  newResource.url = value
}

const setRowType = (id: number, type: EResourceType) => {
  const row = resourceRows.value.find((item) => item.id === id)

  if (!row) {
    return
  }

  row.type = type
}

const setRowName = (id: number, value: string) => {
  const row = resourceRows.value.find((item) => item.id === id)

  if (!row) {
    return
  }

  row.name = value
}

const setRowUrl = (id: number, value: string) => {
  const row = resourceRows.value.find((item) => item.id === id)

  if (!row) {
    return
  }

  row.url = value
}

const unwrapServerResponse = <T>(response: T | ServerResponse<T>): T | null => {
  if (response && typeof response === 'object' && 'status' in response) {
    const wrapped = response as ServerResponse<T>

    if (wrapped.status !== 'success') {
      return null
    }

    return wrapped.data
  }

  return response as T
}

const companyId = computed(() => Number(route.params.id))

const fetchResources = async () => {
  if (!Number.isFinite(companyId.value)) {
    resourceRows.value = []
    return
  }

  isResourcesLoading.value = true

  try {
    const response = await resourcesRepository.getAll()
    const resources = unwrapServerResponse(response) ?? []

    resourceRows.value = resources
      .filter((item) => item.company.id === companyId.value)
      .map((item) => ({
        id: item.id,
        name: item.name,
        url: item.url,
        type: item.type,
      }))
  } catch {
    resourceRows.value = []
  } finally {
    isResourcesLoading.value = false
  }
}

const onCreateResource = async () => {
  const name = newResource.name.trim()
  const url = newResource.url.trim()

  if (!name || !url || isCreatingResource.value || !Number.isFinite(companyId.value)) {
    return
  }

  isCreatingResource.value = true

  try {
    const response = await resourcesRepository.create({
      name,
      type: newResource.type,
      url,
      companyId: companyId.value,
    })

    const created = unwrapServerResponse(response)

    if (!created) {
      return
    }

    resourceRows.value.unshift({
      id: created.id,
      name: created.name,
      url: created.url,
      type: created.type,
    })

    newResource.name = ''
    newResource.url = ''
    newResource.type = EResourceType.SITE
  } finally {
    isCreatingResource.value = false
  }
}

const onUpdateResource = async (id: number) => {
  const row = resourceRows.value.find((item) => item.id === id)

  if (!row || isUpdating(id) || isDeleting(id)) {
    return
  }

  const name = row.name.trim()
  const url = row.url.trim()

  if (!name || !url || !Number.isFinite(companyId.value)) {
    return
  }

  updatingResourceIds.value.push(id)

  try {
    const response = await resourcesRepository.update(id, {
      name,
      type: row.type,
      url,
      companyId: companyId.value,
    })

    const updated = unwrapServerResponse(response)

    if (!updated) {
      return
    }

    row.name = updated.name
    row.url = updated.url
    row.type = updated.type
  } finally {
    updatingResourceIds.value = updatingResourceIds.value.filter((itemId) => itemId !== id)
  }
}

const onDeleteResource = async (id: number) => {
  if (isDeleting(id) || isUpdating(id)) {
    return
  }

  deletingResourceIds.value.push(id)

  try {
    await resourcesRepository.delete(id)
    resourceRows.value = resourceRows.value.filter((item) => item.id !== id)
  } finally {
    deletingResourceIds.value = deletingResourceIds.value.filter((itemId) => itemId !== id)
  }
}

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

definePageMeta({
  middleware: 'auth'
})

onMounted(async () => {
  await fetchCompany()
})

watch(isResourcesDialogOpen, async (isOpen) => {
  if (!isOpen) {
    return
  }

  await fetchResources()
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
