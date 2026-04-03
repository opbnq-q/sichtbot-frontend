import type { Directive } from 'vue'
import type { KeywordCombination } from '~/types/combinepressed'

declare module 'vue' {
  interface GlobalDirectives {
    combinepressed: Directive<HTMLElement, KeywordCombination>
  }
}

export {}
