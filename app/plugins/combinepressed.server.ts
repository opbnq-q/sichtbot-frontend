import type { ObjectDirective } from 'vue'
import { defineNuxtPlugin } from '#app'
import type { KeywordCombination } from '~/types/combinepressed'

const combinepressedSsrDirective: ObjectDirective<HTMLElement, KeywordCombination> = {
  getSSRProps() {
    return {}
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('combinepressed', combinepressedSsrDirective)
})
