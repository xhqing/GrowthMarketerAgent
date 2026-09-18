# Hypit 试用评估：纯动效短视频批量生产

> 2026-09-18 Buzz（T1）实测结论。Hypit（github.com/hypit-ai/hypit，v0.2.5）给 coding agent 提供视频生产语言（SVML），把视频拆成可复用工作流，换文案批量出变体。本文只记实测过的事实与判断，供后续引流内容生产决策参考。

## 实测环境与全链路（零成本路线）

- 安装两步：`npx skills add hypit-ai/hypit`（skill 知识包，装到本项目 `.agents/skills/hypit`，pi / Claude Code 均从项目级目录发现；另有 `skills-lock.json` 记录来源与哈希，供 `skills experimental_install` 恢复）+ `npm install -g @hypit/hypit`（可执行，v0.2.5，机器级命令行工具）。两者生命周期独立，互不隐含。
- Runtime Profile 用纯本地端点（`media.local` + `hyperframes.local`），不配 HypiHub 账号、不配任何 API key。
- 一次性准备（之后全复用）：`hypit runtime up` 自动下载 Chrome headless shell（约 100MB，装 `~/.cache/hyperframes/`）与若干引擎包；`hypit packages install @fontsource-variable/inter@5.3.0` 装字体。
- 试用样本：官方 `examples/semantic-composition/chat.svml`（8 秒、540×960 竖屏聊天气泡动画，无 Script、无 WhisperX、无图像生成、无源视频）。组件 `@example/chat-scene` 是普通 TypeScript 包（HTML/CSS/SVG + 帧驱动 JS），复制进项目 `packages/`、把 `workspace:*` 依赖钉到已装版本号即可构建。
- 首次出片 28.7 秒（含浏览器冷启动 + 240 帧渲染 + ffmpeg 编码）；换文案后的变体重渲染 20.9 秒。`hypit plan` 确认全部请求落在本地端点、零 Provider 费用。产出 H.264+AAC 标准_mp4，画面亮度统计随时间变化（有动态内容，非死屏）。
- 渲染架构：headless Chromium 渲帧 + ffmpeg 编码，Profile 里 `workers` 可调并发（官方 README 展示过 64 进程并发渲染 100 条变体）。

## 对 Buzz 引流的价值判断

**适用（纯代码渲染就能覆盖的形态）**：

- 字幕卡 / MG 动效 / 聊天记录式叙事 / 榜单卡片 / 数据展示——正是「产品卖点展示」类钩子视频的形态，且 `Canvas` 直接设 540×960（Reels / Shorts / 小红书 / 视频号 / B 站竖屏）或横屏（X / YouTube）。
- 批量变体是真实能力而非宣传：复制 svml 改几行文案 → `hypit build`，20 秒一条、$0。同一钩子换文案 / 换语言 / 换产品名做多渠道 A/B，边际成本接近零（只有机器时间）。
- 工作流是声明式文本（SVML），agent 可读可改，与 Buzz 的产物契约（内容包进 `artifacts/`）天然契合：svml 文件本身就是内容包的可版本化源。

**不适用 / 暂缓**：

- 真人出镜口播、AI 数字人、AI 语音需要接生成模型（HypiHub 或自有 API，官方口径约 $1/条量级），本次未验证质量，暂不引入。
- 镜头级「克隆爆款视频」需要先喂参考视频 + WhisperX 对齐，属付费路线，未实测。

## 风险与边界

- 许可证：Apache-2.0 附加条件——自用与给客户做活允许，对外 SaaS 化需商业授权。Buzz 自用引流不受限。
- 版本 0.2.x，迭代快，SVML 语法与 CLI 可能变（本次实测全部基于 0.2.5，升级后需回归）。
- 依赖 Node 22.15+；首次准备要下载 Chrome 与引擎包；渲染吃 CPU（并发多时）。
- 组件需要 TypeScript 前端能力才能深度定制；不写组件、只用官方组件与内置 Surface 时门槛低。

## 结论

值得纳入 Buzz 工具箱，定位为**纯动效类短视频的批量生产线**：产品卖点卡、聊天式痛点叙事、榜单钩子等形态用它批量出变体做多渠道测试；真人 / 数字人类内容暂不走它。使用路径：本机已装好（项目级 skill + 可执行 0.2.5 + Chrome 已缓存），新项目目录里 `hypit runtime init` → 写 svml（或复制官方例子改）→ `hypit build <run> --follow` → `hypit get` 导出 mp4。
