# TODO

> 个人隐私与商业敏感类待办分流至 `TODO.local.md`，变更记录分流 `CHANGELOG.local.md`（均不入公开仓库）。

## 🟢 绿色（计划类，改期无实际损失）

- [ ] **T4** 落地页修正反馈 Mason：①「用不满 5%」类叙事与「走读」用词；② GitHub 断链——正文写着「GitHub repos — the storefront and the free samples」却无可点击 github.com 链接（记录：2026-09-21 14:05；同日修正：买家验证目标为 xhqing 主页 Agent 组织，非 agent-team-playbook 落地页仓——该仓仅为产品承接页，与小红书无关；站内引导词已改「GitHub 搜 xhqing」）
  - 背景：全渠道认知修正——「用不满 5%」叙事已废弃、「走读」已改「拆解」；落地页是 Mason 仓资产，本仓改不到
  - 做什么：向 Mason 提变更需求——①三卡片若含 5% 叙事改「Token 消耗 / 注意力稀释」痛点；②「走读」改「拆解」；③正文 GitHub repos 描述处补 github.com/xhqing 链接（打通 X 侧「帖串→落地页→GitHub 主页」验证链路，小红书侧走搜索词不依赖此项）

- [ ] **T3** 小红书个人售卖商品创建实测 + 交付/定价决策交接 Vendy（记录：2026-09-21 15:35）
  - 背景：实名已解决（共用实名成功）、个人售卖入口默认可用；定价与盈利模式相关决策属商业敏感，细节分流至 TODO.local.md（T6）
  - 做什么：① 完成商品创建实测（六项观察点：入口 / 卡点 / 改价能力 / 交付选项 / 图片上限 / 审核）；② 交付方式执行：网盘（夸克）+ 自动发货启动，自建下载页为升级方向（细节见 local T6）；③ 售后策略：预期管理（详情页副图 + open-core 边界）+ 平台退款流程走 Vendy，不在手册内留个人微信（passive-income 红线）；④ 读者交流群缓行（首批成交 ≥10 单后评估，入口只放 PDF 尾页，商品图 / 描述不放微信二维码）；⑤ Vendy 交接完成后闭环归档
- [ ] **T2** 给 agent 配 GA4 读取权限（service account），实现「一句话拉 Realtime / 报表数据」的每日自查能力（记录：2026-09-19 23:20）
  - 背景：当前 Mason 工具链只有 Measurement Protocol 写入凭证（`~/.ga/api-secret.txt`），无读取凭证；D1 帖串发布当晚要看 Realtime 只能用户手动开 GA4 后台
  - 做什么：GCP 建 service account → GA4 property `G-FRE2DZS751` 加为 Viewer → 凭证 JSON 放本机被忽略路径（如 `~/.ga/`）→ 用 GA4 Data API `runRealtimeReport` 验证拉通
