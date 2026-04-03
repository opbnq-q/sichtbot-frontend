export const Keywords = {
  Ctrl: 'ctrl',
  Shift: 'shift',
  Alt: 'alt',
  Meta: 'meta',
  Enter: 'enter',
  Escape: 'escape',
  Tab: 'tab',
  Space: 'space',
  Backspace: 'backspace',
  Delete: 'delete',
  ArrowUp: 'arrowup',
  ArrowDown: 'arrowdown',
  ArrowLeft: 'arrowleft',
  ArrowRight: 'arrowright',
} as const

export type Keyword = (typeof Keywords)[keyof typeof Keywords]
export type KeywordCombination = readonly [Keyword, ...Keyword[]]
