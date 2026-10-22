/** Two live guide switches; rendering remains available when guides are off. */
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { copy } from './i18n.ts'

type GuideSetting = 'automaticVisuals' | 'advancedVisuals'
export interface SettingsForm {
  getSnapshot(): {
    status: 'loading' | 'ready' | 'unavailable'
    value: { automaticVisuals?: boolean; advancedVisuals?: boolean } | undefined
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

function GuideSwitch({ title, description, checked, disabled, onToggle }: {
  title: string; description: string; checked: boolean; disabled: boolean; onToggle(): void
}) {
  const id = useId()
  return <div className="lantern-settings-row">
    <div className="lantern-settings-copy">
      <h3 id={`${id}-title`}>{title}</h3>
      <p id={`${id}-description`}>{description}</p>
    </div>
    <button type="button" className="lantern-switch" role="switch" aria-checked={checked}
      aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} disabled={disabled} onClick={onToggle}>
      <span />
    </button>
  </div>
}

export function Settings({ form, locale }: { form: SettingsForm; locale: SettingsLocale }) {
  const state = useSyncExternalStore(listener => form.subscribe(listener), () => form.getSnapshot())
  const language = useSyncExternalStore(listener => locale.subscribe(listener), () => locale.getLocale().active)
  const t = copy(language)
  const [saving, setSaving] = useState(false)
  const [failed, setFailed] = useState(false)
  const mounted = useRef(true)
  const writing = useRef(false)
  useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])
  const ready = state.status === 'ready' && typeof state.value?.automaticVisuals === 'boolean'
    && typeof state.value?.advancedVisuals === 'boolean'

  async function toggle(key: GuideSetting) {
    if (!ready || !state.writable || writing.current) return
    writing.current = true
    setSaving(true)
    setFailed(false)
    try {
      const accepted = await form.mutate([{ op: 'set', path: [key], value: !state.value![key] }], state.revision)
      if (mounted.current) setFailed(!accepted)
    } catch {
      if (mounted.current) setFailed(true)
    } finally {
      writing.current = false
      if (mounted.current) setSaving(false)
    }
  }

  const disabled = !ready || !state.writable || saving
  return <section className="lantern-settings">
    <GuideSwitch title={t.automaticVisuals} description={t.automaticVisualsDescription}
      checked={ready && state.value!.automaticVisuals === true} disabled={disabled} onToggle={() => { void toggle('automaticVisuals') }} />
    <GuideSwitch title={t.advancedVisuals} description={t.advancedVisualsDescription}
      checked={ready && state.value!.advancedVisuals === true} disabled={disabled} onToggle={() => { void toggle('advancedVisuals') }} />
    <p className="lantern-settings-detail">{t.automaticVisualsTiming}</p>
    <p className="lantern-settings-detail">{t.guideSwitchesNote}</p>
    <div className="lantern-settings-status" role="status" aria-live="polite">
      {saving ? t.settingsSaving : state.status === 'loading' ? t.loading
        : !ready ? t.settingsUnavailable : !state.writable ? t.settingsReadOnly : ''}
    </div>
    {failed && <p className="lantern-note" data-kind="error" role="alert">{t.settingsSaveFailed}</p>}
  </section>
}
