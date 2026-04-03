<template>
  <div class="space-y-4">
    <div class="flex max-md:flex-col gap-2 justify-between">
      <div class="flex gap-2 max-md:flex-col">
        <UiButton class="w-full" variant="outline" @click="navigateTo('/dashboard')">
        Назад
      </UiButton>

      <WidgetsCompanyResourcesManager class="w-full" :company-id="companyId" />
      </div>

      <KitReportBorderButton class="max-md:w-full">
        Сформировать отчет
      </KitReportBorderButton>
    </div>

    <WidgetsAuthFlowStepper current-step="report" />

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
