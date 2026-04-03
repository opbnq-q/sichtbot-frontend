<script setup lang="ts">
import { computed } from "vue"

type AuthStep = "input" | "otp" | "setup" | "report"

const props = withDefaults(
  defineProps<{
    currentStep?: AuthStep
  }>(),
  {
    currentStep: "input",
  },
)

const steps = [
  { key: "input", title: "Ввод", description: "Email" },
  { key: "otp", title: "OTP", description: "Подтверждение" },
  { key: "setup", title: "Настройка проекта", description: "Профиль" },
  { key: "report", title: "Отчет", description: "Результат" },
] as const

const stepsCount = Number(steps.length)

const currentStepIndex = computed(() => {
  const index = steps.findIndex(step => step.key === props.currentStep)
  return index === -1 ? 0 : index
})

const desktopLineInsetPx = 16

const progressRatio = computed(() => {
  if (stepsCount <= 1) {
    return 0
  }

  return currentStepIndex.value / (stepsCount - 1)
})

const desktopTrackStyle = {
  left: `${desktopLineInsetPx}px`,
  right: `${desktopLineInsetPx}px`,
}

const desktopProgressStyle = computed(() => ({
  left: `${desktopLineInsetPx}px`,
  width: `calc((100% - ${desktopLineInsetPx * 2}px) * ${progressRatio.value})`,
}))

const getStepState = (index: number) => {
  if (index < currentStepIndex.value) {
    return "completed"
  }

  if (index === currentStepIndex.value) {
    return "current"
  }

  return "upcoming"
}

const getDesktopStepStyle = (index: number) => {
  if (stepsCount === 1) {
    return {
      left: "50%",
      transform: "translateX(-50%)",
    }
  }

  if (index === 0) {
    return {
      left: "0%",
      transform: "translateX(0)",
    }
  }

  if (index === stepsCount - 1) {
    return {
      left: "100%",
      transform: "translateX(-100%)",
    }
  }

  return {
    left: `${(index / (stepsCount - 1)) * 100}%`,
    transform: "translateX(-50%)",
  }
}

</script>

<template>
  <section
    class="relative w-full overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur supports-backdrop-filter:bg-card/65"
    aria-label="Этапы авторизации и настройки"
  >
    <div class="pointer-events-none absolute inset-x-0 top-0 h-8 bg-linear-to-r from-primary/0 via-primary/20 to-primary/0 blur-xl" />

    <ol class="relative flex flex-col gap-2.5 sm:hidden">
      <li
        v-for="(step, index) in steps"
        :key="step.key"
        class="flex items-start gap-3 rounded-xl px-1.5 py-1.5 transition-colors"
        :class="{
          'bg-primary/5': getStepState(index) === 'current',
          'bg-muted/20': getStepState(index) === 'completed',
        }"
      >
        <span
          class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors"
          :class="{
            'border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20':
              getStepState(index) === 'current',
            'border-primary/60 bg-primary/10 text-primary': getStepState(index) === 'completed',
            'border-border bg-background text-muted-foreground': getStepState(index) === 'upcoming',
          }"
        >
          {{ index + 1 }}
        </span>

        <div class="min-w-0">
          <p
            class="text-sm font-semibold transition-colors"
            :class="getStepState(index) === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'"
          >
            {{ step.title }}
          </p>
          <p class="text-xs text-muted-foreground wrap-break-word">
            {{ step.description }}
          </p>
        </div>
      </li>
    </ol>

    <ol class="relative hidden min-h-24 sm:block">
      <span
        class="pointer-events-none absolute top-4 h-0 border-t border-dashed border-border"
        :style="desktopTrackStyle"
      />
      <span
        class="pointer-events-none absolute top-4 h-px bg-primary/55 transition-[width] duration-300"
        :style="desktopProgressStyle"
      />

      <li
        v-for="(step, index) in steps"
        :key="step.key"
        class="absolute top-0 w-28 md:w-36"
        :style="getDesktopStepStyle(index)"
        :class="{
          'text-left': index === 0,
          'text-right': index === steps.length - 1,
          'text-center': index !== 0 && index !== steps.length - 1,
        }"
      >
        <div
          class="relative h-8 w-8"
          :class="{
            'ml-0': index === 0,
            'ml-auto': index === steps.length - 1,
            'mx-auto': index !== 0 && index !== steps.length - 1,
          }"
        >
          <span
            class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors"
            :class="{
              'border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20':
                getStepState(index) === 'current',
              'border-primary/60 bg-card text-primary': getStepState(index) === 'completed',
              'border-border bg-background text-muted-foreground': getStepState(index) === 'upcoming',
            }"
          >
            {{ index + 1 }}
          </span>
        </div>

        <div class="mt-2 min-w-0 space-y-0.5 px-1">
          <p
            class="text-sm font-semibold transition-colors"
            :class="getStepState(index) === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'"
          >
            {{ step.title }}
          </p>
          <p class="text-xs text-muted-foreground wrap-break-word">
            {{ step.description }}
          </p>
        </div>
      </li>
    </ol>
  </section>
</template>
