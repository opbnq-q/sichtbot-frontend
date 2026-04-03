<script setup lang="ts">
import { Keywords } from '~/types/combinepressed'
</script>

<template>
  <UiButton
    variant="outline"
    class="report-rainbow-btn font-semibold"
    v-combinepressed="[Keywords.Ctrl, Keywords.Enter]"
  >
    <slot>Сформировать отчет</slot>
  </UiButton>
</template>

<style scoped>
@property --report-border-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.report-rainbow-btn {
  position: relative;
  isolation: isolate;
  border: 1px solid transparent;
  --report-border-angle: 0deg;
  animation: reportShadowPulse 2.8s ease-in-out infinite;
}

.report-rainbow-btn::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: conic-gradient(
    from var(--report-border-angle),
    rgb(34 197 94),
    rgb(234 179 8),
    rgb(239 68 68),
    rgb(59 130 246),
    rgb(34 197 94)
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  animation: reportBorderAngle 2.2s linear infinite;
  pointer-events: none;
}

@keyframes reportBorderAngle {
  to {
    --report-border-angle: 360deg;
  }
}

@keyframes reportShadowPulse {
  0%,
  100% {
    box-shadow:
      0 10px 22px -16px rgb(34 197 94 / 0.45),
      0 0 0 0 rgb(59 130 246 / 0.24);
  }
  50% {
    box-shadow:
      0 14px 28px -16px rgb(234 179 8 / 0.62),
      0 0 18px 2px rgb(59 130 246 / 0.3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .report-rainbow-btn,
  .report-rainbow-btn::before {
    animation: none;
  }
}
</style>
