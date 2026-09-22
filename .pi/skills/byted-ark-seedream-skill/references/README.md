# AgentPlan Seedream Skill 4.0.0

支持 Seedream 5.0 Lite 与 5.0 Pro。入口、智能路由与参数说明见 [SKILL.md](../SKILL.md)，模型差异见 [MODELS.md](MODELS.md)。

- 普通生成默认 Lite；组图、联网、流式由 Lite 处理。
- 精准编辑、图层拆分、透明图层编辑选 Pro。
- 用户明确选择优先，能力冲突在请求前报错。
- 维持 AgentPlan `/api/plan/v3/images/generations` 接口及 ark- Key。
- stdout 返回 JSON，stderr 输出进度；图片与图层 metadata 保存到本地。

使用示例见 [EXAMPLES.md](EXAMPLES.md)，Key 和保存路径见 [CONFIG.md](CONFIG.md)，预处理及结果展示见 [DEVELOPER.md](DEVELOPER.md)。

离线检查：

```bash
node scripts/generate.js --model pro --prompt '一只猫' --dry-run
npm test
```

新增 Pro 参数依据用户提供的后付费参数文档适配。2026-09-10 已通过 AgentPlan 实测：1.5K PNG + fast 生图成功；自动路由 Pro 拆图层成功，返回1张JPEG底图和4张透明PNG图层，坐标与层级完整保存。其他参数组合尚未逐项实测。
