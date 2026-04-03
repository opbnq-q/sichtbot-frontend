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

    <UiCard class="p-4">
      <UiCardTitle>Панель компании #{{ route.params.id }}</UiCardTitle>
      <UiCardDescription>Страница компании по выбранному id.</UiCardDescription>
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

const route = useRoute()

definePageMeta({
  middleware: 'auth'
})
</script>
