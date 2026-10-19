/** Model-facing text for `show_visual`. Kept short: the design guide is the `lantern-visuals` skill. */

export const TOOL_NAME = 'show_visual'
export const SKILL_NAME = 'lantern-visuals'

export function toolDescription(timeoutMinutes: number): string {
  return [
    'Show an HTML visual to the user in DSH Web, inline in the chat (default) or in the right sidebar.',
    'Use it when a diagram, chart, explorer, comparison, choice cards, a short form or an interactive tool (3D model, simulation, game, drag-to-rank answer) helps more than prose; keep explanations in your reply text.',
    `Load the \`${SKILL_NAME}\` skill before your first visual in a session: it has the kit (tokens, components), the \`window.lantern\` API and patterns.`,
    'Pass `html` (a fragment or a full document; the kit and the DSH light/dark theme are preloaded, and your own styles override them) or `path` (an HTML file in the workspace, shown in the sidebar with its relative files).',
    `Set \`await_response: true\` to wait for the user's answer (sent with \`lantern.submit\` or a \`data-lt-submit\` button); it returns as this tool's result. Waiting ends after about ${timeoutMinutes} minutes; a later answer arrives as a user message.`,
    'Pass `replace` with an earlier visual\'s `id` to show a revised version instead of a new card.',
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
