<template>
  <div class="w-full h-screen flex items-center justify-center">
    <WidgetsLoginForm v-if="!isOtpMode" v-model:email="email" class="w-full max-w-md" @login="onLogin"></WidgetsLoginForm>
    <WidgetsOtpForm class="w-full max-w-md" v-else v-model:otp="otp" @resend="onResend" @submit="onSubmit"></WidgetsOtpForm>
  </div>
</template>

<script lang="ts" setup>
import { AuthRepository } from '~/repositories/auth.repository';

const isOtpMode = ref(false)

const email = ref('')
const otp = ref('')

const { $ofetch } =  useNuxtApp()
const repository = new AuthRepository($ofetch);

const onLogin = async () => {
  try {
    await repository.login(email.value)
    isOtpMode.value = true;
  } catch(e) {
    console.error(e)
  }
}

const onSubmit = async () => {
  try {
    const response = await repository.confirmOtp(email.value, otp.value)
    if (response.status === 'success') {
      const cookie = useCookie('token')
      cookie.value = response.data.token
      window.location.replace('/')
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