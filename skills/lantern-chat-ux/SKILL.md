---
name: lantern-chat-ux
user-invocable: true
description: Optional fast conversational UX guide for show_visual in DSH. Use for choosing, comparing, collecting labeled text input, or exploring a small diagram within an answer. Ordinary visuals already have the necessary system and tool instructions; do not load this guide as a prerequisite for every visual.
---

# Lantern chat UX

No skill loading is required for ordinary `show_visual` calls.

Make the next conversational step easier to understand or perform. A visual is part of the answer, not a separate application. Do not add UI to a simple answer that is already clear in prose.

## Choose the smallest useful interaction

Use two to six choices for a decision, a labeled form when several details are needed, a compact comparison when trade-offs matter, or a diagram with one or two controls when changing a parameter teaches something. Include an optional text field when fixed options cannot express the user's intent. Keep advanced controls behind a disclosure.

Call `show_visual` at the point where the visual belongs: useful explanation, visual, then interpretation or the next step. It becomes a native conversation node; it is not an arbitrary insertion into an already-written Markdown paragraph. Use the panel only when the user needs a larger workspace.

## Use the built-in DSH appearance

The theme, typography, spacing and input styles are preloaded. Start with `lt-stack`, `lt-row`, `lt-choices`, `lt-choice` and `lt-field`. Do not wrap the entire answer in `lt-card`, repeat a toolbar title, add another page background, or recreate a chat composer. Put each choice title **above** its explanation. Use one column on phones. Keep focus indicators and labels visible.

Use `--lt-fg` for body text, `--lt-fg-2` for descriptions, and `--lt-*-text` tokens for colored labels. Pair filled accent buttons with `--lt-accent-fg`. Color must not be the only selection cue. Rich colors belong in the visual itself, not behind every sentence.

## Inputs and conversation

A `<form data-lt-form>` submits its named controls through `lantern.submit`. Use native `input`, `textarea`, `select`, `required`, and a labeled `button type="submit"`. The runtime preserves entered values after failure, guards IME composition and duplicate sends, and reports sending/success/error. Textareas use Enter for a newline; opt in to Ctrl/Command+Enter with `data-lt-submit-key="mod-enter"`.

Set `await_response:true` only if the agent must wait for the answer. Otherwise a deliberate submission continues the conversation. Sliders, filters, tabs, and previews respond locally without extra model calls. Never submit on typing, focus, or page load. Save non-sensitive inputs intentionally with `lantern.setState/getState`; do not save passwords or secrets.

Keep the conclusion, sources, units, and assumptions in ordinary answer text. Revise with `replace` instead of accumulating duplicate visuals. Custom HTML, SVG, Canvas, and WebGL remain available; the shared kit is a starting point, not a whitelist. Consult `lantern-visuals` explicitly for advanced rendering details when requested.
