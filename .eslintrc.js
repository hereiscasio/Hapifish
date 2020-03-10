module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript'
  ],
  rules: {
	/**
	 * for symbol such as `?`, `:` ...
	 * It's not a big deal to place it to approach nearby character
	 */
	'operator-linebreak': 0,
	/**
	 * It's not a big deal if we don't put a blank between parentheses & bracket
	 */
	'space-before-function-paren': 0,
	/**
	 * It's not a big deal if we don't put a blank between comment symbol & content
	 * so disable this linting temporarily
	 */
	'spaced-comment': 0,
	/**
	 *
	 */
	'multiline-comment-style': 0,
	/**
	 * the line comment should usually place in the end of line
	 * but sometimes, we need to place it above the line
	 * so disable this linting temporarily
	 */
	'line-comment-position': 0,
	'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
	'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
	/**
	 * For case of function, sometimes, we would like to move first brace to the next line,
	 * not always keep it in the same line as (function)parameter statement
	 */
	"brace-style": 0,
	/**
	 * Sometime, we want move bracket to next line,
	 * not always stay along with previous character(i.e. Parentheses) on the same line
	 */
	"keyword-spacing": 0,
	/**
	 * This configuration is too complex, it's hard to just use
	 * default or simple setting to cover so many layout scenarios
	 *
	 * Now just ignore it
	 */
	"key-spacing": 0,
	/**
	 * Do not throw error if i didn't give a newline at file end
	 */
	"eol-last": 0,
	/**
	 * Permit to use tab
	 */
	 "no-tabs": 0,
	/**
	 * Do not place bracket(i.e. `}` ) right before `else`, `else-if`
	 */
	// 'brace-style': [4, "stroustrup"],
	/**
	 *  only accept use tab as indentation
	 */
	"indent": [2, 'tab', {SwitchCase: 1}],

	"multiline-comment-style": ["error", "starred-block"],
	/**
	 * TODO: https://github.com/vuejs/eslint-plugin-vue/issues/362
	 */
	'vue/script-indent': [
		'error',
		"tab",
		{ 'baseIndent': 0, "switchCase": 1 }
	],
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
	/**
	 * avoid apply ESLint `rules > indent` on .vue file.
	 * for indentation algor, use `vue/script-indent` instead
	 * see more here: https://eslint.vuejs.org/rules/script-indent.html
	 */
  overrides: [
	{
		"files": ["*.vue"],
		"rules": {
		  "indent": "off"
		}
	},
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
