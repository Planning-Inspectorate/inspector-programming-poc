import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
	{
		// ignores in its own object to apply to all configs
		ignores: ['dist/**', 'node_modules/**', '**/*.min*.js', '**/.static/**/*.js']
	},
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				...globals.node
			}
		}
	},
	eslintConfigPrettier
];
