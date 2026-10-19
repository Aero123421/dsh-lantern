/**
 * dsh-lantern, browser half: the `show_visual` tool row, the cards under the
 * final answer, and the sidebar tab type that shows a visual full size.
 */
import css from './style.css'
import { bind, TAB_ID, TAB_KIND } from './services.ts'
import { SidebarTab, Tail, tabTitle, ToolView, TOOL_NAME, turnDefinition } from './views.tsx'

export const name = 'dsh-lantern'
export const inject = ['slots', 'uiConversation', 'sidebarRight', 'sidebarRightTabs', 'sessions']

interface ClientContext {
  slots: {
    inject(name: string, register: () => unknown): unknown
    register(options: Record<string, unknown>, component: unknown): unknown
  }
  uiConversation: { events: { register(definition: unknown): unknown } }
  sidebarRight: unknown
  sidebarRightTabs: { register(definition: Record<string, unknown>): unknown }
  sessions: unknown
  effect(execute: () => unknown, label?: string): unknown
}

export function apply(rawCtx: unknown): void {
  const ctx = rawCtx as ClientContext
  bind({ sidebarRight: ctx.sidebarRight, sessions: ctx.sessions })

  ctx.effect(() => {
    const style = document.createElement('style')
    style.id = 'dsh-lantern-style'
    style.textContent = css
    document.head.appendChild(style)
    return () => style.remove()
  }, 'dsh-lantern: styles')

  ctx.effect(() => ctx.uiConversation.events.register(turnDefinition), 'dsh-lantern: turn data')

  ctx.slots.inject('tool.call.toolview', () => ctx.slots.register(
    { name: 'tool.call.toolview', key: TOOL_NAME }, ToolView,
  ))

  ctx.slots.inject('conversation.chat.turnTail', () => ctx.slots.register(
    { name: 'conversation.chat.turnTail', id: 'dsh-lantern' }, Tail,
  ))

  ctx.effect(() => ctx.sidebarRightTabs.register({
    id: TAB_ID,
    kind: TAB_KIND,
    patterns: ['dsh-resource://lantern-visual/**'],
    keepMounted: true,
    title: tabTitle,
  }), 'dsh-lantern: sidebar tab type')

  ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register(
    { name: 'sidebar.right.pane.tab', key: TAB_ID }, SidebarTab,
  )), 'dsh-lantern: sidebar tab body')
}
