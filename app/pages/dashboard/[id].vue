<template>
  <div class="space-y-4">
    <UiButton variant="outline" @click="navigateTo('/dashboard')">
      Назад
    </UiButton>

    <UiCard class="p-4">
      <UiCardTitle>Панель компании #{{ route.params.id }}</UiCardTitle>
      <UiCardDescription>Страница компании по выбранному id.</UiCardDescription>
    </UiCard>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
</script>
