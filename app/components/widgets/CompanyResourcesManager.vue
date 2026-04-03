<template>
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
</template>

<script lang="ts" setup>
import { EResourceType, ResourcesRepository } from '~/repositories/resources.repository'
import type { ServerResponse } from '~/types/server-response.type'
import type { ResourceRow } from '@/components/widgets/CompanyResourcesDialog.vue'

interface Props {
  companyId: number
}

const props = defineProps<Props>()

const { $ofetch } = useNuxtApp()
const resourcesRepository = new ResourcesRepository($ofetch)

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

const fetchResources = async () => {
  if (!Number.isFinite(props.companyId)) {
    resourceRows.value = []
    return
  }

  isResourcesLoading.value = true

  try {
    const response = await resourcesRepository.getAll()
    const resources = unwrapServerResponse(response) ?? []

    resourceRows.value = resources
      .filter((item) => item.company.id === props.companyId)
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

  if (!name || !url || isCreatingResource.value || !Number.isFinite(props.companyId)) {
    return
  }

  isCreatingResource.value = true

  try {
    const response = await resourcesRepository.create({
      name,
      type: newResource.type,
      url,
      companyId: props.companyId,
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

  if (!name || !url || !Number.isFinite(props.companyId)) {
    return
  }

  updatingResourceIds.value.push(id)

  try {
    const response = await resourcesRepository.update(id, {
      name,
      type: row.type,
      url,
      companyId: props.companyId,
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

watch(isResourcesDialogOpen, async (isOpen) => {
  if (!isOpen) {
    return
  }

  await fetchResources()
})
</script>
