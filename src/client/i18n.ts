/** UI copy in Japanese, English and Chinese, picked from the page language. */

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
  resume: '再開',
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
  resume: 'Resume',
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
  resume: '继续',
}

export function lang(): string {
  const value = (typeof document !== 'undefined' && document.documentElement.lang) || (typeof navigator !== 'undefined' && navigator.language) || 'en'
  return value.toLowerCase()
}

/** The language Lantern speaks: DSH's UI language, except that a Japanese browser gets Japanese. */
export function uiLang(): 'ja' | 'zh' | 'en' {
  const value = lang()
  if (value.startsWith('ja')) return 'ja'
  if (value.startsWith('zh')) return 'zh'
  // DSH Web's own UI is English or Chinese; a Japanese browser still gets Japanese.
  if (typeof navigator !== 'undefined' && navigator.languages?.some(item => item.toLowerCase().startsWith('ja'))) return 'ja'
  return 'en'
}

export function copy(): Copy {
  const value = uiLang()
  return value === 'ja' ? ja : value === 'zh' ? zh : en
}
