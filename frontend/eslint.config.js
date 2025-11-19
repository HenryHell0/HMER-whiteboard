import { defineConfig } from 'eslint-define-config'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'

export default defineConfig([
	{
		// Lint all relevant files
		files: ['**/*.{ts,tsx,js,mjs,jsx,vue}'],

		// Tell ESLint how to PARSE TypeScript + Vue
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 'latest',
				extraFileExtensions: ['.vue'],
				project: ['./tsconfig.json'], // enables full type-check rules
			},
			globals: {
				window: 'readonly',
				document: 'readonly',
			},
		},

		plugins: {
			'@typescript-eslint': tsPlugin,
			vue,
		},

		// Use recommended rule sets
		rules: {
			...vue.configs['vue3-essential'].rules,
			...tsPlugin.configs.recommended.rules,

			// Your custom vue exceptions
			'vue/multi-word-component-names': [
				'error',
				{
					ignores: ['Widget', 'Toolbar', 'Expression', 'Graph', 'Widgets'],
				},

			],
		},
	},

	// Prettier last so it disables formatting rules
	prettier,
])
