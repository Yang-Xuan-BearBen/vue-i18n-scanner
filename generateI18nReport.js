const fs = require('fs')
const path = require('path')
const todoList = require('./i18n-todo.json')

// === key 生成规则（可按需优化）===
function generateKey(text) {
    if (text.includes('欢迎')) return 'welcome.message'
    if (text.includes('提交')) return 'button.submit'
    return 'text.' + text.slice(0, 5).replace(/\s+/g, '')
}

// === 初始化 markdown 行 ===
const mdLines = [
    '| 文件路径 | 行号 | 中文文本 | 建议 Key |',
    '|----------|------|----------|-----------|'
]

const suggestionMap = {}

todoList.forEach(item => {
    const filePath = item.file.replace(/\\/g, '/')
    const key = generateKey(item.text)

    // 填入 Markdown 表格行
    const mdLine = `| [${filePath}](${filePath}#L${item.loc}) | ${item.loc} | ${item.text} | ${key} |`
    mdLines.push(mdLine)

    // 写入 key -> 中文 的翻译候选
    suggestionMap[key] = item.text
})

// === 写入 Markdown 文件 ===
fs.writeFileSync('i18n-todo.md', mdLines.join('\n'), 'utf-8')
console.log('✅ Markdown 清单（含 key 建议）已生成：i18n-todo.md')

// === 写入 JSON 翻译建议文件 ===
fs.writeFileSync('i18n-suggestions.json', JSON.stringify(suggestionMap, null, 2), 'utf-8')
console.log('✅ 建议翻译 key/value 文件已生成：i18n-suggestions.json')
