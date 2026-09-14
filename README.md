# NJUPT Initial

南京邮电大学 Robocon Initial 战队 GitHub Pages 站点。

- 线上地址（推送并开启 Pages 后）：https://njupt-initial.github.io
- 纯静态：`index.html` + `styles.css` + `main.js`，无构建步骤
- 本地预览：在仓库根目录执行 `python -m http.server 8080` 后打开 http://localhost:8080

## 部署

1. 将本仓库推送到组织 `NJUPT-Initial/NJUPT-Initial.github.io`
2. 仓库 Settings → Pages → Source 选择 `Deploy from a branch`，Branch 选 `main` / `(root)`
3. 等待 Actions 完成后访问 https://njupt-initial.github.io

## 维护

文案与成绩数据集中在 `index.html`。设计 token 见 `styles.css` 顶部 `:root`。
