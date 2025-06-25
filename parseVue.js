const fs = require('fs')
const path = require('path')
const parser = require('vue-eslint-parser')

const filePath = path.resolve(__dirname, 'Hello.vue')
const content = fs.readFileSync(filePath, 'utf-8')

// 解析 AST
const ast = parser.parse(content, {
    sourceType: 'module',
    ecmaVersion: 2020,
})

// 用 Set 记录访问过的节点，防止循环引用导致爆栈
const visited = new Set()

function walk(node) {
    if (!node || typeof node !== 'object') return
    if (visited.has(node)) return
    visited.add(node)

    // 找中文文本
    if (node.type === 'VText' && /[\u4e00-\u9fa5]/.test(node.value)) {
        console.log('发现中文文本：', node.value.trim())
    }

    // 遍历所有子节点
    for (const key in node) {
        const child = node[key]
        if (Array.isArray(child)) {
            child.forEach(walk)
        } else if (typeof child === 'object' && child !== null) {
            walk(child)
        }
    }
}

// 入口：只遍历 template 部分
walk(ast.templateBody)
