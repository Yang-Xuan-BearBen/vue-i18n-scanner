const fs = require('fs')
const todoList = require('./i18n-todo.json')

// 简单规则：文本映射 key（去空格 + 拼音前缀或模板 key）
function generateKey(text) {
    if (text.includes('欢迎')) return 'welcome.message'
    if (text.includes('提交')) return 'button.submit'
    return 'text.' + text.slice(0, 5)
}

const map = {}
todoList.forEach(item => {
    const key = generateKey(item.text)
    map[key] = item.text
})

fs.writeFileSync('i18n-suggestions.json', JSON.stringify(map, null, 2), 'utf-8')
console.log('✅ 建议翻译 key 已生成：i18n-suggestions.json')
