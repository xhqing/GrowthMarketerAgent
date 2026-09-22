# Seedream 模型参数与边界

依据：用户提供的《Doubao Seedream 5.0 pro》Markdown（2026-09-10）。该材料是后付费参数文档；以下适配使用用户指定的 AgentPlan Pro 模型名及现有 Lite 接口。2026-09-10 已实测 AgentPlan Pro：1.5K PNG 生图 + fast 优化，以及不传 prompt、size=auto 的图层拆分；均成功。其余参数组合尚未逐项实测。不能把后付费价格、IPM 或可用性直接当作 AgentPlan 承诺。

| 能力 | 5.0 Lite | 5.0 Pro |
|---|---|---|
| AgentPlan model | doubao-seedream-5.0-lite | doubao-seedream-5.0-pro |
| 文生图、单/多图生单图 | 支持 | 支持 |
| 连贯组图、流式、联网搜索 | 支持 | 暂不支持 |
| 交互编辑、拆图层、透明图层编辑 | 不接入 | 支持 |
| 分辨率档位 | 2K / 3K / 4K | 1K / 1.5K / 2K |
| 参考图张数 | ≤14，输入+输出≤15 | 普通≤10；拆图层/透明编辑=1 |
| 服务端提示词优化 | standard | standard / fast |
| 输出文件 | jpeg / png | jpeg / png；透明编辑仅 png |

Lite 的 4K 按本次材料能力表补充，尚未进行 AgentPlan 实测。默认 2K 保持兼容。Pro 的 size 示例中出现「生成4张」与能力表不一致，以明确的「暂不支持组图」为准。

## Pro 输出与输入限制

普通生成：size 默认 2K，可用 1K、1.5K、2K 或宽x高；自定义总像素 921600–4624220，宽高比 1/16–16，必须同时满足。例：2048x1024 合法，512x512 不合法。

拆图层：size 默认 auto，仅允许 auto、1K、1.5K、2K，不支持具体像素值；image 恰好一张，prompt 可省略。返回最多 17 个资源，不受 Lite 的 15 张输入输出合计约束。output_format 仅控制底图。

普通输入：jpeg/png/webp/bmp/tiff/gif/heic/heif，每张≤30 MB；宽高均大于14，总像素196–36000000，宽高比1/16–16。拆图输入：仅png/jpeg，每张≤30 MB，总像素262144–36000000，宽高比1/16–16。Agent 应在转换本地文件时核实格式、尺寸与体积；URL 内容需以实际图片为准，脚本无法仅通过地址完整验证。

透明编辑：background=transparent，仅一张实际带透明通道的输入图，输出PNG；JPEG输入或输出不可用。不能把普通白底PNG视为已经带透明通道，也不能把此参数当成无参考图的透明文生图开关。

## 精准交互编辑

交互编辑通过参考图 + prompt 完成，不新增 bbox/point 顶层 API 字段。传 interactive_edit=true 只用于本地路由和关闭通用提示词增强。

任意标记：输入已标记的参考图，在 prompt 描述框选/箭头/涂鸦区域、修改内容及是否去除标记。

坐标：原样保留用户提供的归一化标签，例如：

```text
将图1<bbox>179 283 796 986</bbox>的主体放到图2<bbox>118 331 933 871</bbox>位置。
```

参考图数组顺序对应图1、图2。不要猜坐标或把绝对像素直接填进归一化标签。材料示例未完整定义交互坐标获取步骤；缺少坐标时可使用用户的自然语言或已有标记定位，需要精确标签时补充坐标依据。

## 图层返回

保留 data 中的 output_format、size、z_index、bounding_box、name、description，并下载每个 URL。z_index=0 是底图，其他图层按实际 output_format 保存为 PNG；不假设 data[0] 一定是底图。

bounding_box.absolute 是输出底图坐标系中的 [left, top, right, bottom]，normalized 是归一化坐标。结果 JSON 和 metadata 均保留这些字段，供后续重组使用。API返回顺序和z_index分别保留，不用本地index覆盖z_index。

## 参数隔离

CLI output_format（或旧别名 response_format）是文件格式；API response_format 固定 url。CLI optimize_prompt_mode 映射 optimize_prompt_options.mode；optimize 只控制本地文字增强。Pro 不发送 stream、tools、sequential_image_generation 或 reference_strength。不复制后付费 Model ID、接口地址、max_images 或价格配置。
