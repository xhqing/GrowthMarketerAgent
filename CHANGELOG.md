# Changelog

## [Unreleased]

### 变更（数字口径补动态数字纪律：agent 数量会变，常青资产不写死精确数）

- **为什么改**：用户指出 agent 数量会随组织增减变化，不是恒定 20；bio / 置顶帖是常驻资产，写死精确数字会随组织变动失真，且每次增减 agent 都要改 bio（维护雷）。
- **改了什么**（2026-09-19）：`plan.md` 数字口径段补三条纪律——①常青资产（bio / 置顶帖）用约数（20-ish）或不写数；②叙事帖用时点快照数字不算漂移（与落地页当前口径一致即可）；③数字真实变动后落地页由 Mason 侧同步，bio 因用约数免跟改。既有帖串文案（含 20 处）不动：帖串是「上个月这次发布」的快照叙事，与落地页当前口径一致。

### 新增（同域短链路由 go/，X 发帖链接换短链）

- **为什么改**：用户反馈 UTM 长链接（127 字符）在 X bio / 帖子里太长且复制易断裂（已发生一次断链事故：链接断在 utm_campaign 值中间，归因丢失）；要求提供短链接。
- **改了什么**（2026-09-19）：①在落地页部署仓（SiteBuilderAgent 仓 tmp/deploy，即 GitHub agent-team-playbook 仓库）新建 `go/` 同域短链路由——bio/t1/p2/p3/p4 五个目录各一个 index.html，meta refresh + JS 双跳转到带完整 UTM 的落地页（跳转页不埋 GA，避免重复 page_view；归因靠落地页 URL 参数，不变；noindex 防搜索引擎索引短链页）；②GrowthMarketerAgent 仓 `x-post-text.txt` 全部链接换短链（头部附短链↔长链对照与生效条件）；③`plan.md` 登记短链映射表。短链生效条件：agent-team-playbook 仓 push 后 GitHub Pages 部署完成（待用户确认 push）。

### 新增（发帖用即贴纯文本包 `x-post-text.txt`，解决长链接复制断裂问题）

- **为什么改**：用户发帖时遇到链接显示异常——蓝色部分可点击但后面多出黑色文本，典型症状是从聊天窗口/终端复制长 URL 时软折行被复制成真实换行符，X 只把换行前半段识别为链接，后半段变纯文本；被截断的链接会丢失 utm_campaign/utm_content 参数，归因数据作废。需要一个「从文件直接复制」的干净源，避免经手聊天窗口/终端。
- **改了什么**（2026-09-19）：新建 `artifacts/playbook-launch/x-post-text.txt`——D1 帖串 x-thread-launch-01 全 10 节（去 markdown 标记的即贴版）+ 首条回复 + bio 链接 + D4/D8/D10 三条单帖及其首条回复，链接全部独占一行；头部注明务必从编辑器打开复制、不要从终端选区复制。另：同时补齐 x.md 里 launch thread 缺的发布时间窗与发后动作小节（见下条）。

### 变更（补齐 `x-thread-launch-01` 的四件套小节，D1 首发执行包就绪）

- **为什么改**：用户要启动 X 发帖引流；首波内容包里 launch thread 有成品文案但缺「发布时间窗 + 发后 30 分钟动作 + 首条回复话术」的配套小节（此前只有 company org thread 配齐了四件套），发帖时需临时拼凑、易漏掉置顶与 30 分钟互动 SOP。
- **改了什么**（2026-09-19）：`artifacts/playbook-launch/x.md` 第 1 节 launch thread 末尾补「发布时间窗（美东 8:00–9:30 AM = 北京 20:00–21:30，2026-09-19 周六晚首发；勿在北京白天发布，30 分钟攒回复触发点需受众在线）」+「发后 30 分钟动作（立即跟首条回复、攒 10 条回复、置顶、24h 回全部评论）」小节，回复话术储备指向文末通用表格。

### 变更（x-growth skill 触发优化：真实 pi 环境三轮评测，description 微调）

- **为什么改**：用户要求开跑 skill-creator 的 description 触发优化流程，验证 x-growth description 的触发准确率并改进；过程中发现 skill-creator 自带的评测管道（run_loop，基于 `claude -p` + `.claude/commands/` stub）对 pi 环境严重失真，需要换道自建 pi 原生评测。
- **改了什么**（2026-09-19）：①诊断：诊断实验实锤 skill-creator 管道两处失真——模型先调非 Skill/Read 工具即被判未触发（早退 bug）+ 判定只认读 commands stub，而模型实际主动读的是 `.pi/skills/` 真实文件，导致 should-trigger 全军覆没、5 轮优化全是噪声；②自建 pi 原生评测器（`tmp/x-growth-workspace/pi-trigger-eval.mjs`，用 pi SDK 构造与真实会话同构的环境：同一套 skill 发现注入 available_skills、同模型 zai-coding-cn/glm-5.3、同项目 cwd、只读工具集零副作用、read `.pi/skills/x-growth/` 即判触发、触发即提前中止），20 条查询 ×3 次；③三轮结果：基线 19/20（should-trigger 10/10 全 3/3）→ 第二轮 NOT for 具体化反而把「KOL 邮件」从 1/3 恶化到 3/3（排除项写得越具体越像反向触发器，字面重叠变成强匹配信号）→ 回滚后终态 19/20；④description 终态仅一处强化：NOT for 首条扩为「调研 / 抓取 / 看讨论 / 搜热帖（哪怕目的是为养号找回复目标，获取 X 站内内容一律 agent-reach）」。剩余唯一 FAIL「去 X 上看看评价 + 找值得回复的帖子」为语义双重意图查询的自然摇摆（三轮 2/3→1/3→2/3），非 description 缺陷，接受。

### 新增（X 组织管理视角帖串 `x-thread-company-07`，追加进首波 X 内容包）

- **为什么改**：用户要求写一个「我怎么用 20 个 AI agent 开一家公司」的 X thread，10 节左右、末节引到落地页。经核对，首波内容包里的 D1 首发主力帖串 `x-thread-launch-01` 已是同一题材（20 agents / 唯一人类 CEO / 10 节 / 末节 CTA），且已用过「agent 计划发死渠道 → hook 拦截」同一案例——直接新写会与主力帖串撞车。处理：不覆盖 `x-thread-launch-01`，按**换钩重发版**定位新写一条，入口钩子从「我们交付了产品」换成「这家公司怎么管」，重心从产品叙事移到组织管理（招聘 / 交接 / 绩效 / 裁撤）；两版是否替换 D1 主力由人定，不擅自改发布节奏。
- **改了什么**（2026-09-19）：①`artifacts/playbook-launch/x.md` 追加第 5 节 `x-thread-company-07`——10 节帖串成品（EN，组织管理视角：公司规模钩子 → 六部门流水线 → 一文件即招聘 → artifacts 交接契约 → 踩坑变规则再变 hook 执法（中段最强干货，第 4 节末预告）→ 绩效以交付契约为准 → 角色按文件裁撤 → 跨底座可移植 → 公开仓库即收据 → open-core 定价 CTA + 开放问题），含四件套（UTM 链接、发布时间窗、发后 30 分钟动作、回复话术储备）与本条过检记录；②`plan.md` utm_content 登记表新增 `x-thread-company-07` 行并标注与 `x-thread-launch-01` 至少隔 3 天。红线照旧：$49 无早鸟、无文件数、open-core 第 10 节明示、链接只指落地页。

### 新增（x-growth skill：X 平台引流变现工艺，装项目级 `.pi/skills/x-growth/`）

- **为什么改**：用户要求根据根目录 `x-algorithm.md` 的推荐算法机制，写一个本项目级的从 X 平台引流变现的 skill——算法情报此前是「知道」状态，缺一层「每条内容都过检」的执行工艺，把机制固化成写帖、发布、养号、质检的标准流程，避免每次做 X 内容时凭印象执行、漏掉外链 / 早鸟价这类高代价红线。
- **改了什么**（2026-09-19）：新建 `.pi/skills/x-growth/`（SKILL.md 140 行 + references/patterns.md 100 行，按 skill-creator 的 Progressive Disclosure 组织）：①SKILL.md 固化执行层规则——权威源路由（机制详解指根 `x-algorithm.md`、链接资产每次从 `artifacts/handoff.md` 取当前值，skill 不复制 URL 防漂移）、六条铁律（正文零外链、对话钩优先、6 小时生命周期运营、TweepCred 养号、建设性语气、常青层 + Starter Pack 中期目标，每条带 why）、产物契约（内容包四件套：UTM 链接 + 发布时间窗 + 发后 30 分钟动作 + 回复话术储备）、UTM 命名约定、内容红线（$49 / 无早鸟 / open-core / 不编数字 / 不数文件数 / TikTok Gumroad 禁用）、输出前 9 项质检清单；②references/patterns.md 放形态模板——单帖三型（对话钩 / 观点断言 / 算法帖）、干货 thread 节奏设计（吃完成率信号）、重发钩子操作（换钩换形态换 utm_content）、回复区链接 SOP（首条回复预写、作者回应 +75 的优先级）、bio 与置顶常青层、每日养号动作清单。

### 新增（X 推荐算法情报移交：根目录 `x-algorithm.md`）

- **为什么改**：用户要求把 Scout 仓里关于 X 平台开源推荐系统源码（`xai-org/x-algorithm`）的内容移交给 Buzz（引流执行要用算法机制做发帖决策）；该情报此前只在 Scout 仓选品报告 §3.5 里，Buzz 侧无本地依据。
- **改了什么**（2026-09-19）：新建根目录 `x-algorithm.md`，从 Scout《选品方案 v3》摘出自包含快照：①九条关键机制（互动权重序、外链惩罚、6 小时半衰期、30 分钟 10 回复触发点、TweepCred、情感信号、thread 完成率、主题一致性、长尾判定与 Starter Packs 通道）+ 补充机制细节；②X 算法运营手册六条铁律（链接铁律、发帖节奏、养号纪律、内容形态、常青层、Starter Pack 中期目标）；③算法帖内容钩子与首发草稿；④数字可信度边界。头部标注来源、快照基线（2026-08-13 release）与 trend_id/product_id 可追溯标签；Scout 侧 MEMO M1 持续跟踪机制更新后本文件同步换版。

### 新增（Playbook 上架引流方案 + 七渠道首波内容包，产出 `artifacts/playbook-launch/`）

- **为什么改**：Agent Team Playbook 已上架（Mason 交接：落地页 + Payloadz 双链接 + GA4 就绪，见 `artifacts/handoff.md`），流水线进入④引流期；需要把「怎么引、发什么、怎么归因、什么节奏」落成可执行方案与首波成品文案。
- **改了什么**（2026-09-19）：新建 `artifacts/playbook-launch/` 四文件——`plan.md`（总方案：核心叙事「meta 证明」、信息屋、渠道矩阵、utm_content 登记表、6 周发布节奏、红线清单、二波选题库）、`x.md`（EN：首发帖串 + 算法帖 / 56 行最小 agent 帖 / DSH 桥接帖）、`instagram-youtube.md`（EN：IG 三帖 + bio 链接、YT 60s Short 脚本 + 长视频大纲）、`china.md`（ZH：小红书两篇笔记、知乎价值先行回答、B 站动态 + 短视频脚本、视频号文案）。全部链接带 UTM（`utm_campaign=playbook-launch`，19 个 utm_content 已分配登记）；红线落死：不提早鸟价（EARLY35 未配置）、不数文件数（12/zip 与落地页 20 files 口径不一，文案一律回避）、open-core 边界每条内容明示、直链仅用于放不下落地页的场景。

### 新增（Hypit 实战：可口可乐 30s 广告改编百事版，产出 `tmp/pepsi/`）

- **为什么改**：用户要求把 30 秒可口可乐广告（「For Everyone :30」，已下载的 `tmp/ads/`）改成百事可乐版；Hypit 试用评估（见上条）需要一次真实改编验证纯本地路线的完整生产能力。
- **改了什么**（2026-09-18）：`tmp/pepsi/` 下建标准 Hypit 工程（references/ad 分析档案 + productions/pepsi-30s 创作源码）：① 选色 HSV 红转百事蓝预处理器（保护肤色与白背景，逐帧验证残余红 ≤0.28%）；② 原声 "Coca-Cola"（25.44–27.44s）压至 10% 并以本地 TTS "Pepsi."（Reed 声、音高 +1.12×、RMS 对齐原词 -28 dBFS）替换；③ 17 条跟随旁白的百事蓝字幕（YouTube 字幕轨词级对时）+ 白底百事地球仪尾卡（Wikimedia 2023 SVG）覆盖 24.56s 起的红色尾卡；④ 本地 Runtime 渲染成片 `output/pepsi-for-everyone-30s.mp4`（30s、1280×720、$0）。另：项目 `.gitignore` 补 `tmp/`（临时产物不入库）。

### 变更（video-download skill 补记「VSC 内有声播放扩展不存在」查证结论）

- **为什么改**：用户追问「有没有 VSCE 能在 VSC 里正常播放视频」；需把查证结论沉淀进 skill，防止后续重复搜索死路。
- **改了什么**（2026-09-18）：skill 的 VSC 专段补记：marketplace 查证（两轮关键词搜索）唯一专用扩展 analytic-signal.preview-mp4 解包源码实锤为 webview `<video>` 方案、同样无声；Simple Browser 同套限制（#329583）；WASM 解码路线无现成扩展；一键外部播放 `open -a QuickTimePlayer <file>`。

### 变更（video-download skill 纠错：VSC 内置预览不支持 AAC，音频验收换道）

- **为什么改**：实测证伪了 skill 初版的「H.264+AAC 全平台通吃（含 VSCode）」表述——最保守的 H.264+AAC 测试文件在 VSC 内置预览里仍无声；读本机 VSC 内置 media-preview 扩展源码（`videoPreview.js` autoplay 时默认 muted）+ 官方 issue（microsoft/vscode#167685 OPEN、#329811 实测产品自带 ffmpeg 缺 `ff_aac_decoder`、#156558 官方确认编解码器许可证裁剪）确认：VSC 预览就是解不出 MP4 里的 AAC，与文件无关、转码救不了，须防止后续再在这个死胡同里排查。
- **改了什么**（2026-09-18）：`.pi/skills/video-download/SKILL.md` 兼容性表述改为「QuickTime / 微信 / 剪辑软件等常规场景通吃」，新增「VSCode 内置预览听不到任何 MP4 音频」专段（成因 + issue 链接 + QuickTime 不解 AV1 的提醒）；修复配方段补充分流（音轨 opus = 文件问题照旧修；已是 aac 仍无声 = VSC 环境限制，换 QuickTime / `afplay` 验收，不动文件）；速查表同步。

### 新增（video-download skill 沉淀视频下载工艺，装项目级 `.pi/skills/`）

- **为什么改**：为 Buzz 下载 30 秒广告参考素材（Coca-Cola「For Everyone :30」）时踩坑——yt-dlp 默认按画质排序选中 AV1+Opus 流，`--merge-output-format mp4` 只换容器不重编码，Opus 音轨装进 MP4 后 VSC 内置播放器（Chromium 媒体栈）解不出、画面正常但静音（VLC 可放、易掩盖）；用户要求把下载工艺沉淀为 skill 并与 hypit 同策略装项目级（项目专用能力随仓库走、不污染全局）。
- **改了什么**（2026-09-18）：新建 `.pi/skills/video-download/SKILL.md`：三步标准流程（`ytsearch` + jq 按时长筛候选 → `-S "res:720,vcodec:h264,acodec:aac"` 兼容性优先选流 → ffprobe 验证编码与时长）、Opus-in-MP4 静音成因与修复配方（`ffmpeg -c:v copy -c:a aac -b:a 160k`，视频流无损）、平台边界（B站禁 yt-dlp 走 agent-reach bili-cli；调研/字幕归 agent-reach、视频制作改编归 hypit）。skill 初建于用户级 `~/.pi/agent/skills/`（与 `~/.claude/skills` 同 inode），后按用户要求整体移动到本项目 `.pi/skills/`，用户级已移除。

### 变更（hypit skill 从全局改到本项目项目级安装）

- **为什么改**：用户要求（2026-09-18）hypit skill 不装全局，改装项目级——它是 Buzz 专用能力，随仓库走（clone 后可用），不污染全局环境。
- **改了什么**（2026-09-18）：`npx skills remove hypit -g -y` 卸载全局（含 `~/.agents/skills/hypit` 与 pi 全局 symlink）；在本项目根 `npx skills add hypit-ai/hypit` 项目级安装到 `.agents/skills/hypit`（pi 原生扫描项目 `.agents/skills/`，Claude Code 得到 `.claude/skills/hypit` 相对 symlink），项目根新增 `skills-lock.json`；同步更新 `references/hypit-trial.md` 的安装位置表述。npm 可执行包 `@hypit/hypit`（机器级命令行工具，非 skill）保持全局安装不动。

### 新增（T1 完成：Hypit 试用评估报告 `references/hypit-trial.md`）

- **为什么改**：TODO **T1**（试用开源项目 Hypit、评估用于引流内容批量生产）已执行完毕，评估结论需要沉淀为正式参考文档供 Buzz 后续内容生产决策。
- **改了什么**（2026-09-18）：零成本路线全链路实测（装 skill + 可执行 v0.2.5、纯本地 Runtime、官方 chat 例子 8 秒竖屏片 28.7s 出片、换文案变体 20.9s、全程 $0），新建 `references/hypit-trial.md` 记录实测事实、对 Buzz 各渠道的适用形态（纯动效 / 字幕卡 / 聊天叙事）、暂缓形态（真人 / 数字人付费路线）、许可证与版本风险，结论为纳入工具箱作纯动效短视频批量生产线。同步归档 **T1** 至 `TODO-archive.md`（✅已完成），`TODO.md` 活跃条目清空。

### 新增（TODO.md 落地 + 试用 Hypit 待办）

- **为什么改**：用户调研开源项目 Hypit（github.com/hypit-ai/hypit，AI agent 批量克隆爆款视频工具）后决定试用，其批量视频变体能力与 Buzz 引流内容生产对口，按 TODO 管理规范记入待办；项目此前无 TODO.md（缺失标配）。
- **改了什么**（2026-09-18）：新建 `TODO.md`（含头部分流指引），🟢 绿色节新增 **T1**：试用 Hypit 并评估用于引流内容批量生产，附最快试用路径（`npx skills add hypit-ai/hypit -g` + `/hypit` 指令、纯代码渲染零成本路线）、许可证边界（Apache-2.0 附加条件，自用引流不受限）与版本风险（v0.2.x 迭代快）。

### 新增（接收 Mason→Buzz 建设期交接：成交阵地就绪，引流链接可用）

- **为什么改**：建设期（Mason）完成 Payloadz 上架 + 落地页部署 + GA4 埋点，销售闭环全链路生产环境验证通过；按流水线接力（③ Mason → ④ Buzz），引流期开工前需要正式接收链接资产与引流纪律。
- **改了什么**（2026-09-18）：新建 `artifacts/handoff.md`（被 gitignore 忽略的交接输入）：资产清单（落地页主推链接 / EN·ZH 购买直链 / GA4 看板）、UTM 约定（utm_source / medium / campaign / content 逐项口径，utm_content 每条引流内容唯一）、引流纪律（open-core 边界第一屏明示；早鸟码未配置前禁提早鸟价；渠道硬约束；product_id 与 campaign_id 双归因标签）、数据自查路径与 purchase 补录延迟说明。
- **边界**：仅新增交接输入；素材细节指向 Wright 仓《产品说明》；未动本仓任何既有文件。

## [1.0.0] - 2026-09-14

### 新增（commit skill 补全项目标配：README_cn.md、VERSION、版权署名段等）

- **为什么改**：2026-09-14 `/commit` 后的第 9 步项目标配检测发现缺项——无 README_cn.md 中文版、无 VERSION 文件、英文版缺互链与底部版权署名段、徽章行含 Stars / Last Commit 动态徽章且缺 Version 徽章。
- **改了什么**（2026-09-14）：新建 `README_cn.md`（与英文版内容对齐）；新建 `VERSION`（1.0.0，取值顺序兜底：无 package.json / manifest / CHANGELOG 实际版本标题）；`README.md` 移除 Stars / Last Commit 动态徽章、补 Version-1.0.0 徽章、加「[简体中文](README_cn.md)」互链、底部 License 段升级为完整版权署名段（All Contributors）；新建 `.commit-cache.md` 检测缓存。另同步清理：本次提交已删除 `.claude/` 下内嵌 skills（anysearch / find-skill）与本地配置，README「内置能力」段待下次内容修订时更新（见 TODO 口径，不由 commit skill 改正文）。

### 新增（引流素材 SOP：名人视角引流内容 `references/celebrity-lens-sop.md`）

- **为什么改**：用户 2026-09-14 讨论后确定——Agent Team Playbook 的卖点是"能接单的职能团队"，名人是 commodity 而非护城河；故名人不进常驻 Agent，只作 Buzz 引流内容钩子。据此沉淀可执行 SOP。
- **改了什么**（2026-09-14）：新增 `references/celebrity-lens-sop.md`，含定位纪律、名人×职能 agent 映射选题库、Buzz 执行五步流程（选题→视角演绎→多渠道路由→链接归因→节奏）、合规声誉红线（不伪造语录/不虚假背书/透明披露）、以及交 Echo 用 `campaign_id=cel-lens-*` 验证效果的机制。遵循 available-channels.md（禁 TikTok/Gumroad）、passive-income-only.md、china-outreach.md 价值先行原则。

### 变更（CLAUDE.md 删去「由 Claude Code 自动加载」说明句）

- **为什么改**：用户 2026-09-12 要求 CLAUDE.md 不再强调本文由 Claude Code 加载，团队全部项目的 CLAUDE.md 统一清理此类语句。
- **改了什么**（2026-09-12）：`CLAUDE.md` 开头角色定位行删去句尾「本文件由 Claude Code 在每次会话开头自动加载。」，角色描述本身保留。

### 变更（assets/logo.svg 副标题去中文）

- **为什么改**：全局规则新增「Logo / 图标资产文字一律用英文」（2026-09-12 用户立，起因 Swing 仓库 logo 副标题混入中文被指出）：logo 是面向全球读者的视觉标识，中文受众已有 README_cn.md 双语通道；且 SVG 中文依赖查看环境的字体回退，渲染不可控。本次为按新规批量清理存量。
- **改了什么**：`assets/logo.svg` 副标题「Growth Marketer · 增长营销」→「Growth Marketer」。

### 变更（china-outreach.md 引用仓库名同步：BidOptimizerAgent → ApplyOptimizerAgent）

- **为什么改**：Hopkins 项目因投单与求职合流更名 ApplyOptimizerAgent（2026-09-06，投单与找工作实为同一条投递漏斗，详见该仓库 CHANGELOG），本文档「别群发私信」条目引用其 `references/outbound-sales.md` 的仓库名须同步，避免指向旧名。
- **改了什么**：`references/china-outreach.md` 私信纪律第 5 条的仓库名一处更新，其余未动。

### 新增（国内渠道打法与合作私信公式参考文档）

- **为什么加**：Kit 在分析开源赞助变现仓库 [awesome-oss-sponsorship](https://github.com/Lxcardoza993/awesome-oss-sponsorship)（CC-BY-4.0）时发现，其中文版沉淀的国内渠道打法（V2EX / Linux.do / 掘金 / 知乎 / 微信群 / 公众号 / 即刻的特性与守则）、中文合作私信四要素公式、公开帖 value-first 守则不依赖「卖什么」，可直接用于本项目的渠道引流与合作触达，经用户确认提取为参考文档。
- **加了什么**：新建 `references/china-outreach.md`——国内渠道打法表、渠道选择速查、私信公式与微信模板（含产品引流版改写）、中文冷邮件骨架、公开帖守则、避免显得 low 的守则，及使用边界（原文整理与迁移演绎明确区分标注）。

### 变更（Visitors 徽章更名 Visits/day (14d)：alt 文本与 xhqing 集中统计新 label 对齐）

- **为什么改**：用户要求（2026-08-17）访问量徽章名需表达「最近半月日均访问量」口径——xhqing 集中统计侧的 badge JSON label 已从 `Visitors` 改为 `Visits/day (14d)`（`Visits/day` 是 shields.io 表达日均的惯例写法、`(14d)` 标注 14 天滚动窗口），各仓 README 的徽章 alt 文本同步对齐，避免 alt 与徽章实际显示文字脱节。
- **改了什么**：README 徽章区 `alt="Visitors"` → `alt="Visits/day (14d)"`，仅改 alt 文本，endpoint URL、数据源、徽章口径均不变（口径改动记 xhqing 仓库 CHANGELOG，本仓只改 alt）。

### 变更（Visitors 徽章 alt 文本首字母大写：README 访问量徽章命名统一）

- **为什么改**：用户指令（2026-08-16）「Visitors 徽章全局统一，首字母大写」——配合全局 `~/.claude/CLAUDE.md`「徽章英文首字母必须大写」新规，集中统计上线时挂的访问量徽章 `alt="visitors"` 为小写存量，与 badge JSON label（`Visits/day`）及大写规范不一致，本次一次收口。
- **改了什么**：README（EN/CN）徽章区 visitors 徽章 `alt="visitors"` → `alt="Visitors"`，仅改 alt 显示文本，endpoint URL 与数据源不变。

### 新增（README 访问量徽章——舰队集中式访问统计）

- **为什么改**：全舰队上线集中式「真去重」访问统计（图片徽章方案无法去重，走官方 Traffic API 路线）：统计集中部署在 xhqing 仓库（`scripts/update_traffic.py` + 每日 GitHub Action），各 fleet 仓库只需在 README 挂徽章、零运行负担。
- **改了什么**：README（EN/CN）徽章区新增 visitors 徽章（shields.io endpoint 指向 `xhqing/xhqing` 仓库 `traffic/badges/<repo>.json`，由每日采集的官方 Traffic API 数据更新）。徽章数字含义：按日去重访客的累计（GitHub 只提供每日 uniques，跨天不去重），自 2026-08-16 起累计。
