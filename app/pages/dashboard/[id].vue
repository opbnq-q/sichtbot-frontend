<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center gap-2">
      <UiButton variant="outline" @click="navigateTo('/dashboard')">
        Назад
      </UiButton>

      <WidgetsCompanyResourcesManager :company-id="companyId" />

      <KitReportBorderButton class="ml-auto">
        Сформировать отчет
      </KitReportBorderButton>
    </div>

    <WidgetsCompanyDetailsManager :route-id-label="routeIdLabel" />
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const routeIdLabel = computed(() => {
  const id = route.params.id

  if (Array.isArray(id)) {
    return id[0] ?? ''
  }

  return id ?? ''
})
const companyId = computed(() => Number(route.params.id))

definePageMeta({
  middleware: 'auth'
})
</script>
