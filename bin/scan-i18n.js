#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const glob = require('glob')
const { parse } = require('vue-eslint-parser')

const isChinese = str => /[\u4e00-\u9fa5]/.test(str)

function generateKey(text) {
    if (text.includes('欢迎')) return 'welcome.message'
    if (text.includes('提交')) return 'button.submit'
    return 'text.' + text.slice(0, 5).replace(/\s+/g, '')
}

function scanVueFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf-8')
    const ast = parse(code, { sourceType: 'module' })

    const result = []

    function walk(node) {
        if (!node || typeof node !== 'object') return
        if (Array.isArray(node)) return node.forEach(walk)

        if (node.type === 'VText' && isChinese(node.value)) {
            result.push({
                file: filePath,
                text: node.value.trim(),
                loc: node.loc.start.line
            })
        }

        for (const key in node) {
            walk(node[key])
        }
    }

    walk(ast.templateBody)
    return result
}

function main(projectRoot = './') {
    const files = glob.sync(`${projectRoot}/**/*.vue`)
    const all = []

    files.forEach(file => {
        const res = scanVueFile(file)
        all.push(...res)
    })

    fs.writeFileSync('todo-i18n.json', JSON.stringify(all, null, 2), 'utf-8')

    const md = [
        '| 文件路径 | 行号 | 中文文本 | 建议 Key |',
        '|----------|------|----------|-----------|'
    ]

    const suggestions = {}

    all.forEach(item => {
        const file = item.file.replace(/\\/g, '/')
        const key = generateKey(item.text)
        md.push(`| [${file}](${file}#L${item.loc}) | ${item.loc} | ${item.text} | ${key} |`)
        suggestions[key] = item.text
    })

    fs.writeFileSync('todo-i18n.md', md.join('\n'), 'utf-8')
    fs.writeFileSync('suggest-i18n.json', JSON.stringify(suggestions, null, 2), 'utf-8')

    console.log('✅ 输出完成：todo-i18n.md / todo-i18n.json / suggest-i18n.json')
}

main(process.argv[2] || './')
