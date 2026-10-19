/** Self-contained tool instructions; the bundled design guide is optional. */

export const TOOL_NAME = 'show_visual'
export const SKILL_NAME = 'lantern-visuals'

export function toolDescription(timeoutMinutes: number): string {
  return [
    'Render HTML in DSH Web: inline in chat, or `display:"panel"` for more space. Pass exactly one of `html` or workspace `path` (HTML plus relative assets, always in the panel).',
    'The light/dark theme and CSS kit are preloaded: --lt-* tokens; lt-card, lt-stack, lt-row classes. Use native labeled controls and local JavaScript for live changes.',
    'window.lantern provides submit(JSON), send(text) for a follow-up message, setState(JSON)/getState() for saved inputs, and expand(). Submit/send require a user action.',
    'Embed data for html: fetch is blocked. Libraries can load from cdn.jsdelivr.net/npm; path pages can also fetch relative workspace assets.',
    'A button can use data-lt-submit=\'"yes"\'; a form with data-lt-form submits its named fields. Set await_response:true only to wait for the answer as this tool result.',
    `Waiting expires after ${timeoutMinutes} minutes. Keep the conclusion and sources in prose. Use replace with an earlier visual id to revise it. No skill loading is needed.`,
  ].join(' ')
}

export const PARAMETERS = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Short title shown on the card and the sidebar tab.' },
    html: { type: 'string', description: 'HTML to render: a fragment or a complete document. Omit when `path` is given.' },
    path: { type: 'string', description: 'Workspace HTML file to show instead of `html`, relative to the working directory or absolute inside it.' },
    display: { type: 'string', enum: ['inline', 'panel'], description: '`inline` (default) in the chat, or `panel` in the right sidebar. `path` visuals always open in the sidebar.' },
    await_response: { type: 'boolean', description: 'Wait for the user\'s answer and return it as the result.' },
    replace: { type: 'string', description: 'The `id` of an earlier visual this one revises.' },
  },
  required: ['title'],
} as const
