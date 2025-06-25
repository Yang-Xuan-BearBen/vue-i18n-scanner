# 🧠 vue-i18n-scanner

基于 AST 的 Vue 国际化扫描工具  
自动识别 Vue 模板中未翻译的中文字段，生成待办清单和翻译 key 建议，提升翻译覆盖率，减少人工成本。

---

## ✨ 功能亮点

- 🔍 扫描所有 `.vue` 文件，提取写死中文
- 📦 输出 JSON、Markdown 格式清单（支持跳转）
- 💡 自动生成翻译 key-value 建议
- 📄 Markdown 表格支持 VS Code 点击跳转

---

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 扫描 src 目录
node scanVueProject.js

# 3. 生成报告（Markdown + 建议 key）
node generateI18nReport.js
