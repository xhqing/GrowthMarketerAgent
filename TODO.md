# TODO

> 个人隐私类待办分流至 `TODO.local.md`（不入公开仓库）。

## 🟢 绿色（计划类，改期无实际损失）

- [ ] **T2** 给 agent 配 GA4 读取权限（service account），实现「一句话拉 Realtime / 报表数据」的每日自查能力（记录：2026-09-19 23:20）
  - 背景：当前 Mason 工具链只有 Measurement Protocol 写入凭证（`~/.ga/api-secret.txt`），无读取凭证；D1 帖串发布当晚要看 Realtime 只能用户手动开 GA4 后台
  - 做什么：GCP 建 service account → GA4 property `G-FRE2DZS751` 加为 Viewer → 凭证 JSON 放本机被忽略路径（如 `~/.ga/`）→ 用 GA4 Data API `runRealtimeReport` 验证拉通
