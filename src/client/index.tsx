/**
 * dsh-lantern, browser half: the `show_visual` tool row, visuals at their original position in the
 * conversation, and the sidebar tab type that shows a visual full size.
 */
import css from './style.css'
import { bind, TAB_ID, TAB_KIND } from './services.ts'
import { watchLocalStorage } from './store.ts'
import { Settings, type SettingsForm, type SettingsLocale } from './Settings.tsx'
import { SidebarTab, FlowVisual, tabTitle, ToolView, TOOL_NAME, TURN_KEY, turnDefinition } from './views.tsx'

export const name = 'dsh-lantern'
export const inject = ['slots', 'uiConversation', 'sidebarRight', 'sidebarRightTabs', 'sessions', 'configForms', 'locale']

interface ClientContext {
  slots: {
    inject(name: string, register: () => unknown): unknown
    register(options: Record<string, unknown>, component: unknown): unknown
  }
  uiConversation: {
    events: { register(definition: unknown): unknown }
  }
  sidebarRight: unknown
  sidebarRightTabs: { register(definition: Record<string, unknown>): unknown }
  sessions: { binding(sessionId: string): unknown }
  configForms: { get(entryId: string): SettingsForm }
  locale: SettingsLocale
  effect(execute: () => unknown, label?: string): unknown
}

export function apply(rawCtx: unknown): void {
  const ctx = rawCtx as ClientContext
  bind({ sidebarRight: ctx.sidebarRight, sessions: ctx.sessions })
  ctx.effect(watchLocalStorage, 'dsh-lantern: other browser tabs')

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

  const form = ctx.configForms.get('dsh-lantern')
  ctx.slots.inject('plugins.bundle.config', () => ctx.slots.register(
    { name: 'plugins.bundle.config', key: 'dsh-lantern', inject: () => ({ form, locale: ctx.locale }) }, Settings,
  ))

  ctx.slots.inject('conversation.chat.node', () => ctx.slots.register(
    { name: 'conversation.chat.node', key: TURN_KEY }, FlowVisual,
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
