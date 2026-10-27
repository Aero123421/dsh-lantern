/** UI copy in Japanese, English and Chinese, picked from the page language. */
import { useSyncExternalStore } from 'react'

const ja = {
  visual: 'ビジュアル',
  waiting: '回答待ち',
  answered: '回答済み',
  dismissed: 'スキップ',
  timeout: '時間切れ',
  closed: '終了',
  error: 'エラー',
  preparing: '作成中…',
  skip: 'スキップ',
  openSidebar: 'サイドバーで開く',
  collapse: '折りたたむ',
  expand: '展開する',
  shownBelow: '回答の下に表示しています',
  shownInSidebar: 'サイドバーに表示しています',
  answerInSidebar: 'サイドバーで回答してください',
  replaced: '新しい版に更新しました',
  showNew: '新しい版へ',
  scriptError: 'ビジュアル内のスクリプトでエラー',
  sendFailed: '送信できませんでした',
  missing: 'このビジュアルの内容が見つかりません。チャットから開き直してください。',
  loading: '読み込み中…',
  fileError: 'ファイルを開けませんでした',
  answerPrefix: '回答',
  notWaiting: 'エージェントはもう待っていません',
  wheelHint: 'クリックするとホイールで操作できます',
  glLost: '3D 表示を一時停止しました（同時に動かせる数の上限）',
  navigated: 'ページが移動したため操作を停止しました。DSH を再読み込みすると、このビジュアルの操作を再開できます。',
  stillWriting: 'ビジュアルはまだ書き込まれています。',
  needsUserAction: 'ビジュアルの中での操作だけが、これを実行できます。',
  tooFast: '操作が速すぎます。',
  tooManyMessages: 'このビジュアルからの送信が多すぎます。',
  answerTooLarge: '回答が大きすぎます。',
  alreadySettled: 'このビジュアルはすでに確定しています。',
  answerNotJson: '回答が JSON ではありません。',
  emptyMessage: 'メッセージが空です。',
  alreadyAnswered: 'すでに回答済みです。',
  visualClosed: 'このビジュアルはすでに終了しています。',
  noLongerWaiting: 'このビジュアルはもう回答を待っていません。',
  noSession: 'セッションがありません。',
  conversationUnavailable: '会話サービスを利用できません。',
  resume: '再開',
  run: '実行',
  paused: '停止中です。実行するまでスクリプトは動きません。',
  leave: 'スクリプトを動かすと、カード自身の遷移で、許可したフォルダの中身を外へ送れます。',
  leaveInline: 'スクリプトを動かすと、カード自身の遷移でデータを外へ送れます。',
  automaticVisuals: '会話内ビジュアルを自動で使う',
  automaticVisualsDescription: '選択肢・自由入力・比較・図解を自然に使います。軽量な lantern-chat-ux ガイドも有効になります。',
  advancedVisuals: '高度な表現ガイドを使う',
  advancedVisualsDescription: '3D・Canvas・WebGL などの lantern-visuals ガイドを同梱します。必要なときだけ /lantern-visuals で読み込みます。',
  guideSwitchesNote: 'どちらをオフにしても描画基盤や既存の表示は残ります。オフにしたガイドを新しく読み込まなくなります。',
  automaticVisualsTiming: '変更は自動で保存され、次の回答から反映されます。スキルの読み込みは必要ありません。',
  automaticVisualsOff: 'オフでも、図やインタラクティブな表示を直接依頼できます。',
  settingsSaving: '保存中…',
  settingsUnavailable: '設定を読み込めません。接続を確認してプラグイン画面を開き直してください。',
  settingsReadOnly: 'このプロファイルでは設定を変更できません。',
  settingsSaveFailed: '保存できませんでした。現在の設定を確認して、もう一度お試しください。',
}

type Copy = typeof ja

const en: Copy = {
  visual: 'Visual',
  waiting: 'Waiting for you',
  answered: 'Answered',
  dismissed: 'Skipped',
  timeout: 'Timed out',
  closed: 'Closed',
  error: 'Error',
  preparing: 'Building…',
  skip: 'Skip',
  openSidebar: 'Open in sidebar',
  collapse: 'Collapse',
  expand: 'Expand',
  shownBelow: 'Shown below the answer',
  shownInSidebar: 'Shown in the sidebar',
  answerInSidebar: 'Answer it in the sidebar',
  replaced: 'Updated to a newer version',
  showNew: 'Go to the new version',
  scriptError: 'A script in the visual failed',
  sendFailed: 'Could not send',
  missing: 'This visual is not loaded. Open it again from the chat.',
  loading: 'Loading…',
  fileError: 'Could not open the file',
  answerPrefix: 'Answer',
  notWaiting: 'The agent is no longer waiting',
  wheelHint: 'Click the visual to use the scroll wheel in it',
  glLost: 'The 3D view was paused (too many running at once)',
  navigated: 'This page navigated and its visual controls stopped. Reload DSH to restore them.',
  stillWriting: 'The visual is still being written.',
  needsUserAction: 'Only a user action inside the visual can do this.',
  tooFast: 'Too fast.',
  tooManyMessages: 'Too many messages from this visual.',
  answerTooLarge: 'The answer is too large.',
  alreadySettled: 'This visual is already settled.',
  answerNotJson: 'The answer is not JSON.',
  emptyMessage: 'Empty message.',
  alreadyAnswered: 'This visual is already answered.',
  visualClosed: 'This visual is already closed.',
  noLongerWaiting: 'This visual is no longer waiting for an answer.',
  noSession: 'There is no session.',
  conversationUnavailable: 'The conversation service is unavailable.',
  resume: 'Resume',
  run: 'Run',
  paused: 'Paused. Scripts stay off until you run it.',
  leave: 'Running scripts lets this card send the contents of the allowed folder out by navigating itself.',
  leaveInline: 'Running scripts lets this card send data out by navigating itself.',
  automaticVisuals: 'Use conversation visuals automatically',
  automaticVisualsDescription: 'Use choices, text input, comparisons and diagrams naturally. Includes the lightweight lantern-chat-ux guide.',
  advancedVisuals: 'Enable the advanced visual guide',
  advancedVisualsDescription: 'Bundle the lantern-visuals guide for 3D, Canvas and WebGL. Load it only when needed with /lantern-visuals.',
  guideSwitchesNote: 'Switching a guide off stops new guide loads, not the rendering runtime or existing visuals.',
  automaticVisualsTiming: 'Changes save automatically and apply to the next response. No skill loading is required.',
  automaticVisualsOff: 'When off, you can still ask for diagrams or interactive visuals directly.',
  settingsSaving: 'Saving…',
  settingsUnavailable: 'Settings are unavailable. Check the connection and reopen the plugin page.',
  settingsReadOnly: 'Settings cannot be changed in this profile.',
  settingsSaveFailed: 'Could not save. Check the current setting and try again.',
}

const zh: Copy = {
  visual: '可视化',
  waiting: '等待回答',
  answered: '已回答',
  dismissed: '已跳过',
  timeout: '已超时',
  closed: '已结束',
  error: '错误',
  preparing: '生成中…',
  skip: '跳过',
  openSidebar: '在侧边栏打开',
  collapse: '收起',
  expand: '展开',
  shownBelow: '显示在回答下方',
  shownInSidebar: '显示在侧边栏',
  answerInSidebar: '请在侧边栏中回答',
  replaced: '已更新为新版本',
  showNew: '查看新版本',
  scriptError: '可视化中的脚本出错',
  sendFailed: '发送失败',
  missing: '未加载此可视化内容，请从对话中重新打开。',
  loading: '加载中…',
  fileError: '无法打开文件',
  answerPrefix: '回答',
  notWaiting: '智能体已不再等待',
  wheelHint: '点击后即可在其中使用滚轮',
  glLost: '3D 视图已暂停（同时运行的数量已达上限）',
  navigated: '页面已跳转，交互已停止。请重新加载 DSH 以恢复此可视化的操作。',
  stillWriting: '可视化仍在写入。',
  needsUserAction: '只有可视化内部的用户操作可以执行此操作。',
  tooFast: '操作过快。',
  tooManyMessages: '此可视化发送的消息过多。',
  answerTooLarge: '回答过大。',
  alreadySettled: '此可视化已经确定。',
  answerNotJson: '回答不是 JSON。',
  emptyMessage: '消息为空。',
  alreadyAnswered: '此可视化已经回答。',
  visualClosed: '此可视化已经结束。',
  noLongerWaiting: '此可视化已不再等待回答。',
  noSession: '没有会话。',
  conversationUnavailable: '无法使用对话服务。',
  resume: '继续',
  run: '运行',
  paused: '已暂停。点击运行前不会执行脚本。',
  leave: '运行脚本后，卡片可以通过自身跳转，把已允许文件夹中的内容送出去。',
  leaveInline: '运行脚本后，卡片可以通过自身跳转把数据送出去。',
  automaticVisuals: '自动使用对话可视化',
  automaticVisualsDescription: '自然地使用选项、文字输入、比较和图解，并启用轻量的 lantern-chat-ux 指南。',
  advancedVisuals: '启用高级可视化指南',
  advancedVisualsDescription: '内置支持 3D、Canvas 和 WebGL 的 lantern-visuals 指南。需要时通过 /lantern-visuals 加载。',
  guideSwitchesNote: '关闭指南只停止新的指南加载，不会禁用渲染能力或已有可视化。',
  automaticVisualsTiming: '更改会自动保存，并从下一次回答生效。无需加载技能。',
  automaticVisualsOff: '关闭后，仍可直接请求图表或交互式可视化。',
  settingsSaving: '保存中…',
  settingsUnavailable: '无法加载设置。请检查连接并重新打开插件页面。',
  settingsReadOnly: '此配置无法修改设置。',
  settingsSaveFailed: '保存失败。请检查当前设置后重试。',
}

/** BCP 47 tag Lantern should follow: the document language DSH set, nothing from the browser. */
export function lang(): string {
  return (typeof document !== 'undefined' && document.documentElement.lang || 'en').toLowerCase()
}

/** Map a language tag to Lantern's dictionaries. Anything else is English. */
export function uiLangFrom(documentLang: string): 'ja' | 'zh' | 'en' {
  const value = documentLang.toLowerCase()
  if (value.startsWith('ja')) return 'ja'
  if (value.startsWith('zh')) return 'zh'
  return 'en'
}

/**
 * Card chrome follows only `document.documentElement.lang`.
 * Settings may pass DSH's locale. Neither path reads `navigator`. Dictionaries only.
 */
export function uiLang(locale?: string): 'ja' | 'zh' | 'en' {
  if (locale !== undefined) return uiLangFrom(locale)
  return uiLangFrom(typeof document !== 'undefined' ? document.documentElement.lang : '')
}

export function copy(locale?: string): Copy {
  const value = uiLang(locale)
  return value === 'ja' ? ja : value === 'zh' ? zh : en
}

const langListeners = new Set<() => void>()
let langWatch: MutationObserver | undefined

function watchDocumentLang(): void {
  if (langWatch !== undefined || typeof document === 'undefined') return
  langWatch = new MutationObserver(() => { for (const listener of langListeners) listener() })
  langWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })
}

export function subscribeCopy(listener: () => void): () => void {
  watchDocumentLang()
  langListeners.add(listener)
  return () => langListeners.delete(listener)
}

/** Card chrome that follows `document.documentElement.lang` when DSH changes it. */
export function useCopy(): Copy {
  return useSyncExternalStore(subscribeCopy, copy, () => en)
}
