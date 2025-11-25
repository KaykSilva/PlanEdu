// eslint.config.js
import { defineConfig } from 'eslint-define-config'
import pluginVue from 'eslint-plugin-vue'
import ts from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import js from '@eslint/js'
import globals from 'globals'

export default defineConfig([
  {
    files: ['**/*.{ts,tsx,js,jsx,vue}'],

    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
    ],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      parser: tsParser,

      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },

    plugins: {
      vue: pluginVue,
      '@typescript-eslint': ts,
    },

    extends: [
      js.configs.recommended,
      ...pluginVue.configs['flat/essential'],
      ts.configs.recommended
    ],
  },
])
