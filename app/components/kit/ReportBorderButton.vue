<template>
  <UiButton variant="outline" class="report-rainbow-btn font-semibold">
    <slot>Сформировать отчет</slot>
  </UiButton>
</template>

<style scoped>
.report-rainbow-btn {
  position: relative;
  isolation: isolate;
  border: 1px solid transparent;
}

.report-rainbow-btn::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(90deg, rgb(34 197 94), rgb(234 179 8), rgb(239 68 68), rgb(59 130 246));
  background-size: 220% 100%;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  animation: reportBorderFlow 2.8s linear infinite;
  pointer-events: none;
}

@keyframes reportBorderFlow {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}
</style>
