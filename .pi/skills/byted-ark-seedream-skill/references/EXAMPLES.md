# 调用示例

在 skill 根目录运行。示例 URL 需替换成用户实际参考图；用 `--dry-run` 检查请求时不会消耗额度。

## 普通生图与显式选模

```bash
node scripts/generate.js --model auto --prompt '一只猫趴在窗台上'
node scripts/generate.js --model pro --prompt '高精度产品海报，标题为「夏日限定」' --size 1.5K --output_format png
node scripts/generate.js --model pro --prompt '一张花卉插画' --optimize_prompt_mode fast
```

## Lite 组图与联网

```bash
node scripts/generate.js --model lite --prompt '生成4张一组的连贯插画：同一庭院的春夏秋冬，保持构图和画风一致' --sequential true --count 4
node scripts/generate.js --model lite --prompt '搜索最新赛事信息，制作一张赛事信息海报' --enable_web_search true
```

## Pro 编辑与拆图

```bash
node scripts/generate.js --interactive_edit true --reference_images '["https://example.com/marked.png"]' --prompt '在蓝色框内添加电视机，移除蓝框，保持其余布局不变'
node scripts/generate.js --model pro --reference_images '["https://example.com/source.png","https://example.com/scene.png"]' --prompt '将图1<bbox>179 283 796 986</bbox>的主体放到图2<bbox>118 331 933 871</bbox>位置'
node scripts/generate.js --layer_decomposition true --reference_images '["https://example.com/poster.png"]'
node scripts/generate.js --layer_decomposition true --reference_images '["https://example.com/poster.png"]' --prompt '拆出人物、标题文字和右下角装饰图标' --size 2K
node scripts/generate.js --background transparent --reference_images '["https://example.com/alpha-layer.png"]' --prompt '将鹦鹉改为孔雀，保持透明背景'
```

透明编辑输入需实际带透明通道。所有参数见 [SKILL.md](../SKILL.md)，能力限制见 [MODELS.md](MODELS.md)。
