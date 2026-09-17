# Changelog

## [Unreleased]

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
