<template>
  <div class="w-full h-screen flex items-center flex-col justify-center gap-10">
    <WidgetsLoginForm
      v-if="!isOtpMode"
      v-model:email="email"
      :pending="isLoginPending"
      class="w-full max-w-md"
      @login="onLogin"
    ></WidgetsLoginForm>
    <WidgetsOtpForm class="w-full max-w-md" v-else v-model:otp="otp" @resend="onResend" @submit="onSubmit"></WidgetsOtpForm>
  </div>
</template>

<script lang="ts" setup>
import { AuthRepository } from '~/repositories/auth.repository';

const isOtpMode = ref(false)
const isLoginPending = ref(false)

const email = ref('')
const otp = ref('')

const { $ofetch } =  useNuxtApp()
const repository = new AuthRepository($ofetch);

const tokenCookie = useCookie<string | null>('token', {
  path: '/',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 30,
})

const onLogin = async () => {
  if (isLoginPending.value) {
    return
  }

  isLoginPending.value = true

  try {
    await repository.login(email.value)
    isOtpMode.value = true;
  } catch(e) {
    console.error(e)
  } finally {
    isLoginPending.value = false
  }
}

const onSubmit = async () => {
  try {
    const response = await repository.confirmOtp(email.value, otp.value)
    if (response.status === 'success') {
      tokenCookie.value = response.data.accessToken
      await navigateTo('/')
    }
  } catch(e) {
    console.error(e)
  }
}

const onResend = async () => {
  try {
    await repository.resendOtp(email.value)
  } catch(e) {
    console.error(e)
  }
}
</script>

<style>

</style>