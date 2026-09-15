# NJUPT Initial

南京邮电大学 Initial ROBOCON 战队网站，使用 GitHub Pages 部署。

- 线上地址：https://njupt-initial.github.io/
- `index.html`：战队介绍、比赛成绩、成立历程。
- `robocon.html`：2026 赛项、官方赛事入口、技术分组。
- `team.html`：四组介绍、工位待定说明、QQ 招新入口、常见问题。
- `styles.css`、`main.js`：共享样式、入口动画和群号复制。

## 本地预览与检查

不需要构建。执行 `python -m http.server 8080`，访问 http://localhost:8080/ 。

提交前执行 `node --check main.js`、`git diff --check`，并在浏览器检查三页：

- 手机导航完整显示，无横向溢出；页内链接能到达对应章节。
- 首次打开先显示标语，再显示入口；下滚、上滑或点击进入按钮揭幕。键盘支持 Enter，Tab 可切换入口控件。
- 同一标签页会话不重复显示入口；回到顶部向上滚可主动重播。
- 系统开启减少动态效果时跳过入口，页面可滚动。切换该设置也能解除入口锁定。
- FAQ 可展开、群号可复制；禁止剪贴板访问时仍显示可手动复制的群号。
- 禁用 JavaScript 后，正文、导航、FAQ 和 QQ 群链接仍可访问。

## 内容维护

战队成立年份与 2026 年 7 月成绩见[组织介绍](https://github.com/NJUPT-Initial/.github/blob/main/profile/README.md)。赛事名称、规则与公告以[ROBOCON 官网](https://www.robocon.org.cn/h-col-104.html)为准。

工位、实验室位置与招新安排未确认前，只写当前状态和咨询方式，不补写日期、人数或培训承诺。

## 部署

1. 使用 `gh auth setup-git` 配置 GitHub CLI 凭据，提交后执行 `git push origin main`。
2. Pages 使用 `main` 分支根目录；通过 `gh run list --branch main` 查看部署结果。
3. 部署完成后检查线上三页和静态资源。功能分支不随站点更新自动同步。
