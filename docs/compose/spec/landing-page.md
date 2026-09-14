---
feature: landing-page
status: delivered
updated: 2026-09-14
branch: feat/landing-page
commits: <base-sha>..<head-sha>
---

# NJUPT Initial 战队门面站

## Report

**What was built** — 组织对外单页门面站：Hero 上电序列 + 赛季遥测状态条 + 时间线 + 技术主链规格表 + RC-dog 硬件/安全架构 + 真实九宫格模式交互 + 开源仓库入口 + 招新 CTA。视觉走「仪器控制台」方向（#0A0F14 / #5EEAD4 / #F97316），无 CDN、纯静态三件套。

**Verification** — `python -m http.server` 下 `/`、`/styles.css`、`/main.js` 均 200；锚点/文案/token 静态检查通过；独立 review 发现 3 critical（移动端导航隐藏、九宫格无 focusin、Issues 链接可疑）均已修复并复验。

**Journey log** — 组织分析先行，内容事实来自 RC-dog README 而非臆造；加入链接改为已存在的 `.github/issues`（原 org README 中的 `NJUPT-Initial/NJUPT-Initial` 仓未在公开列表中出现）。

## [S1] Problem

NJUPT-Initial 组织目前只有 GitHub README 与两个业务仓，缺少对外统一门面：招新入口分散、成绩与技术名片不可感知、无法作为组织 GitHub Pages 主站（`https://njupt-initial.github.io`）访问。

需要一页可部署的静态站点，服务：南邮在校同学（招新）、兄弟院校/赛友（成绩与技术）、潜在协作者（开源仓库入口）。

## [S2] Design

### 产品形态

- 单页滚动落地页，无构建步骤：`index.html` + `styles.css` + `main.js` + 本地 SVG/字体资源。
- 语言：简体中文为主，关键工程标识保留英文（NJUPT Initial、ROBOCON、RC-dog、LibXR 等）。
- 入口文件必须位于仓库根目录 `index.html`，以便 GitHub Pages 直接服务。
- 部署目标：新建组织仓库 `NJUPT-Initial.github.io`，默认分支 `main`，Pages 从 root 服务。

### 内容架构（自上而下）

1. **Hero / 上电** — 队名、一句话主张、2026 ROBOCON 障碍赛国二 / 任务赛国三、主 CTA（了解我们 / 加入交流）
2. **状态条** — 类遥测读出：赛季、赛项、奖项、主控平台（MC-02 / STM32H723）
3. **关于我们** — 团队定位与发展时间线（2026 创建 → 2026.07 国赛成绩）
4. **技术方向** — 机械 / 电控与嵌入式 / 算法与感知 三列，不作卡片堆叠，作规格表
5. **旗舰系统 RC-dog** — 8-DOF 轮足四足：硬件子系统表 + 轮足剪影 SVG + 安全架构要点
6. **九宫格模式图** — 真实 CH5/CH8 模式矩阵（0–8），作信息图形而非装饰
7. **开源与模块** — 仓库列表（RC-dog、标定、.github）与技术栈（LibXR / XRobot / STM32）
8. **加入我们** — 招新说明 + GitHub Issues / 组织链接
9. **页脚** — 南京邮电大学 · ROBOCON · 开源致谢

### 视觉系统（frontend-design token）

Style anchor：机器人遥测控制台 / 任务诊断界面（不是科技公司营销站，也不是校园社团海报）。

```
SUBJECT   NJUPT Initial 战队门面 — 招新 + 成绩 + 技术名片
COLOR     --bg      #0A0F14   仪器黑（非纯黑）
          --panel   #111820   次级面
          --line    #1E2A36   细分割线/描边
          --ink     #E6EDF3   主文字
          --muted   #8B9BAB   次级文字
          --signal  #5EEAD4   遥测青绿（健康/主强调）
          --alert   #F97316   赛季热橙（成绩/CTA 点缀，克制使用）
          --ink-on-alert #0A0F14
TYPE      display: "Segoe UI", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif
            — 中文可读优先，标题字重 650–700，字距略紧
          body: 同上，16–18px / 1.65
          label: "Cascadia Code", "SF Mono", Consolas, "Courier New", monospace
            — 用于 CH 通道号、CAN 节点、章节序号、遥测键名
LAYOUT    最大宽 1120px；垂直“上电序列”节奏；区块用 hairline 框 + 等宽眉题（// 01 OVERVIEW 等）
          无圆角大卡片墙；规格用表格/定义列表；导航为顶部细条锚点
SIGNATURE 旗舰区的轮足四足线框 SVG（关节节点可点亮）+ 九宫格模式矩阵（真实 0–8 语义）
RISK      不用通用 SaaS 三列卡片 + 渐变按钮；成绩用橙色短标而不是奖杯 emoji 墙
```

### 交互

- 锚点导航平滑滚动；`prefers-reduced-motion: reduce` 时禁用非必要动画。
- 页面加载时 Hero 遥测行逐条亮起（一次编排，不散落）。
- 九宫格格子 hover/focus 显示模式名与行为摘要。
- 外链（GitHub）`target=_blank` + `rel=noopener noreferrer`。
- 键盘可达：导航、CTA、九宫格均可 focus，focus-visible 环使用 `--signal`。

### 响应式

- ≥960px：双栏 Hero、三列技术方向、硬件表完整。
- <720px：单列堆叠；表格改纵向定义列表；九宫格保持 3×3 但字号缩小；导航可横向滚动或折叠为紧凑链接行。
- 最小验证宽度 375px，无横向溢出。

### 技术与资源

- 纯静态，无 CDN 依赖（字体走系统栈；图形全部内联 SVG 或 CSS）。
- 语义化 HTML5：`header/main/section/footer`，标题层级 h1→h2→h3。
- 对比度：正文 ≥4.5:1，大号展示字 ≥3:1。
- `main.js` 仅负责：导航高亮、加载编排、九宫格详情；无框架。

### 外部数据（实现所依据的事实）

来自组织 README / 仓库元数据（分析于 2026-09）：

- 组织：南京邮电大学 Robocon Initial 战队，2026 创建
- 成绩：第二十五届全国大学生机器人大赛 ROBOCON 仿生足式机器人挑战赛，障碍赛国二，任务赛国三
- 主张：以热爱为起点，用工程让想法落地
- RC-dog：8-DOF 轮足四足；海泰 HWG7015-J8 ×8；M3508+C620 ×4；达妙 MC-02；LibXR + XRobot
- 模式矩阵 0–8：MOTOR_CHECK / LOW_WHEEL / LOW_WHEEL_REVERSE / STAND_HOLD / STAND_WHEEL / STAND_HOLD_ALT / GAIT_ONLY / GAIT_WHEEL / OBSTACLE
- 仓库：`26Initial-RC-dog`（MIT）、`CyberBeast-driver-board-parameter-calibration`、`.github`
- 加入：组织 Issues

## [S3] Out of Scope

- 不做多语言 i18n 切换、博客、文档站、成员头像墙。
- 不接入分析脚本、外部字体 CDN、图片 CDN。
- 不改组织既有业务仓；仅新建 Pages 站点仓。
- 不做 CMS/构建流水线（后续可另开 feature 加 Actions 部署校验）。
- 不伪造未公开的成员名单、赞助商或未验证数据。

## Tasks

- [x] T1: 初始化仓库结构与 spec — acceptance: git 分支存在，spec 文件可读 (covers: S1)
- [x] T2: 实现 `index.html` 完整语义结构与文案 — acceptance: 所有 [S2] 内容区块存在且事实正确 (covers: S2)
- [x] T3: 实现 `styles.css` 设计系统与响应式 — acceptance: token 与 [S2] 一致，375/720/1120 布局成立 (covers: S2)
- [x] T4: 实现 `main.js` 交互（加载编排/导航/九宫格）— acceptance: 无 JS 控制台错误；reduced-motion 生效 (covers: S2)
- [x] T5: 本地验证可访问性与响应式 — acceptance: 静态服务下页面可浏览，无溢出，链接正确 (covers: S2)
- [x] T6: 独立 review — acceptance: 无 critical 问题 (covers: S2)
- [ ] T7: 合并 main 并推送创建 `NJUPT-Initial.github.io` — acceptance: 远端 main 含站点文件 (covers: S1)
