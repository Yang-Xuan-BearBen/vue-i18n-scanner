// i18n-todo.md 示例生成脚本
const fs = require('fs')
const todoList = require('./i18n-todo.json')

const lines = [
  '| 文件路径 | 行号 | 中文文本 |',
  '|----------|------|----------|'
]

todoList.forEach(item => {
  const filePath = item.file.replace(/\\/g, '/')
  const mdLine = `| [${filePath}](${filePath}#L${item.loc}) | ${item.loc} | ${item.text} |`
  lines.push(mdLine)
})

fs.writeFileSync('i18n-todo.md', lines.join('\n'), 'utf-8')
console.log('✅ Markdown 清单已生成：i18n-todo.md')
