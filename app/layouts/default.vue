<template>
  <div class="pt-4 px-4">
    <header class="fixed top-0 left-0 z-20 w-full border-b border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/65">
      <div class="mx-auto flex w-full items-center justify-between gap-3">
        <div class="flex cursor-pointer gap-2 max-md:flex-col max-md:gap-0" @click="() => navigateTo('/')">
          
          <h1 class="text-xl max-md:text-lg flex gap-1 items-center"><img class="-rotate-150 h-4" src="/assets/pngs/logo.png">SichtBot</h1>
          <p class="bg-linear-to-r from-blue-500 via-indigo-300 to-blue-500 bg-clip-text text-sm text-transparent">AI-помощник для бизнеса</p>
        </div>

        <div class="flex items-center gap-2">
          <nav v-if="$route.fullPath != '/auth'" class="hidden px-1 md:block">
            <div class="inline-flex items-center gap-1 rounded-xl border border-border/70 bg-card/70 p-0.5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/60">
              <NavLink
                v-for="item in links"
                :key="item.link.url"
                :to="item.link.url"
                :label="item.link.title"
                :active="$route.path === item.link.url"
              />
            </div>
          </nav>

          <DropdownMenu v-if="$route.fullPath != '/auth'">
            <div class="inline-flex items-center rounded-xl border border-border/70 bg-card/70 p-0.5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/60 md:hidden">
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon-sm" class="size-8 rounded-md" aria-label="Открыть меню навигации">
                  <MenuIcon class="size-4" />
                </Button>
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent align="end" class="w-44 md:hidden">
              <DropdownMenuItem
                v-for="item in links"
                :key="item.link.url"
                @select="() => navigateTo(item.link.url)"
              >
                {{ item.link.title }}
              </DropdownMenuItem>
              <DropdownMenuItem @select="onLogout">
                Выйти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            v-if="$route.fullPath != '/auth'"
            variant="secondary"
            size="sm"
            class="hidden md:inline-flex"
            @click="onLogout"
          >
            Выйти
          </Button>

          <div class="inline-flex items-center rounded-xl border border-border/70 bg-card/70 p-0.5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <kit-color-mode></kit-color-mode>
          </div>
        </div>
      </div>
    </header>
    <main class="pt-20 flex flex-col gap-4">
      <div>
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { MenuIcon } from 'lucide-vue-next'
import NavLink from '@/components/widgets/NavLink.vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const links: Array<{ link: { url: string, title: string } }> = [
  {
    link: {
      url: '/dashboard',
      title: 'Дашборд',
    },
  },
  {
    link: {
      url: '/',
      title: "Главная"
    }
  }
]

const onLogout = async () => {
  const tokenCookie = useCookie<string | null>('token', {
    path: '/',
    sameSite: 'lax',
  })

  tokenCookie.value = null

  await navigateTo('/auth')
}
</script>

<style>

</style>