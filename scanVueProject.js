const fs = require('fs')
const path = require('path')
const glob = require('glob')
const parser = require('vue-eslint-parser')

// 中文匹配正则
const chineseRegex = /[\u4e00-\u9fa5]/

// 待办项列表
const todoList = []

// 记录已访问节点避免死循环
function walk(node, filePath) {
    const visited = new Set()

    function _walk(n) {
        if (!n || typeof n !== 'object') return
        if (visited.has(n)) return
        visited.add(n)

        if (n.type === 'VText' && chineseRegex.test(n.value)) {
            todoList.push({
                file: filePath,
                text: n.value.trim(),
                loc: n.loc.start.line,
            })
        }

        for (const key in n) {
            const child = n[key]
            if (Array.isArray(child)) {
                child.forEach(_walk)
            } else if (typeof child === 'object' && child !== null) {
                _walk(child)
            }
        }
    }

    _walk(node)
}

// 扫描 .vue 文件
function scanProject(dir) {
    const files = glob.sync(`${dir}/**/*.vue`)
    console.log(`发现 ${files.length} 个 .vue 文件，开始分析...`)

    files.forEach((filePath) => {
        const code = fs.readFileSync(filePath, 'utf-8')
        const ast = parser.parse(code, {
            sourceType: 'module',
            ecmaVersion: 2020,
            loc: true,
        })

        if (ast.templateBody) {
            walk(ast.templateBody, filePath)
        }
    })
}

// 启动分析
scanProject(path.resolve(__dirname, 'src'))

// 输出为 JSON 文件
const outputPath = path.resolve(__dirname, 'i18n-todo.json')
fs.writeFileSync(outputPath, JSON.stringify(todoList, null, 2), 'utf-8')
console.log(`✅ 扫描完成，结果已保存到 ${outputPath}`)
