<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  pending?: boolean
}>()

const emits = defineEmits<{
  (e: 'login'): void
}>()

const email = defineModel<string>('email', { required: true })
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>Вход</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="() => emits('login')">
          <FieldGroup>
            <Field>
              <FieldLabel for="email">
                Email
              </FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                v-model="email"
              />
            </Field>
            <Field>
              <Button type="submit" :disabled="props.pending">
                Войти
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
