import type { DirectiveBinding } from 'vue'
import { defineNuxtPlugin } from '#app'
import { Keywords, type Keyword, type KeywordCombination } from '~/types/combinepressed'

const MODIFIER_KEYS = new Set<Keyword>([
  Keywords.Ctrl,
  Keywords.Shift,
  Keywords.Alt,
  Keywords.Meta,
])

const KNOWN_KEYWORDS = new Set<Keyword>(Object.values(Keywords))

const KEY_ALIASES: Record<string, Keyword> = {
  control: Keywords.Ctrl,
  ctrl: Keywords.Ctrl,
  shift: Keywords.Shift,
  alt: Keywords.Alt,
  meta: Keywords.Meta,
  cmd: Keywords.Meta,
  command: Keywords.Meta,
  enter: Keywords.Enter,
  esc: Keywords.Escape,
  escape: Keywords.Escape,
  tab: Keywords.Tab,
  ' ': Keywords.Space,
  space: Keywords.Space,
  spacebar: Keywords.Space,
  backspace: Keywords.Backspace,
  delete: Keywords.Delete,
  arrowup: Keywords.ArrowUp,
  arrowdown: Keywords.ArrowDown,
  arrowleft: Keywords.ArrowLeft,
  arrowright: Keywords.ArrowRight,
}

const registry = new Map<HTMLElement, readonly Keyword[]>()
let isListening = false

const normalizeKeyword = (rawKeyword: string): Keyword | null => {
  const normalized = rawKeyword.trim().toLowerCase()
  const aliased = KEY_ALIASES[normalized] ?? normalized

  return KNOWN_KEYWORDS.has(aliased as Keyword) ? (aliased as Keyword) : null
}

const normalizeCombo = (value: unknown): readonly Keyword[] => {
  if (!Array.isArray(value)) {
    return []
  }

  const normalized = value
    .map((keyword) => (typeof keyword === 'string' ? normalizeKeyword(keyword) : null))
    .filter((keyword): keyword is Keyword => keyword !== null)

  return Array.from(new Set(normalized))
}

const isElementClickable = (element: HTMLElement): boolean => {
  if (!element.isConnected) {
    return false
  }

  if ('disabled' in element && Boolean((element as HTMLButtonElement).disabled)) {
    return false
  }

  if (element.getAttribute('aria-disabled') === 'true') {
    return false
  }

  const styles = window.getComputedStyle(element)
  if (styles.display === 'none' || styles.visibility === 'hidden') {
    return false
  }

  return element.getClientRects().length > 0
}

const modifiersMatch = (event: KeyboardEvent, combo: readonly Keyword[]): boolean => {
  const required = new Set(combo)

  return (
    event.ctrlKey === required.has(Keywords.Ctrl)
    && event.shiftKey === required.has(Keywords.Shift)
    && event.altKey === required.has(Keywords.Alt)
    && event.metaKey === required.has(Keywords.Meta)
  )
}

const pickTarget = (elements: HTMLElement[]): HTMLElement | null => {
  if (elements.length === 0) {
    return null
  }

  const activeElement = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null

  if (!activeElement) {
    return elements[elements.length - 1] ?? null
  }

  const directMatch = elements.find((element) => element === activeElement)
  if (directMatch) {
    return directMatch
  }

  const form = activeElement.closest('form')
  if (form) {
    const sameForm = elements.find((element) => form.contains(element))
    if (sameForm) {
      return sameForm
    }
  }

  const dialog = activeElement.closest('[role="dialog"], [data-slot="dialog-content"], [data-slot="alert-dialog-content"]')
  if (dialog) {
    const sameDialog = elements.find((element) => dialog.contains(element))
    if (sameDialog) {
      return sameDialog
    }
  }

  return elements[elements.length - 1] ?? null
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.repeat || event.defaultPrevented || event.isComposing) {
    return
  }

  const pressedKeyword = normalizeKeyword(event.key)
  if (!pressedKeyword) {
    return
  }

  const candidates: HTMLElement[] = []

  for (const [element, combo] of registry.entries()) {
    if (!isElementClickable(element)) {
      continue
    }

    if (!modifiersMatch(event, combo)) {
      continue
    }

    const nonModifierKeys = combo.filter((keyword) => !MODIFIER_KEYS.has(keyword))

    if (nonModifierKeys.length !== 1 || nonModifierKeys[0] !== pressedKeyword) {
      continue
    }

    candidates.push(element)
  }

  const target = pickTarget(candidates)
  if (!target) {
    return
  }

  event.preventDefault()
  target.click()
}

const startListening = () => {
  if (isListening) {
    return
  }

  window.addEventListener('keydown', onKeydown)
  isListening = true
}

const stopListening = () => {
  if (!isListening || registry.size > 0) {
    return
  }

  window.removeEventListener('keydown', onKeydown)
  isListening = false
}

const syncRegistration = (
  element: HTMLElement,
  binding: DirectiveBinding<KeywordCombination>,
) => {
  const combo = normalizeCombo(binding.value)

  if (combo.length === 0) {
    registry.delete(element)
    stopListening()
    return
  }

  registry.set(element, combo)
  startListening()
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('combinepressed', {
    mounted(element: HTMLElement, binding: DirectiveBinding<KeywordCombination>) {
      syncRegistration(element, binding)
    },
    updated(element: HTMLElement, binding: DirectiveBinding<KeywordCombination>) {
      syncRegistration(element, binding)
    },
    unmounted(element: HTMLElement) {
      registry.delete(element)
      stopListening()
    },
  })
})
