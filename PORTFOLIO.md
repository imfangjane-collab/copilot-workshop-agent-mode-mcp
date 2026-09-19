![工作坊完成徽章](https://img.shields.io/badge/GitHub_Copilot_實戰工作坊-已完成-1F883D?style=for-the-badge&logo=githubcopilot&logoColor=white)

# 待辦清單 Web App

這是在 **GitHub Copilot 實戰工作坊**完成的純前端待辦清單。目標不是做一個複雜產品，而是走完「用 Agent 建應用、接 MCP、把修 issue 寫成可重複劇本」的完整流程。

## 線上展示

https://imfangjane-collab.github.io/copilot-workshop-agent-mode-mcp/

原始碼：https://github.com/imfangjane-collab/copilot-workshop-agent-mode-mcp

## 功能

- 新增待辦事項；空白內容不會送出
- 勾選完成／取消完成，完成項目會加上刪除線並淡化
- 刪除單筆待辦
- 底部顯示「未完成:N 項」，數字不受篩選影響
- 篩選：全部／未完成／已完成
- 篩選結果為空時，說明項目是被隱藏、不是被刪除
- 「清除已完成」按鈕：沒有已完成項目時隱藏，點擊前會跳出確認
- 深色模式切換；選擇會記住，從未手動切換時跟隨系統設定
- 資料存在 `localStorage`，重新整理後仍在
- 置中卡片版面，支援手機螢幕

## 技術

| 項目 | 內容 |
| :--- | :--- |
| 前端 | HTML、CSS、原生 JavaScript |
| 框架／套件 | 無，沒有 `package.json`，沒有建置流程 |
| 外部資源 | 無 CDN，可離線開啟 |
| 資料 | 瀏覽器 `localStorage` |
| 主題 | CSS 變數 + `prefers-color-scheme` |
| 部署 | GitHub Pages |

檔案結構：

```
index.html    # 版面
styles.css    # 樣式與深淺色主題
app.js        # 互動與資料存取
```

## 開發方式

| 階段 | 使用的能力 | 做了什麼 |
| :--- | :--- | :--- |
| 1 | Agent Mode | 依規格建立 `index.html`、`styles.css`、`app.js` |
| 2 | 多檔修改 | 加上深色模式與篩選 |
| 3 | MCP | 以 `.vscode/mcp.json` 接上 Microsoft Learn 與 GitHub，查官方文件並讀 repo issue |
| 4 | Agentic Workflow | 寫下 `.github/copilot-instructions.md` 與 `.github/prompts/fix-issue.prompt.md`，依 issue 開分支、修改、開 PR |
| 5 | 結業 | 合併 PR、開啟 GitHub Pages、寫本作品集頁 |

相關檔案：

- [`.github/copilot-instructions.md`](.github/copilot-instructions.md)
- [`.github/prompts/fix-issue.prompt.md`](.github/prompts/fix-issue.prompt.md)
- [`.vscode/mcp.json`](.vscode/mcp.json)
- [`CHANGELOG.md`](CHANGELOG.md)

## 我學到什麼

1. Agent Mode 給的是目標，不是逐步指令；它會自己開檔、改檔、再檢查結果。
2. 規格寫清楚，一次做完，比來回追問更省時間。
3. MCP 讓 AI 能查最新文件、讀 GitHub issue，不再只看本機檔案。
4. 先有檢查點與 git，才敢讓 AI 改多個檔案。
5. 把修 issue 的流程寫進 repo，第二次幾乎只要指定編號就能重跑。

## 授權

MIT
