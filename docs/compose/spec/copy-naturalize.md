---
feature: copy-naturalize
status: delivered
updated: 2026-09-16
branch: feat/copy-naturalize
commits: d345442..d345442
---

# 站点文案再自然化

## Report

**What was built** — 在已有去 AI 味与一轮说人话的基础上，对 `index.html`、`team.html`、`robocon.html` 的用户可见中文再压一轮：去掉「同步 / 确认 / 咨询 / 切入点 / 执行顺序」等官网腔，改成短句和具体动词（分头做、找 X 组聊聊、哪里不对改哪里）。奖项、群号、四组名、「待确定」、外链与页面结构未动。

**Verification** — `node --check main.js` 通过；关键事实（国家二/三等奖、1098311500、待确定、机械/硬件/电控/算法、2026/2002、GitHub/QQ/官网链接）均在；`git diff --stat` 仅三页 HTML 措辞改动（44+/44-）。独立审阅无 critical。

**Journey log** — worktree 注册与 `git switch main` 被会话隔离策略拦截，按用户要求在当前工作区文件上直接完成；lieflat 白名单在改写前已基本无命中，故按用户选定的「放宽表达」口径执行。

## [S1] Problem

三页站点文案（`index.html` / `robocon.html` / `team.html`）已去过一轮 AI 味并做过一次说人话润色，但仍有一批偏官网腔、偏紧、偏公文的句子，读起来不像学生机器人战队在说话。

## [S2] Design

在保留全部事实、结构、链接与 `DESIGN_NOTES.md` 文案约束的前提下，把用户可见中文再压一轮自然口语：

- 事实不改：年份、奖项、赛项名、群号、四个组名、「待确定」、外链
- 结构不改：标题层级、段落顺序、列表/卡片位置、导航与按钮文案功能
- 语体：短句优先，动词具体（画/焊/写/装/调），少套话、少「安排/确认/同步/咨询」类空转动词
- lieflat 白名单仍作辅助检查（翻案腔、密顿号、破折号、提示语冒号、拟人喻体等）；未命中且不别扭的句子不动
- 范围：三页 HTML 正文与 meta description；`main.js` 界面短句仅在别扭时改

## [S3] Out of Scope

- 不改页面结构、样式、交互逻辑
- 不改 README / DESIGN_NOTES / 既有 landing-page 规格正文
- 不编造成员、实验室、人数、日期或培训承诺
- 不做 i18n、不写营销口号替代真实成绩

## Tasks

- [x] T1: 通读三页并改写偏硬文案 — acceptance: 事实/结构/链接完整，语体一致，无新增事实 (covers: S2)
- [x] T2: 静态核对 — acceptance: `node --check main.js` 通过；关键事实（奖项、群号、待确定）仍在 (covers: S2; depends: T1)
- [x] T3: 独立审阅 — acceptance: 无事实丢失、无结构破坏、无明显 AI 腔残留 (covers: S2; depends: T2)
