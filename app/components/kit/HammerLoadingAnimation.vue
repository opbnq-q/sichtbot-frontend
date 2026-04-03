<template>
  <div
    class="hammer-loader"
    role="status"
    aria-live="polite"
    aria-label="Идет загрузка"
  >
    <div class="hammer-loader__stage" aria-hidden="true">
      <img
        class="hammer-loader__anvil"
        src="~/assets/svgs/anvil.svg"
        alt=""
      >

      <img
        class="hammer-loader__hammer"
        src="~/assets/svgs/hammer.svg"
        alt=""
      >

      <span class="hammer-loader__spark hammer-loader__spark--left" />
      <span class="hammer-loader__spark hammer-loader__spark--center" />
      <span class="hammer-loader__spark hammer-loader__spark--right" />
    </div>
  </div>
</template>

<style scoped>
.hammer-loader {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  scale: 0.5;
}

.hammer-loader__stage {
  position: relative;
  width: 8.8rem;
  height: 6.4rem;
}

.hammer-loader__anvil {
  position: absolute;
  left: 50%;
  bottom: 0.7rem;
  width: 4.15rem;
  transform: translateX(-50%);
  filter: drop-shadow(0 2px 4px rgb(0 0 0 / 24%));
  animation: anvil-pulse 1.2s ease-in-out infinite;
}

.hammer-loader__hammer {
  position: absolute;
  left: 100%;
  bottom: 2.05rem;
  width: 3.45rem;
  transform-origin: 34% 90%;
  filter: drop-shadow(0 3px 5px rgb(0 0 0 / 28%));
  animation: hammer-hit 1.2s cubic-bezier(0.2, 0.8, 0.3, 1) infinite;
}

.hammer-loader__spark {
  position: absolute;
  left: 50%; 
  bottom: 2.3rem; 
  width: 0.1rem;
  height: 0.35rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 80%);
  opacity: 0;
  transform-origin: center bottom;
  animation: spark-pop 1.2s ease-out infinite;
}

.hammer-loader__spark--left {
  --spark-x: -0.4rem;
  --spark-r: -45deg;
}

.hammer-loader__spark--center {
  --spark-x: 0;
  --spark-r: 0deg;
}

.hammer-loader__spark--right {
  --spark-x: 0.4rem;
  --spark-r: 45deg;
}

@keyframes hammer-hit {
  0%, 15% {
    transform: translateX(-15%) translateY(-0.28rem) scaleX(-1) rotate(42deg);
  }
  35%, 38% {
    transform: translateX(-31%) translateY(0.24rem) scaleX(-1) rotate(-6deg);
  }
  46% {
    transform: translateX(-28%) translateY(0.1rem) scaleX(-1) rotate(6deg);
  }
  58% {
    transform: translateX(-31%) translateY(0.2rem) scaleX(-1) rotate(-3deg);
  }
  72%, 100% {
    transform: translateX(-15%) translateY(-0.28rem) scaleX(-1) rotate(42deg);
  }
}

@keyframes anvil-pulse {
  0%, 34%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  36% {
    transform: translateX(-50%) translateY(1px);
  }
  44% {
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes spark-pop {
  0%, 34% {
    opacity: 0;
    transform: translateX(var(--spark-x)) rotate(var(--spark-r)) scaleY(0);
  }
  35% {
    opacity: 1;
    transform: translateX(var(--spark-x)) rotate(var(--spark-r)) scaleY(1);
  }
  50% {
    opacity: 0;
    transform: translateX(calc(var(--spark-x) * 2)) translateY(-0.5rem) rotate(var(--spark-r)) scaleY(0);
  }
  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hammer-loader__anvil,
  .hammer-loader__hammer,
  .hammer-loader__spark {
    animation: none;
  }
  .hammer-loader__hammer {
    transform: translateX(-20%) scaleX(-1) rotate(20deg);
  }
}
</style>