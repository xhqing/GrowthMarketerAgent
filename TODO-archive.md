# TODO Archive

> 已处理待办的归档（条目保留原编号，永不复用）。

## 🟢 计划类（新功能实现，改期无实际损失）

- [ ] **T1** 试用开源项目 Hypit（github.com/hypit-ai/hypit），评估用于引流内容批量生产。背景：Hypit 给 coding agent（Claude Code / Codex）提供视频生产语言，把一条爆款视频拆成可复用工作流（分镜 / 字幕 / B-roll / 特效以词为锚），之后换人、换文案、换产品、换语言批量出变体——与 Buzz 各渠道（X / IG / YouTube / 小红书 / 知乎 / B 站）短视频引流的内容生产直接对口。最快试用路径：`npx skills add hypit-ai/hypit -g` 装成 skill，在任意目录对 agent 下 `/hypit` 指令；零成本路线选纯代码渲染（字幕 / 动效 / 代码画面，不调生成模型、$0 模型费），带 AI 数字人与语音的完整克隆约 $1/条（官方口径）。注意：许可证为 Apache-2.0 附加条件（自用与给客户做活允许，对外 SaaS 化需商业授权），自用引流不受限；当前版本 v0.2.x，迭代快、API 可能不稳。文档：hypit.ai/quickstart，中文版见仓库 README.zh-CN.md。（记录：2026-09-18 11:48）
  ✅**已完成**（完成：2026-09-18 12:02）零成本路线全链路实测通过：装 skill + 可执行 v0.2.5、纯本地 Runtime（media.local + hyperframes.local，无账号无 key）、官方 chat 例子 8 秒竖屏片 28.7s 出片、换文案变体 20.9s，全程 $0。结论：纳入 Buzz 工具箱作纯动效短视频批量生产线；真人 / 数字人路线（付费）暂不引入。评估报告见 `references/hypit-trial.md`。
