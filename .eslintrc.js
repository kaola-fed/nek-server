// http://eslint.org/docs/user-guide/configuring

module.exports = {
  extends: 'kaola/esnext',
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'semi': [2, 'always'], // 要求在行末加上分号,
    'line-style': 'off',
    'comma-dangle': ['error', 'only-multiline'],
    'no-negated-condition': 0,
    'indent': [2, 2, {
      // case 用一个缩进
      'SwitchCase': 1,
      // 变量声明用一个缩进
      'VariableDeclarator': 1,
      'outerIIFEBody': 1,
      'MemberExpression': 1,
      'FunctionDeclaration': {'body': 1, 'parameters': 2},
      'FunctionExpression': {'body': 1, 'parameters': 2},
      'CallExpression': {'arguments': 1}
    }],
    'arrow-body-style': 0,
    'object-shorthand': ['warn', 'properties'],
  }
};
