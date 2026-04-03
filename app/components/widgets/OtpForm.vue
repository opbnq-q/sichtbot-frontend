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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

const otp = defineModel('otp', {required: true})

const emits = defineEmits<{
  (e: 'resend'): void
  (e: 'submit'): void
}>()
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <WidgetsAuthFlowStepper current-step="otp" />

    <Card>
      <CardHeader>
        <CardTitle>Введите шестизначный код</CardTitle>
        <CardDescription>Код отправлен на ваш Email</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="emits('submit')">
          <FieldGroup >
            <Field>
              <FieldLabel for="otp"  class="flex flex-col items-center">
                Код
              </FieldLabel>
              <InputOTP id="otp" :maxlength="4" required v-model="otp"  class="flex flex-col items-center">
                <InputOTPGroup class="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot :index="0" />
                  <InputOTPSlot :index="1" />
                  <InputOTPSlot :index="2" />
                  <InputOTPSlot :index="3" />
                </InputOTPGroup>
              </InputOTP>
            </Field>
            <FieldGroup>
              <Button type="submit">
                Отправить
              </Button>
              <FieldDescription class="text-center">
                Код не отправлен? <a href="#" @click="emits('resend')">Отправить заново</a>
              </FieldDescription>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
