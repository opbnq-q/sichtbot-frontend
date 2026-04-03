<script setup lang="ts">
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

const otp = defineModel('otp', {required: true})

const emits = defineEmits<{
  (e: 'resend'): void
  (e: 'submit'): void
}>()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Введите шестизначный код</CardTitle>
      <CardDescription>Код отправлен на ваш Email</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="emits('submit')">
        <FieldGroup>
          <Field>
            <FieldLabel for="otp">
              Код
            </FieldLabel>
            <InputOTP id="otp" :maxlength="6" required v-model="otp">
              <InputOTPGroup class="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot :index="0" />
                <InputOTPSlot :index="1" />
                <InputOTPSlot :index="2" />
                <InputOTPSlot :index="3" />
                <InputOTPSlot :index="4" />
                <InputOTPSlot :index="5" />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription>
              Введите шестизначный код
            </FieldDescription>
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
</template>
