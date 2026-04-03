<template>
    <div 
        ref="rootContainerRef"
        class="relative isolate overflow-hidden min-h-screen"
        :class="{ 'hide-native-cursor': !isMobile }"
    >
        <div
            v-if="!isMobile"
            ref="autoCursorRef"
            aria-hidden="true"
            class="pointer-events-none absolute left-0 top-0 z-[9999] h-7 w-7 opacity-0 transition-opacity duration-500"
            style="transition-property: transform, opacity; transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);"
        >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full filter drop-shadow-md">
                <path d="M5.5 3.21V20.8C5.5 21.46 6.27 21.82 6.77 21.4L11.43 17.38C11.66 17.18 11.95 17.07 12.25 17.07H19.5C20.17 17.07 20.5 16.28 20.01 15.82L6.87 3.03C6.46 2.64 5.5 2.92 5.5 3.21Z" fill="white" stroke="black" stroke-width="1.5"/>
            </svg>
        </div>

        <div
            v-if="!isMobile"
            ref="userFollowerRef"
            class="user-cursor-follower pointer-events-none fixed left-0 top-0 z-[9998] size-6 rounded-full border border-primary/60 mix-blend-difference"
        />

        <div
            aria-hidden="true"
            class="interactive-bottom-bg pointer-events-none absolute inset-x-0 -bottom-10 z-0 h-72"
        />

        <div class="relative z-10 space-y-6 container mx-auto px-4 py-6 md:py-10">
            <section class="relative isolate overflow-hidden rounded-2xl border border-border/70 bg-card/70 px-6 py-14 shadow-sm backdrop-blur md:px-10 md:py-20">
                <div
                    aria-hidden="true"
                    class="pointer-events-none absolute -top-20 left-1/2 z-0 h-64 w-[48rem] -translate-x-1/2 rounded-full bg-linear-to-r from-primary/25 via-accent/20 to-primary/15 blur-3xl"
                />
                <div aria-hidden="true" class="hero-grain pointer-events-none absolute inset-0 z-0 opacity-20" />

                <div class="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
                    <p class="mb-4 rounded-full border border-border/60 bg-background/55 px-4 py-1 text-xs font-medium text-muted-foreground">
                        AI-помощник для бизнеса
                    </p>

                    <h1 class="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                        Управляйте компанией быстрее
                        <span class="bg-linear-to-r from-blue-500 via-indigo-300 to-blue-500 bg-clip-text text-transparent">
                            с умной аналитикой
                        </span>
                    </h1>

                    <p class="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
                        SichtBot помогает вести интернет-деятельность: собирает ключевые метрики, подсказывает точки роста и поддерживает принятие решений на основе данных.
                    </p>

                    <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <UiButton 
                            id="demo-btn"
                            size="lg" 
                            class="cursor-interactive group transition-all duration-300 active:scale-95"
                            @click="navigateTo('/dashboard')"
                        >
                            Открыть дашборд
                        </UiButton>
                    </div>
                </div>
            </section>

            <section class="rounded-2xl border border-border/70 bg-card/65 p-6 shadow-sm backdrop-blur md:p-8">
                <div class="mx-auto max-w-5xl space-y-6">
                    <div class="space-y-2">
                        <h2 class="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                            Полная картина интернет-деятельности в одном месте
                        </h2>
                        <p class="text-sm text-muted-foreground md:text-base">
                            SichtBot объединяет данные из разных каналов, анализирует их с помощью AI и показывает понятные рекомендации для роста бизнеса.
                        </p>
                    </div>

                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <UiCard 
                            class="cursor-interactive cursor-pointer relative z-20 border-border/60 bg-card/80 p-4 transition-all duration-300 hover:border-primary/50 hover:bg-card"
                            @click="openDialog('AI-анализ', 'Детализированный анализ включает предиктивную аналитику, выявление неочевидных паттернов поведения пользователей и автоматическое формирование отчетов об аномалиях в метриках в режиме реального времени.')"
                        >
                            <UiCardTitle>AI-анализ</UiCardTitle>
                            <UiCardDescription>
                                Модель выявляет тренды, аномалии и точки роста, помогает быстро понять, где проседают показатели и что даст наибольший эффект.
                            </UiCardDescription>
                        </UiCard>

                        <UiCard 
                            class="cursor-interactive cursor-pointer relative z-20 border-border/60 bg-card/80 p-4 transition-all duration-300 hover:border-primary/50 hover:bg-card"
                            @click="openDialog('SEO-анализ', 'Инструмент непрерывно мониторит позиции сайта по ключевым запросам, анализирует семантику конкурентов, проверяет техническое состояние ресурса и генерирует готовые к внедрению рекомендации по On-Page SEO.')"
                        >
                            <UiCardTitle>SEO-анализ</UiCardTitle>
                            <UiCardDescription>
                                SEO — это поисковая оптимизация сайта. SichtBot подсказывает, как улучшить видимость в поиске и увеличить органический трафик.
                            </UiCardDescription>
                        </UiCard>

                        <UiCard 
                            class="cursor-interactive cursor-pointer relative z-20 border-border/60 bg-card/80 p-4 md:col-span-2 transition-all duration-300 hover:border-primary/50 hover:bg-card"
                            @click="openDialog('Сбор данных из разных провайдеров', 'Единый хаб для всех интеграций: безопасное управление API-ключами, автоматическая синхронизация данных каждые 15 минут, возможность создания кросс-канальных отчетов (например, сопоставление затрат в Яндекс.Директ с продажами из Telegram-бота).')"
                        >
                            <UiCardTitle>Сбор данных из разных провайдеров</UiCardTitle>
                            <UiCardDescription>
                                Платформа собирает и синхронизирует данные из Telegram, Яндекс, вашего сайта, ВК и других источников, чтобы вы работали с единой аналитикой.
                            </UiCardDescription>
                            <div class="mt-3 flex flex-wrap gap-2">
                                <span v-for="tag in ['Telegram', 'Яндекс', 'Сайт', 'ВК', 'Другие провайдеры']" :key="tag" class="rounded-md border border-border/60 bg-background/60 px-2 py-1 text-xs text-muted-foreground">{{tag}}</span>
                            </div>
                        </UiCard>
                    </div>
                </div>
            </section>
        </div>

        <UiDialog v-model:open="isDialogOpen">
            <UiDialogContent v-if="selectedAdvantage" class="sm:max-w-md">
                <UiDialogHeader>
                    <UiDialogTitle class="text-xl">{{ selectedAdvantage.title }}</UiDialogTitle>
                </UiDialogHeader>
                <div class="pt-4">
                    <p class="text-sm leading-relaxed text-muted-foreground">
                        {{ selectedAdvantage.detail }}
                    </p>
                </div>
            </UiDialogContent>
        </UiDialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

definePageMeta({
    middleware: 'auth'
})

const isMobile = ref(true)
const rootContainerRef = ref<HTMLElement | null>(null)
const autoCursorRef = ref<HTMLElement | null>(null)
const userFollowerRef = ref<HTMLElement | null>(null)

const isDialogOpen = ref(false)
const selectedAdvantage = ref<{ title: string, detail: string } | null>(null)

const openDialog = (title: string, detail: string) => {
    selectedAdvantage.value = { title, detail }
    isDialogOpen.value = true
}

let autoLoopTimer: ReturnType<typeof setTimeout> | null = null
let currentAutoStep = 0
let autoCursorActiveTarget: HTMLElement | null = null

const getRelativeCoords = (el: HTMLElement, offsetX = 0, offsetY = 0) => {
    if (!rootContainerRef.value) return { x: 0, y: 0 }
    const targetRect = el.getBoundingClientRect()
    const containerRect = rootContainerRef.value.getBoundingClientRect()
    return {
        x: targetRect.left - containerRect.left + offsetX,
        y: targetRect.top - containerRect.top + offsetY
    }
}

const moveAutoCursor = (x: number, y: number, duration: number = 800) => {
    if (!autoCursorRef.value) return
    autoCursorRef.value.style.transitionDuration = `${duration}ms`
    autoCursorRef.value.style.transform = `translate(${x}px, ${y}px)`
}

const clearHoverEffects = () => {
    if (autoCursorActiveTarget) {
        autoCursorActiveTarget.classList.remove('scale-[1.02]', 'brightness-110')
        autoCursorActiveTarget = null
    }
}

const runAutoSequence = () => {
    if (isMobile.value || !autoCursorRef.value || !rootContainerRef.value || isDialogOpen.value) return

    clearHoverEffects()
    const buttonEl = document.getElementById('demo-btn')
    if (!buttonEl) return

    if (currentAutoStep === 0) {
        autoCursorRef.value.classList.add('opacity-0')
        const containerRect = rootContainerRef.value.getBoundingClientRect()
        moveAutoCursor(containerRect.width + 100, containerRect.height / 2, 0)
        
        autoLoopTimer = setTimeout(() => {
            if (isDialogOpen.value) return
            autoCursorRef.value?.classList.remove('opacity-0')
            currentAutoStep = 1
            runAutoSequence()
        }, 1000)
        return
    }

    if (currentAutoStep === 1) {
        const targets = document.querySelectorAll('.grid .cursor-interactive')
        if (targets.length) {
            const target = targets[Math.floor(Math.random() * targets.length)] as HTMLElement
            const rect = target.getBoundingClientRect()
            const coords = getRelativeCoords(target, rect.width / 3, rect.height / 3)
            
            moveAutoCursor(coords.x, coords.y, 700)

            autoLoopTimer = setTimeout(() => {
                if (isDialogOpen.value) return
                target.classList.add('scale-[1.02]', 'brightness-110')
                autoCursorActiveTarget = target
                
                autoLoopTimer = setTimeout(() => {
                    currentAutoStep = 2
                    runAutoSequence()
                }, 1200)
            }, 700)
        } else {
            currentAutoStep = 2
            runAutoSequence()
        }
        return
    }

    if (currentAutoStep === 2) {
        const rect = buttonEl.getBoundingClientRect()
        const coords = getRelativeCoords(buttonEl, rect.width / 2 - 10, rect.height / 2 - 5)
        
        moveAutoCursor(coords.x, coords.y, 1000)

        autoLoopTimer = setTimeout(() => {
            if (isDialogOpen.value) return
            buttonEl.classList.add('brightness-110', 'scale-[1.03]')
            autoCursorActiveTarget = buttonEl

            autoLoopTimer = setTimeout(() => {
                currentAutoStep = 3
                runAutoSequence()
            }, 2000)
        }, 1000)
        return
    }

    if (currentAutoStep === 3) {
        buttonEl.classList.add('scale-95')
        
        autoLoopTimer = setTimeout(() => {
            buttonEl.classList.remove('scale-95')
            
            if (!rootContainerRef.value) return
            const containerRect = rootContainerRef.value.getBoundingClientRect()
            moveAutoCursor(containerRect.width * 0.9, containerRect.height * 0.9, 900)

            autoLoopTimer = setTimeout(() => {
                autoCursorRef.value?.classList.add('opacity-0')
                currentAutoStep = 0
                autoLoopTimer = setTimeout(runAutoSequence, 8000)
            }, 900)
        }, 200)
        return
    }
}

const userCursorPos = { x: 0, y: 0 }
const followerPos = { x: 0, y: 0 }
let followerAnimationId: number | null = null

const handleMouseMove = (e: MouseEvent) => {
    userCursorPos.x = e.clientX
    userCursorPos.y = e.clientY
}

const animateFollower = () => {
    if (isMobile.value || !userFollowerRef.value) return

    const dt = 0.15
    followerPos.x += (userCursorPos.x - followerPos.x) * dt
    followerPos.y += (userCursorPos.y - followerPos.y) * dt

    const offsetX = userFollowerRef.value.offsetWidth / 2
    const offsetY = userFollowerRef.value.offsetHeight / 2

    userFollowerRef.value.style.transform = `translate(${followerPos.x - offsetX}px, ${followerPos.y - offsetY}px)`
    
    if (isDialogOpen.value) {
        userFollowerRef.value.style.opacity = '0'
    } else {
        userFollowerRef.value.style.opacity = '1'
    }

    followerAnimationId = requestAnimationFrame(animateFollower)
}

const setupUserInteractions = () => {
    if (isMobile.value || !userFollowerRef.value) return
    const follower = userFollowerRef.value

    document.querySelectorAll('.cursor-interactive').forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.classList.add('is-active')
            if (el.tagName === 'BUTTON') {
                follower.classList.add('sticky-primary')
            }
        })
        el.addEventListener('mouseleave', () => {
            follower.classList.remove('is-active', 'sticky-primary')
        })
    })
}

const checkMedia = () => {
    isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
    checkMedia()
    window.addEventListener('resize', checkMedia)

    if (!isMobile.value) {
        setTimeout(runAutoSequence, 500)

        followerPos.x = window.innerWidth / 2
        followerPos.y = window.innerHeight / 2
        window.addEventListener('mousemove', handleMouseMove)
        followerAnimationId = requestAnimationFrame(animateFollower)

        nextTick(setupUserInteractions)
    }
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMedia)
    if (autoLoopTimer) clearTimeout(autoLoopTimer)
    window.removeEventListener('mousemove', handleMouseMove)
    if (followerAnimationId) cancelAnimationFrame(followerAnimationId)
})
</script>

<style scoped>
@media (min-width: 769px) {
    .hide-native-cursor, 
    .hide-native-cursor * {
        cursor: none !important;
    }
    
    body:has([role="dialog"]) {
        cursor: auto !important;
    }
    body:has([role="dialog"]) .hide-native-cursor, 
    body:has([role="dialog"]) .hide-native-cursor * {
        cursor: auto !important;
    }
}

.user-cursor-follower {
    will-change: transform, width, height, background-color, border-color, opacity;
    transition: 
        width 0.25s ease-out, 
        height 0.25s ease-out, 
        background-color 0.2s ease,
        border-color 0.2s ease,
        opacity 0.3s ease;
    box-shadow: 0 0 8px rgba(var(--color-primary-rgb), 0);
}

.user-cursor-follower.is-active {
    width: 60px;
    height: 60px;
    background-color: rgb(255 255 255 / 0.1);
    border-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(1px);
    mix-blend-difference: normal;
}

.user-cursor-follower.sticky-primary {
    border-color: rgb(var(--color-primary-rgb) / 0.8);
    background-color: transparent;
    box-shadow: 0 0 15px rgb(var(--color-primary-rgb) / 0.4);
}

.interactive-bottom-bg {
    background:
        radial-gradient(24% 30% at 50% 62%, rgb(250 204 21 / 0.32), transparent 66%),
        radial-gradient(42% 50% at 48% 56%, rgb(34 211 238 / 0.3), transparent 64%),
        radial-gradient(32% 40% at 58% 62%, rgb(99 102 241 / 0.24), transparent 68%),
    conic-gradient(from 180deg at 50% 78%, rgb(34 211 238 / 0.34), rgb(99 102 241 / 0.28), rgb(244 63 94 / 0.26), rgb(34 211 238 / 0.34));
    background-repeat: no-repeat;
    background-position: center bottom;
    filter: blur(32px) saturate(115%);
    -webkit-mask-image: radial-gradient(ellipse 72% 90% at 50% 72%, rgb(0 0 0 / 0.98) 14%, rgb(0 0 0 / 0.8) 30%, rgb(0 0 0 / 0.52) 46%, rgb(0 0 0 / 0.24) 60%, rgb(0 0 0 / 0.07) 74%, rgb(0 0 0 / 0) 88%);
    mask-image: radial-gradient(ellipse 72% 90% at 50% 72%, rgb(0 0 0 / 0.98) 14%, rgb(0 0 0 / 0.8) 30%, rgb(0 0 0 / 0.52) 46%, rgb(0 0 0 / 0.24) 60%, rgb(0 0 0 / 0.07) 74%, rgb(0 0 0 / 0) 88%);
    animation: bottomGlowShift 16s ease-in-out infinite alternate, bottomColorDrift 20s ease-in-out infinite;
}

.interactive-bottom-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
            radial-gradient(circle at 18% 24%, rgb(255 255 255 / 0.38) 0 0.95px, transparent 1.25px),
            radial-gradient(circle at 66% 62%, rgb(255 255 255 / 0.3) 0 1.05px, transparent 1.35px),
            radial-gradient(circle at 42% 78%, rgb(0 0 0 / 0.3) 0 1.15px, transparent 1.45px),
            radial-gradient(circle at 55% 38%, rgb(255 255 255 / 0.22) 0 0.85px, transparent 1.15px);
        background-size: 2px 2px, 3px 3px, 4px 4px, 2px 2px;
        mix-blend-mode: overlay;
        opacity: 0.62;
        filter: blur(0.45px);
        -webkit-mask-image: radial-gradient(ellipse 70% 88% at 50% 70%, rgb(0 0 0 / 1) 22%, rgb(0 0 0 / 0.5) 44%, rgb(0 0 0 / 0.14) 60%, rgb(0 0 0 / 0) 78%);
        mask-image: radial-gradient(ellipse 70% 88% at 50% 70%, rgb(0 0 0 / 1) 22%, rgb(0 0 0 / 0.5) 44%, rgb(0 0 0 / 0.14) 60%, rgb(0 0 0 / 0) 78%);
    animation: bottomGrainShift 12s linear infinite;
}

.interactive-bottom-bg::after {
        content: '';
        position: absolute;
        inset: 0;
        background-image:
            linear-gradient(to right, rgb(255 255 255 / 0.14) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(255 255 255 / 0.14) 1px, transparent 1px);
        background-size: 24px 24px;
        mix-blend-mode: soft-light;
        opacity: 0.2;
        filter: blur(1px);
        -webkit-mask-image: radial-gradient(ellipse 68% 86% at 50% 70%, rgb(0 0 0 / 1) 18%, rgb(0 0 0 / 0.48) 40%, rgb(0 0 0 / 0.12) 58%, rgb(0 0 0 / 0) 78%);
        mask-image: radial-gradient(ellipse 68% 86% at 50% 70%, rgb(0 0 0 / 1) 18%, rgb(0 0 0 / 0.48) 40%, rgb(0 0 0 / 0.12) 58%, rgb(0 0 0 / 0) 78%);
        animation: bottomGridShift 14s linear infinite;
}

.hero-grain {
    background-image:
        radial-gradient(circle at 20% 30%, rgb(255 255 255 / 0.12) 0 0.8px, transparent 1.2px),
        radial-gradient(circle at 70% 60%, rgb(255 255 255 / 0.08) 0 0.9px, transparent 1.3px),
        radial-gradient(circle at 45% 82%, rgb(0 0 0 / 0.12) 0 1px, transparent 1.4px);
    background-size: 3px 3px, 4px 4px, 5px 5px;
    mix-blend-mode: soft-light;
}

@keyframes bottomGlowShift {
        0% { transform: translateY(8px) scale(0.98); }
        100% { transform: translateY(-4px) scale(1.03); }
}

@keyframes bottomColorDrift {
    0%, 100% { background-position: 50% 62%, 48% 60%, 58% 64%, center bottom; }
    50% { background-position: 52% 60%, 52% 56%, 54% 68%, center bottom; }
}

@keyframes bottomGridShift {
        0% { background-position: 0 0, 0 0; }
        100% { background-position: 24px 0, 0 24px; }
}

@keyframes bottomGrainShift {
    0% { background-position: 0 0, 0 0, 0 0; }
    100% { background-position: 6px 4px, -5px 3px, 4px -6px; }
}
</style>