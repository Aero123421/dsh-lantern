// Lets the tests import `.css` files as text, like the esbuild build does.
import { register } from 'node:module'
register('./css-hooks.mjs', import.meta.url)
