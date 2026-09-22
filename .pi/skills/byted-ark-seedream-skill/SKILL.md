---
name: byted-ark-seedream-skill
license: MIT
description: |
  火山方舟 AgentPlan 专属 Seedream 图片生成与编辑。支持 5.0 Lite / 5.0 Pro 智能选模、文生图、多参考图、连贯组图、精准交互编辑及图层拆分。用户要求生图、画图、参考图片编辑、拆图层或使用 Seedream 时使用。不用于 Seedance 视频生成。
metadata:
  author: volcengine/agentplan
  version: "4.0.0"
  category: ai/image-generation
  runtime: Node.js 18+ with network access to VolcEngine Ark API
---

# Ark AgentPlan Seedream

通过 `scripts/generate.js` 调用 AgentPlan 图片接口。模型仅使用 `doubao-seedream-5.0-lite` 和 `doubao-seedream-5.0-pro`；默认地址为 `https://ark.cn-beijing.volces.com/api/plan/v3/images/generations`。后付费文档仅用于参数参考，不复制其中的日期版模型 ID、`/api/v3` 地址或鉴权配置。Seedream 是生图模型，Seedance 是视频模型。

## 智能选模

先理解用户完整意图，提取结构化参数，再调用脚本。无需为普通选模反复询问。

| 需求 | 选择与参数 |
|---|---|
| 用户明确点名 Lite / Pro | 传 `--model lite` / `--model pro`，优先于环境变量与自动选择 |
| 连贯组图、联网搜索、流式、3K/4K、11–14 张参考图 | Lite；分别传 sequential、enable_web_search、stream、size、reference_images |
| 拆图层、透明图层编辑、坐标/标记精准编辑 | Pro；分别传 layer_decomposition、background、interactive_edit |
| 高精度单图、复杂位置/元素控制、多语种原生文字、精细排版 | 在无 Lite 硬性需求时选 Pro；属于本 skill 任务偏好，不是价格或速度结论 |
| 普通文生图、普通参考图编辑、未指定偏好 | `--model auto`，默认沿用 Lite |
| Pro 极速提示词模式、1K/1.5K | Pro |

脚本优先级：`--model` > `ARK_SEEDREAM_MODEL` > `ARK_MODEL` > `auto`。显式 `--model auto` 可覆盖环境中的固定模型。脚本按结构化能力参数路由，并对提示词中的坐标标签及少量高精度关键词兜底；Agent 负责识别自然语言中的组图、联网、多语种、标记编辑等意图。不要仅依赖关键词命中，注意否定语义。

需求不兼容时解释冲突并让用户取舍，例如「Pro + 四张连贯图」「拆图层 + 联网」。不要静默删除要求、降低分辨率、改用另一模型或自动发起多次生图。API 报错保留错误，不自动切到后付费接口，也不跨模型重试。

## 调用流程

1. 提取参数并选模。参考图片需要 HTTP(S) URL 或 Base64 Data URI；本地文件先转换。具体输入限制见 [模型参数](references/MODELS.md)，预处理与输出见 [开发指南](references/DEVELOPER.md)。
2. 保留用户的文字、坐标、布局及编辑指令。精准编辑、透明图层编辑及拆图层默认关闭本地提示词增强。`optimize_prompt_mode` 是服务端优化模式，与本地 `optimize` 独立。
3. 在 skill 根目录运行 `node scripts/generate.js ...`。参数较复杂或检查请求时加 `--dry-run`，此模式不读取 Key、不联网、不保存图片。
4. 解析 stdout JSON，展示本地图片及实际 `metadata.model`、保存目录。下载失败时提供完整 URL。拆图层同时保留输出 metadata 中的 `z_index`、`bounding_box`、`name`、`description`，不能把图层误称为连贯组图。

## 输入参数

| 参数 | 默认值 | 说明 |
|---|---|---|
| `model` | `auto`（无环境覆盖时） | auto / lite / pro / 两个 AgentPlan 模型全名 |
| `prompt` | 无 | 普通生成必填；拆图层可省略以自动全拆 |
| `mode` | 自动推断 | text-to-image / image-to-image；传参考图时自动图生图 |
| `size` | `2K`；拆图层 `auto` | 按模型校验，详见 MODELS.md |
| `reference_images` | 无 | JSON 数组；URL 或 Base64；Lite 最多 14、Pro 最多 10、拆图层/透明编辑恰好 1 |
| `sequential` | false | Lite 连贯组图 |
| `count` | 组图 4 | 1–15 整数；大于 1 自动启用组图。仅本地校验、进度与记录，不是 API 数量字段 |
| `stream` | 组图自动 true | 仅 Lite；Pro 不能 true |
| `enable_web_search` | false | 仅 Lite；实时信息需求由 Agent 提取，用户否定时不启用 |
| `interactive_edit` | false | Pro 交互编辑路由标记，不透传 API；需要参考图 |
| `layer_decomposition` | false | Pro 拆图层；1 张底图 + 最多 16 个透明 PNG 图层 |
| `background` | 服务端 opaque | Pro；opaque / transparent；transparent 需要一张实际带透明通道的输入图 |
| `optimize_prompt_mode` | 服务端 standard | standard / fast；fast 仅 Pro，映射 optimize_prompt_options.mode |
| `output_format` | jpeg；透明编辑 png | png / jpeg。拆图层时仅控制底图，其他图层固定 PNG |
| `response_format` | 无 | 兼容旧版 png/jpeg 别名。API response_format 固定为 url，不支持 CLI b64_json |
| `watermark` | true | 是否添加水印 |
| `optimize` | 普通生成 true | 本地提示词增强；精准编辑/拆图层/透明编辑默认 false |
| `reference_strength` | 不传 | 保留 Lite 旧版可选参数 0–1；Pro 文档未定义，因此拒绝 |
| `api_key` | 自动检测 | AgentPlan ark- Key，仅本次临时使用 |
| `save_api_key` | false | 仅用户明确要求保存 Key 时传 true；false 不保存 |
| `dry-run` | false | 仅输出选模理由与请求体，不发送请求 |

## Lite 连贯组图

同时传 `sequential=true`、`count=N`，在 prompt 明确写「生成 N 张一组的连贯图片」，描述每张内容及必要的一致性要求。输入参考图数 + 请求生成图数 ≤ 15。AgentPlan 不发送 `sequential_image_generation_options.max_images`，张数由 prompt 语义引导，实际以返回为准。

```bash
node scripts/generate.js --model auto --prompt '生成4张一组的连贯插画：同一庭院的春、夏、秋、冬，统一画风与构图' --sequential true --count 4
```

## Pro 示例

```bash
node scripts/generate.js --model pro --prompt '生成一张高精度产品海报，标题严格为「夏日限定」' --size 2K
node scripts/generate.js --interactive_edit true --reference_images '["https://example.com/marked.png"]' --prompt '在蓝色框内添加一个电视机，移除标记线，其余布局保持不变'
node scripts/generate.js --layer_decomposition true --reference_images '["https://example.com/poster.png"]'
node scripts/generate.js --background transparent --reference_images '["https://example.com/alpha-layer.png"]' --prompt '将鹦鹉改为孔雀，保留透明背景'
```

示例 URL 为占位符，调用时替换成实际资源。坐标示例与详细限制见 [模型参数](references/MODELS.md)。

## 配置与失败处理

沿用平台 Key 自动检测、临时 Key 与保存路径机制，见 [配置指南](references/CONFIG.md)。用户直接提供 Key 不表示允许持久化；只有明确要求保存才传 `save_api_key=true`。缺少 Key 时说明需要 AgentPlan Key；参数错误在请求前修正，涉及用户要求取舍时先问用户。生成请求不自动重试，避免重复生成；下载失败仍保留资源 URL。
