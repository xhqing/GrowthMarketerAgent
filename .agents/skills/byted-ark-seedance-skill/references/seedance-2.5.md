# Seedance 2.5 参数参考（AgentPlan v5）

来源：用户提供的《Doubao Seedance 2.5》参数文档（2026-09-10提供）。仅引用模型参数能力；未引入后付费开通、计费、配额和鉴权流程。

## 接入与模型选择

- Model ID：`doubao-seedance-2.5`，原样发送，不映射为带日期的后付费模型名。
- 请求路径：`/api/plan/v3/contents/generations/tasks`；查询、列表、删除继续使用原 AgentPlan 接口。
- 用户明确点名2.5时传 `--model doubao-seedance-2.5`；长期偏好可保存该值。
- 常规自动路由保留2.0标准版；2.5专属需求自动匹配2.5；速度偏好仍须服从所需能力。

## 输出与任务参数

| 参数 | 2.5值与约束 |
|---|---|
| duration | 整数4–30或-1，默认-1；编辑仅-1 |
| resolution | 480p、720p、1080p，默认720p；不支持4K；1080p为10bit |
| ratio | 21:9、16:9、4:3、1:1、3:4、9:16、adaptive；默认adaptive |
| output_format | mp4（默认）、mov |
| omni_reference_task_type | auto、edit、extend，仅全模态参考任务；有参考素材时默认auto |
| generate_audio | 沿用有声视频生成能力 |
| return_last_frame | 支持返回尾帧 |
| tools | 支持web_search，CLI使用 `--enable-web-search true` |
| draft / flex | 不支持；不将后付费资源包当作AgentPlan能力 |

MOV适合后期编辑/延长，可减少多轮处理色彩损失；采用H.264、yuv444p、PCM，播放需兼容播放器。

## 任务类型必须与提示词一致

- 文生视频：仅文本，不传全模态任务类型。
- 首帧/首尾帧：图片role为first_frame/last_frame，ratio必须adaptive；首尾帧不能与参考素材混用。
- 参考生成：图片/视频/音频role为reference_image/reference_video/reference_audio。1–2张参考图使用 `--image-role reference`；混合视频/音频时图片自动作为参考图。
- 编辑：`--omni-reference-task-type edit --ratio adaptive --duration -1`，至少一个参考视频；提示词明确“编辑视频、增加/加上、删除/去掉、修改/替换/改成”。待编辑视频4–30秒。
- 延长：`--omni-reference-task-type extend --ratio adaptive`，至少一个参考视频；提示词明确“向前/向后延长、延续、续写”。duration为输出时长，4–30或-1，不是额外追加秒数。可将结果作为下一轮参考视频进行多轮延长。
- auto：模型可能按提示词识别为编辑/延长；意图不明确时建议adaptive、-1，参考视频4–30秒。若用户明确要求其他比例/时长，不静默覆盖，解释冲突。
- 时间段、主体和素材关联通过提示词表达（如 `@video1`、`@image1`）；不要编造时间戳API字段。编号按各类素材在最终content中的顺序；CLI同类URL在本地文件之前。

即使指定edit/extend，服务端仍检查提示词意图。`InvalidParameter.TaskTypeMismatch` 表示意图与类型不一致；`InvalidParameter.TaskTypeConstraint` 表示任务参数冲突。修正类型、素材、比例或时长后再提交，不盲目重试。

## 输入素材限制

| 类型 | 数量 | 格式与大小 | 时长 |
|---|---|---|---|
| 图片 | 最多30张 | jpeg/png/webp/bmp/tiff/gif/heic/heif；单张<30MB | — |
| 视频 | 最多10个 | mp4/mov；单个≤200MB；24–60FPS；文档列出480p/720p | 单个2–30秒；编辑4–30秒；所有视频合计≤30秒 |
| 音频 | 最多10个，可独立参考 | wav/mp3；单个≤15MB | 单个2–30秒；所有音频合计≤30秒 |

- 三类合计最多50个。视频总时长和音频总时长分别计算。
- 图片和视频宽高比0.4–2.5、边长300–6000px；视频总像素407696–8295044。
- 图片、音频支持URL、Base64、素材ID；视频仅支持URL或素材ID。CLI将素材ID原样放入对应URL字段。
- 2.5本地视频不自动上传：使用可访问的URL/素材ID。不要把本地路径冒充URL。
- 请求体≤64MB，大素材优先URL/素材ID。代码校验数量、任务参数及请求体大小；尺寸、编码、单文件大小和媒体时长需在提交前核对，远程素材由服务端最终校验。
- 直接使用 `--payload-file` 时可精确指定content及role；同样接受2.5最终参数校验。

## 验证范围

本地自动化测试覆盖路由、请求字段、角色、参数冲突及素材数量边界。不调用真实视频生成接口；AgentPlan服务端实际可用性和新增字段支持需通过真实请求另行确认。
