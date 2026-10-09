# 外部工具调研（与 dtc-ads 管线相关）

> 记录与「AI 广告片生产」相关的外部工具：它们能补什么、我们的自建管线为什么保留、免费额度够不够。
> 调研日期：**2026-10-04**。价格与额度以官方页面为准，会变，用前复核。

---

## 一、ChatCut（chatcut.io）

### 它是什么

**能用自然语言剪辑的 AI 视频编辑器**，核心卖点是「把要什么说出来，它把剪辑做完」。与我们最相关的是：它提供 **Agent 插件 + MCP 服务**，可由 AI agent 直接调用剪辑能力。

- **Agent 插件**：支持 Codex、Claude Code 2.x（CLI / 桌面版）、Grok Bot、Cursor、Kimi Work。
- **连接方式**：托管 MCP 端点 `https://api.chatcut.io/api/external-mcp/mcp`，装插件后走 OAuth 授权。
- **插件能力**（官方 README 原话）：**导入素材、改时间线、做 Motion Graphics、生成素材、转写音频、加字幕、导出视频、并在编辑器里核验改动**。
- **桌面版**（ChatCut Desktop，macOS 13+ / Windows）：官方本地 app，带自己的 managed agent，支持 `chatcut_desktop` 工具集。
- 安装入口：Codex 看 `chatcut.io/chatgpt`；Claude Code 看 `chatcut.io/claude`（一条 `/goal 阅读 chatcut.io/claude 帮我安装和使用 ChatCut 插件` 即可）。

### 价格与免费额度（2026-10-04 官方定价页）

| 项 | 内容 |
|---|---|
| **免费版 $0**（无需信用卡） | **5 个免费积分**；✓ 基础剪辑与导出；✓ AI 图片与 Motion Graphics 生成；✓ AI 字幕与音乐生成；✓ 数字人、音色克隆与试听；✓ **网页端导出上限 60 分钟** |
| **Agent 场景** | 官方说明「在 Codex、Claude 和 WorkBuddy 中使用，**部分功能完全免费**」（哪些功能未逐条列明，需试用确认） |
| **付费版** | $42~50/月（年付，200 积分）→ $49/100/月（400 积分）→ $98/200/月（800 积分）；含 Seedance 2.5 / 2.0、Kling 3.0、MiniMax H3、GPT Image 2、Nano Banana 2、MG 动画、AI 音乐、音色克隆、**导出无上限** |
| 生成单价参考 | Seedance 2.5 限时 4.9 折、**最低 ¥0.33/秒**（我们自建走方舟 mini·480p 为 ¥0.23/秒） |

**免费额度够不够剪辑**：
- **纯剪辑（导入 / 时间线 / 字幕 / 导出）**：**大概率够**——基础剪辑与导出在免费版里，导出上限 60 分钟远高于我们 15~20 秒的片子；但「agent 调用的剪辑操作是否计积分」官方没有明说，**必须试用确认**（导入 → 切一刀 → 导出，看积分有没有掉）。
- **AI 增值功能**（MG 动画 / AI 音乐 / 音色克隆 / 视频生成）：5 积分只够尝鲜（按 Seedance 折算约 8 秒视频），要常用必须上付费版（≈$25~50/月）。

### 对我们的价值判断（2026-10-04）

**它可能补上的三件事**（我们自建管线目前是"能用但手工"）：

1. **语义化剪辑**——「把狗扭头走开那一下剪出来」，比我们现在逐帧抽图比对省力；
2. **Motion Graphics（可透明背景导出）**——我们目前用 SVG / PIL 手搓，它能出更专业的动效；
3. **AI 音乐 / 音效 / 音色克隆**——我们现在用免费 TTS + 免费音效，它可提供**品牌一致的声音**与更贴片的配乐。

**它补不上 / 不需要的两件事**：

1. **帧级精确与可复现**——我们的管线是脚本化的（裁剪点、`xfade` 偏移、字幕淡入淡出、侧链闪避的电平全部可控且可重放），这类"交付精度"仍以 ffmpeg 管线为准；
2. **零成本**——我们现在的剪辑 / 混音 / 字幕是 **¥0**（本地算力 + edge-tts），ChatCut 的增值功能要订阅。

**⚠️ 当前最大障碍：pi 驱动不了它**。pi **没有内置 MCP**（官方口径：MCP 集成要靠扩展或包自建），而 ChatCut 的插件只面向 Codex / Claude Code / Grok / Cursor / Kimi——所以现阶段它**只能作为"人在环里"的独立工具使用**（走 Claude Code 或 ChatCut Desktop 自己的 agent），没法并进我们这条 pi 自动化流水线。若将来要并进来，需要：① 给 pi 写一个 MCP 扩展（可做，工程量中等）；或 ② 把该环节交给 Claude Code 执行。

**建议的试用路径（¥0）**：注册免费账号 → 用现成 CRUNCH 素材试三件事：
1. 导入 + 让 agent「剪出舔食那一段」→ 看语义剪辑准不准；
2. 自动字幕 vs 我们的手工字幕卡（对齐精度、字号位置可控性）；
3. 做一段 MG 叠加（透明背景）→ 看能否用到下一条片里。
试完再决定是否订阅；**成片交付层继续用 ffmpeg 管线**，不迁移。

---

## 二、给 pi 写 MCP 扩展的工程量评估（2026-10-04 实测调研）

### 先说结论

**技术风险低、工程量比预想小**：ChatCut 的 MCP 端点是**标准 MCP**（streamable-http + OAuth 2.0），官方 TypeScript SDK（`@modelcontextprotocol/sdk` v1.32）**自带客户端传输与 OAuth/PKCE 助手**，社区已有现成 CLI（`mcporter`）可直接用——**最省事的路线几乎不用写代码**。

### 实测到的硬事实

| 项 | 实测结果 |
|---|---|
| MCP 端点 | `https://api.chatcut.io/api/external-mcp/mcp`（未授权返回 **401** + 标准 `WWW-Authenticate: Bearer resource_metadata=...`） |
| 认证方式 | ① **API key 或 JWT**（401 报文原话：`Authorization: Bearer <chatcut API key or JWT> is required`）② **OAuth 2.0**：元数据里**有动态客户端注册端点**（`/auth/mcp/register`），支持 PKCE S256、authorization_code + refresh_token |
| 工具数量 | **53 个视频编辑工具**（第三方文档实测口径） |
| 传输 | streamable-http（可脚本化） |
| pi 侧能力 | 扩展可用 npm 依赖（`@modelcontextprotocol/sdk` 可直接 import）；pi **无内置 MCP**（官方哲学：**用 CLI + Skill 而不是 MCP**） |

### 三个方案对比

| 方案 | 工程量 | 做法 | 优劣 |
|---|---|---|---|
| **B. CLI + Skill（推荐）** | **1–2 小时** | 装现成社区 CLI：`npm i -g mcporter` → `mcporter config add chatcut --url ... --auth oauth --transport streamable-http` → `mcporter auth chatcut`（一次浏览器授权，token 存 `~/.mcporter/credentials.json`）→ 写一个 `SKILL.md` 教 pi 调 `mcporter call chatcut.<tool>` | 几乎零开发；符合 pi"CLI + Skill"哲学；**53 个工具不必进上下文**（按需 `list` 再 `call`）；维护面只有 skill 文档 |
| **A. pi 原生 MCP 扩展** | **半天–1 天**（≈250–400 行 TS） | 用 SDK 的 `Client` + `StreamableHTTPClientTransport`；认证复用 token 文件或走 SDK 的 OAuth；**只暴露门面工具**（`chatcut_list_tools` / `chatcut_call`，**不要注册 53 个**，否则上下文爆掉） | 体验最顺（工具原生出现、自动适配对方工具变化）；但要自己维护认证刷新/错误重连/结果映射 |
| **C. 不集成** | 0 | 走 Claude Code 插件或 ChatCut Desktop 自己的 agent | 零成本；人工介入、不在 pi 流水线内 |

### 仍存在的不确定性（与工程量无关，但决定"值不值得做"）

1. **免费额度够不够**：免费版 5 积分；"基础剪辑与导出"是否**完全不计积分**官方未写明 → 必须试用验证；增值功能（MG / AI 音乐 / 音色克隆 / 生成）几乎肯定要订阅（$42~98/月）✗；
2. **API key 从哪拿**：401 报文说可用 API key，但官方文档未直说入口位置 → 需登录后在账号设置里确认（若没有就只能走 OAuth）；
3. **服务条款**：官方插件只面向 Codex / CC / Grok / Cursor / Kimi，自建 MCP 客户端是否在允许范围内需自行判断（端点本身是公开发布、支持动态注册，风险不高但非官方背书）；
4. **价值本身**：语义剪辑 / MG / AI 音乐对我们到底省不省时间，**只有试用过才知道**。

### 推荐推进顺序

1. **先 ¥0 试用**（走 Claude Code 插件或 ChatCut Desktop 自己的 agent）——用 CRUNCH 素材验三件事：语义剪出"舔食"段、自动字幕对比手工字幕卡、一段 MG 叠加；
2. 试用证明有价值 → **做方案 B**（1–2 小时，安装 + 一次授权 + 写 skill），pi 即获得通话能力；
3. 只有确认"长期高频使用" → 再升级方案 A（半天–1 天，代码可复用）；
4. **成片交付层永远留在 ffmpeg 管线**（帧级精度 + 零成本 + 可复现）。

---

## 三、实操记录：装 Claude Code 插件 + 授权（2026-10-04 完成）

### 可复现步骤

```bash
# 1) 装插件（marketplace 命令要克隆大仓库，可能几分钟，别中断）
claude plugin marketplace add "https://github.com/ChatCut-Inc/agent-plugin.git#main"
claude plugin install chatcut@chatcut-inc
claude plugin list                       # 应显示 chatcut@chatcut-inc v1.10.15 enabled

# 2) 登录（脚本内部是 claude mcp login plugin:chatcut:chatcut）
sh "${CLAUDE_PLUGIN_ROOT}/skills/chatcut-plugin-basics-claude/login-chatcut.sh"

# 3) 核验（权威信号：日志里出现 Authenticated with "plugin:chatcut:chatcut"）
claude mcp get plugin:chatcut:chatcut     # Status 应为 ✔ Connected
```

### 两个坑（都是本次踩到的）

1. **授权进程必须常驻**：pi 的 bash 工具会回收后台进程（官方设计：不支持后台 bash），授权流程跑到一半就被杀 ✗。**改用 `tmux new-session -d` 挂起**（`nohup &` 也不够）——pi 官方推荐的挂后台方式就是 tmux。
2. **抓 OAuth 链接要做去重**：登录脚本会把授权 URL **打印两遍**（一次带终端超链接转义、一次纯文本），日志里两串会**粘在一起** ✗；直接取「最长的匹配」会拿到 **831 字符的畸形 URL**（两条拼接），点它服务器会把你丢回 app 编辑器、永远看不到授权页 ✗。
   正确做法：**非贪婪取第一条**——
   `re.search(r'https://api\.chatcut\.io/auth/mcp/authorize\?[^\s\x1b]*?external-mcp%2Fmcp', log)`（正确长度 ≈ **415 字符**，可用 `parse_qs` 校验每个参数唯一）。
3. 授权页要求**已登录之后再点一次**：先登录会落到 app 编辑器，**回到授权链接再点一次**才会出现同意页；点 **Authorize / Allow** 后跳到 `localhost:<port>/callback` 显示 "Authentication successful" 才算完成。

### 顺带确认

- 插件**自带 18 个技能**（`chatcut:asset-import` / `export` / `transcription` / `create-motion-graphics` / `music` / `video-gen` / `voice` / `verification` / `known-errors` …），比"只有 MCP 工具"更好用：agent 有现成的操作手册可读。
- `claude -p`（headless）能列出这些技能，但 MCP 工具在 headless 会话里未直接暴露（要驱动 MCP 还是走 mcporter / 自建客户端）。

## 四、驱动方式实测（2026-10-04）：mcporter 直连可用 ✓

| 路径 | 结果 | 备注 |
|---|---|---|
| **mcporter 直连 MCP** | ✅ **完全可用**（本次采用） | `npm i -g mcporter` → `mcporter config add chatcut --url https://api.chatcut.io/api/external-mcp/mcp --auth oauth --transport http` → `mcporter auth chatcut`（**账号已记住同意，无需再点浏览器**）；随后 `mcporter call chatcut.<tool> --args '{...}'` 即可。实测 `list_projects` / `create_project` / `import_media`×6 / `read_project` 全部成功；暴露 **60 个工具**。 |
| **headless Codex**（`codex exec`） | ⚠️ 能调通 MCP 但不可用于本地导入 | `codex mcp add chatcut --url ...` + `codex mcp login chatcut` ✓；`create_project` / `read_project` / `list_projects` 成功 ✓；但**沙箱禁止联网与本机监听** → `import_media` 失败 ✗；且每轮 ~5 万 token、**免费额度很快耗尽**（本次约 17 万 token 后触发限额 ✗）。 |
| **Claude Code 插件** | ✅ 装好并授权（`✔ Connected`） | 适合人在环里用；headless 下未直接暴露 MCP 工具。 |

**本机文件导入的正确姿势**（自动化关键）：插件自带 `skills/asset-import/scripts/serve-local-media.mjs` —— 用 tmux 起它（`--port 43991 --ttl 3600 --origin https://app.chatcut.io <文件…>`），它会打印**现成的 `import_media` 参数**（action=from_editor / assetId / filename / sizeBytes / url）；目标项目需**在浏览器里开着**（同机），然后逐个 `mcporter call chatcut.import_media --args '<该 JSON>'` → 返回 `locally_imported` ✓（只服务指定文件、只给 ChatCut 域、到期自动关）。

**⚠️ 凭证位置**：`~/.mcporter/credentials.json`（在仓库外 ✓）。注意 `mcporter config add` 默认会写**当前目录**的 `config/mcporter.json` ✗ —— 必须移到 `~/.mcporter/mcporter.json` 并删掉仓库内副本，避免进 git。

## 五、免费层实测结论（2026-10-04，T1–T5 全部走通）

| 测试 | 计积分? | 结果 |
|---|---|---|
| 建项目 + 导入 6 个素材 | **否**（全程 5 积分未动） | ✅ 全自动（`serve-local-media.mjs` 本机服务 + 目标项目在浏览器开着） |
| 时间线编辑（建 9:16 轨 + 放素材） | **否** | ✅ `edit_item adds` 一步到位（520 帧） |
| 自动转写 / 字幕 | **否** | ✅ **导入即自动转写**；5 个关键词全部命中正确句子（准确率高） |
| 导出 | **否** | ✅ 云端渲染 ~12 秒 → **h264 / 720×1280 / 17.33s**；⚠️ 音频比画面长 0.05s（我们管线规避的坑） |

**判断**：**免费层足以做"纯剪辑 + 字幕 + 导出"** ✓（不必订阅）；AI 增量（MG / 音乐 / 音色克隆 / 生成）需积分或订阅。**我们的 ffmpeg 管线在精度与可复现性上仍更强**，ChatCut 更适合当"MG / 音乐 / 转写"的补充工具，而不是替代交付层。
