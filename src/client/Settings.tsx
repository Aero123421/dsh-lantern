/** Lantern's live preference on the DSH Plugins detail page. */
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { copy } from './i18n.ts'

export interface SettingsForm {
  getSnapshot(): {
    status: 'loading' | 'ready' | 'unavailable'
    value: { automaticVisuals?: boolean } | undefined
    writable: boolean
    revision: number | undefined
  }
  subscribe(listener: () => void): () => void
  mutate(ops: { op: 'set'; path: string[]; value: boolean }[], revision?: number): Promise<boolean>
}

export interface SettingsLocale {
  getLocale(): { active: string }
  subscribe(listener: () => void): () => void
}

export function Settings({ form, locale }: { form: SettingsForm; locale: SettingsLocale }) {
  const state = useSyncExternalStore(listener => form.subscribe(listener), () => form.getSnapshot())
  const language = useSyncExternalStore(listener => locale.subscribe(listener), () => locale.getLocale().active)
  const t = copy(language)
  const [saving, setSaving] = useState(false)
  const [failed, setFailed] = useState(false)
  const mounted = useRef(true)
  const writing = useRef(false)
  const titleId = useId()
  const descriptionId = useId()
  useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])
  const ready = state.status === 'ready' && typeof state.value?.automaticVisuals === 'boolean'

  async function toggle() {
    if (!ready || !state.writable || writing.current) return
    writing.current = true
    setSaving(true)
    setFailed(false)
    try {
      const accepted = await form.mutate([
        { op: 'set', path: ['automaticVisuals'], value: !state.value!.automaticVisuals },
      ], state.revision)
      if (mounted.current) setFailed(!accepted)
    } catch {
      if (mounted.current) setFailed(true)
    } finally {
      writing.current = false
      if (mounted.current) setSaving(false)
    }
  }

  return <section className="lantern-settings" aria-labelledby={titleId}>
    <div className="lantern-settings-row">
      <div className="lantern-settings-copy">
        <h3 id={titleId}>{t.automaticVisuals}</h3>
        <p id={descriptionId}>{t.automaticVisualsDescription}</p>
      </div>
      <button type="button" className="lantern-switch" role="switch"
        aria-checked={ready && state.value!.automaticVisuals === true}
        aria-labelledby={titleId} aria-describedby={descriptionId}
        disabled={!ready || !state.writable || saving} onClick={() => { void toggle() }}>
        <span />
      </button>
    </div>
    <p className="lantern-settings-detail">{t.automaticVisualsTiming}</p>
    <p className="lantern-settings-detail">{t.automaticVisualsOff}</p>
    <div className="lantern-settings-status" role="status" aria-live="polite">
      {saving ? t.settingsSaving : state.status === 'loading' ? t.loading
        : !ready ? t.settingsUnavailable : !state.writable ? t.settingsReadOnly : ''}
    </div>
    {failed && <p className="lantern-note" data-kind="error" role="alert">{t.settingsSaveFailed}</p>}
  </section>
}
