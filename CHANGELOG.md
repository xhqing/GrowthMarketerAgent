# Changelog

## [Unreleased]

### 变更（T5 移出待办：可选项不进清单，全局待办纪律补「待办无可选项」）

- **为什么改**：用户纠正待办纪律——待办均为强烈建议及时处理的内容，可做可不做的自由动作不记录；T5（GitHub 主页 pin 六连，profile README 已承担门面职能后的锦上添花项）属此类。
- **改了什么**（2026-09-21）：① T5 移入 `TODO-archive.md` 标 ✅**已放弃**（理由：自由动作无需跟踪，想做随时可做）；② 全局 CLAUDE.md 待办管理节补「待办无可选项」纪律（可选项不记录，已记录的归档标已放弃）；③ 全局同步按 capability-sync 约定处理。

### 变更（商业敏感内容分流：CHANGELOG / TODO 敏感条目移入 local 文件）

- **为什么改**：按敏感信息纪律，商业敏感类内容不进公开仓库；相关内容尚未 commit，现在移出无历史残留。
- **改了什么**（2026-09-21）：① 新建 `TODO.local.md` 与 `CHANGELOG.local.md`（敏感条目整体移入，公开版留非敏感骨架）；② `.gitignore` 追加三个 local 文件；③ 公开版对应条目删除、TODO 头部指引更新。

### 变更（流程教训：越权直改上游产物，已补通报，今后先引导走上游）

- **为什么改**：用户指令修改手册措辞（Wright 交接产物），Buzz 未提示「应找上游 Wright」而是直接改了源目录 + zh 目录 + 重打包 zip——违反产物契约职责边界：上游不知情时，其后续迭代会基于旧基线覆盖修改、或产生版本分叉；且上游的完整内容流程（英文版对应检查、Payloadz 正式重传）未经手。用户指出此流程错误。
- **改了什么**（2026-09-21）：① 补做正式通报——Wright 仓新建 `artifacts/handoff-buzz-wright-registry-fix.md`（直改明细 + 三项复核接管请求 + 流程约定），Wright 仓 CHANGELOG 同步记录；② 行为约定：今后遇到「修改交接产物」类指令，先提示用户走上游 agent，不直接动手；确属紧急的应急直改必须显式标注应急 + 事后向上游正式通报。

### 变更（中文版 zip 定位 + 自动发货模板格式表述修正：Markdown 非 PDF）

- **为什么改**：用户问中文版 zip 位置；定位到 `ProductProducerAgent/artifacts/agent-team-playbook-zh-1.0.0.zip`，实测内容为 Markdown 文件（7 模块目录 README + md 模板 + team-diagram.svg），自动发货模板里「手册为 PDF」表述错误。
- **改了什么**（2026-09-21）：`listing.txt` 自动发货模板说明段改「内容为 Markdown 文件，任何文本编辑器 / Typora / VS Code 均可打开；模板可直接复制编辑」；该 zip（09-17 18:19，与 Mason 09-18 上架 Payloadz 时间吻合）即上传夸克用的交付文件，与 Payloadz 同版。

### 新增（自动发货私信模板：交付体验闭环）

- **为什么改**：用户实测发现个人售卖支持自动发货（买家付款后平台自动私信预设内容）——网盘交付无需人工跟进，交付全自助；需预先填好发货内容。
- **改了什么**（2026-09-21）：`listing.txt` 新增「自动发货内容」段——前置操作顺序（上传夸克 → 生成带提取码链接 → 替换占位符）+ 私信模板（交付清单 / 夸克主百度备双链接 / 阅读说明 / GitHub 搜索词引导 / 版本更新承诺 / 问题回复渠道）；无微信无裸外链，与站内口径一致。

### 变更（T5 降级：profile README 已含 Mermaid 架构图，组织门面职能已就位）

- **为什么改**：用户指出 xhqing/xhqing profile 仓已存在且有 Mermaid 架构图（这是未 pin 的原因）；实测验证属实——README 双语、首屏定位「Building an AI Agent organizational structure」、含 1 处 Mermaid（GitHub 原生渲染），买家进主页第一屏即见架构图。
- **改了什么**（2026-09-21）：T5 更新为可选加分项（不阻塞）——pin 六连仅提供 README 与仓库列表之间的六员工快速入口，「公开可查」链路不依赖它。

### 变更（GitHub 验证目标纠正：agent-team-playbook 仓 → xhqing 主页 Agent 组织；新增 T5 置顶任务）

- **为什么改**：用户纠正——买家要看的「公开可查」目标是 xhqing 主页上的 Agent 组织架构（19 个 Agent 仓库），agent-team-playbook 仓是产品静态承接页（X 引流用），与小红书无关；上轮搜索词指错了目标。
- **改了什么**（2026-09-21）：① 引导词全改「GitHub 搜 xhqing」：`detail-3.svg/png` 小字（行宽 518px 安全，已重生成）、`listing.txt` 描述、`china.md` 笔记 1/2 正文与私信话术（私信发主页链接）；② T4 修正表述（落地页断链仍是 X 侧链路问题，反馈 Mason 补 github.com/xhqing 链接）；③ 新增 T5：实测主页 pinned 为 0，需置顶销售流水线六连（ProductStrategistAgent/ProductProducerAgent/SiteBuilderAgent/GrowthMarketerAgent/DigiVendAgent/DataAnalystAgent，与六员工叙事一一对应），否则买家进主页看到的是 star 排序的历史仓库，找不到 agent 组织。

### 变更（GitHub 验证路径补通：站内搜索词引导 + 落地页断链反馈 Mason）

- **为什么改**：用户指出物料说「GitHub 公开可查」却没给链接，买家必然追问而小红书不能发外链；实测发现更深一层断链——落地页正文写着「GitHub repos」却没有任何可点击的 github.com 链接，「公开可查」承诺无兑现路径。
- **改了什么**（2026-09-21）：① 站内统一用搜索词兜底：「GitHub 搜 agent-team-playbook」（实测仓库名精确匹配唯一、描述含产品名可确认找对）——`detail-3.svg/png` 卡 2 小字改「GitHub 搜 agent-team-playbook 即可验证」（行宽 532px 卡内安全，已重生成）、`listing.txt` 描述括注搜索词、`china.md` 笔记 1/2 正文同步；② `china.md` 操作备术新增私信兑底话术（买家问链接时一对一私信发仓库链接，风险低）；③ T4 扩展：落地页 GitHub 断链反馈 Mason 补链接，打通「笔记→落地页→GitHub」验证链路。

### 变更（detail-3 文字溢出修复：去掉 DeepSeek 收窄行宽）

- **为什么改**：用户发现第 3 张副图卡 3 小字「嫌贵就换底座，组织原样平移：Claude Code · Codex · DeepSeek 等」超出背景卡片右边界（估算行宽 798px，起点 x=200 终点 998 > 卡片右界 960）。DeepSeek 由「等」字兜底表达，不影响国产底座兼容含义。
- **改了什么**（2026-09-21）：`detail-3.svg` 小字改「……Claude Code · Codex 等」（行宽约 700px，终点 x=900，回到卡内余 60px），PNG 已重生成；顺手对四张图全部文本行跑了宽度自检——无其他行接近画布边缘。

### 变更（商品物料遵守动态数字纪律：去掉写死的「20-agent」）

- **为什么改**：用户指出商品描述里「从 56 行最小 agent 到 20-agent 组织」写死了 agent 数量——商品页是常青资产，数量随组织增减会变，按纪律应用约数或不写数免维护。
- **改了什么**（2026-09-21）：`listing.txt` 详情行与 `detail-1.svg/png` 卡片 A 小字同步改「从 56 行最小 agent 到整支 agent 团队」（PNG 已重生成）；「56 行」是教程案例固定大小非组织规模，不属动态数字纪律管辖，保留。自查商品物料其余处（主图 / detail-2 / detail-3 / 标题三方案）均无写死数量。叙事帖（笔记 2「我现在有 20 个 AI 员工」）为时点快照，符合纪律，不改。

### 变更（「走读」术语替换：买家可见文案统一改「逐文件拆解」）

- **为什么改**：用户询问「走读」含义——术语有沟通成本（作者本人都需确认，买家更会疑惑）；walkthrough 的工程术语不宜直接面向消费者。
- **改了什么**（2026-09-21）：买家可见处全改「拆解」——① `listing.txt` 详情行改「2 个真实仓库逐文件拆解」；② `detail-1.svg/png` 卡片同步（已重生成）；③ `china.md` B 站卡 10 改；④ `x.md` FAQ 与数字核对清单改；⑤ `plan.md` 数字口径行更新并加注（买家可见用「拆解」，内部文档保留「走读」术语）；⑥ T4 扩展：落地页若有「走读」用词一并反馈 Mason。内部备注（IG 制作备注、utm 表描述）不面向买家，保留。

### 变更（痛点叙事第三次迭代定稿：作者亲历的「Token 消耗 + 注意力稀释」，演化故事入选题库）

- **为什么改**：用户第三次校正——「多而乱」也不成立（Harness 有规定存放位置，多而不乱）；真实痛点是作者演化过程中亲身解决的两个：① rules/skills 随事务积累膨胀且全量加载 → Token 消耗太快；② 无关规则每次都被读 → 注意力稀释、输出质量下降。并给出完整一手演化逻辑（分项目解耦 → Agent 项目类型（拟人名/专岗专职）→ 子项目超集 → 全局层定期清理），组织架构是演化产物非设计产物。
- **改了什么**（2026-09-21）：① `listing.txt` 商品描述改「AI 越用越贵、输出越来越钝？rules 全量加载在偷你的 Token」；② `detail-2.svg/png` 三画像重构（rules 攒了几百条的人 / 嫌 Token 贵的人 / 想上多 agent 的人）；③ `china.md` 笔记 2 全文重写（标题「AI 越用越贵、越用越钝？你的 rules 在偷 Token」+ 四步演化正文，废弃「杂物抽屉」叙事）；B 站视频卡 1、2 同步改；④ `instagram-youtube.md` YT Short 卡 1、2 改「pricier and duller / Hundreds of rules. All loaded. Every single time.」；⑤ `plan.md` 注记第三次升级为定稿版（含解法四步叙事）+ 信息屋支柱①证据点更新 + 二波选题库新增演化论叙事帖（`x-thread-evolution-08` / `xhs-note-evolution-03`）。「嫌贵」接法闭环：组织化 = 省 Token + 提质量，与换便宜底座双管齐下。

### 变更（全渠道认知修正：「用不满 5%」叙事全渠道废弃，升级为跨底座性价比迁移叙事）

- **为什么改**：用户二次纠正——不仅中文站内，**海外大多数用户同样嫌贵，且正出现换国产模型（性价比）的迁移趋势**；上轮「英文侧 5% 叙事不变」的判断基于过时受众假设，予以推翻。
- **改了什么**（2026-09-21）：① `x.md` 未发帖串 company-07 第 10 节改为「stacking AI subscriptions and still can't say who does what」（多而乱叙事）；已发 D1 帖串第 10 节存档加防复用注释；② `instagram-youtube.md` YT Short 卡 2 改「30 subscriptions. Zero coordination. Zero trust.」；③ `plan.md` 注记升级为全渠道认知修正，支柱④升级为「性价比迁移叙事」——组织不锁底座，换便宜 / 国产底座时组织资产原样平移（DSH 桥接帖选题已预判此方向）；④ `detail-3.svg/png` 卡 3 小字改「嫌贵就换底座，组织原样平移：Claude Code · Codex · DeepSeek 等」；⑤ `TODO.md` 新增 T4：确认落地页三卡片是否有 5% 类叙事，如有反馈 Mason 修正。

### 变更（站内中文痛点表述本地化：去除「用不满 5% / 吃灰」额度断言，痛点锚「多而乱」）

- **为什么改**：用户实地反馈——中文站内主流用户买最低档订阅、痛点是「贵 / 额度不够用 / API 直充更贵」，而非「用不满」；「用不满 5%」是英文侧受众（$20-200 订阅人群）画像的直译，对站内主流人群无感且显凡尔赛，对目标人群（工具重度投入者）也不够准（中文重度用户的痛点多在「多而乱 / 管不明白」）。
- **改了什么**（2026-09-21）：中文物料一律不做额度富余断言，痛点统一锚「多而乱 / 无协同」。① `listing.txt` 商品描述改「真到干活还是一团乱？」；② `detail-2.svg/png` 画像 1 改「订阅好几份的人：Claude、ChatGPT、Cursor 各一份，活儿还是各干各的」（三画像变为：多订阅无协同 / 插件囤积 / 分工不清，全部直指「组织」解法）；③ `china.md` 笔记 2 标题改「你的 AI 工具箱是个杂物抽屉」、自查首行改「AI 订阅买了一份又一份」、B 站视频卡 2 去「用到 5%」；④ `plan.md` 画像段加「站内中文痛点表述本地化」注记 + utm 表同步新标题。**英文侧（X/IG/YT）5% 叙事不变**——受众结构不同，产品定义层画像不变。

### 变更（手册内微信/群二维码决策：首版不放，售后防御走预期管理，读者群缓行）

- **为什么改**：用户提出两个动机——退款/举报防御与微信私域养群，需给出明确决策防后续犹豫。
- **改了什么**（2026-09-21）：`TODO.md` T3 补两项交接：④ 售后策略——微信安抚解决不了平台退款申请，防御靠预期管理（详情页副图 + open-core 边界）+ 描述如实，平台退款流程走 Vendy，不在手册内留个人微信一对一咨询（passive-income 红线，咨询服务会膨胀买家期望反致更多纠纷）；⑤ 读者交流群预案缓行——首批成交 ≥10 单后再评估，形态为读者交流群（非咨询承诺），入口只放 PDF 尾页，商品图/描述内绝不放微信二维码（审核拦截 + 站外导流违规）。

### 变更（商品标题压缩至 20 字内：去掉写死的「20 个」，三备选方案）

- **为什么改**：用户反馈商品标题限 20 字，原稿（31 字符）超限；且原稿写死「20 个 AI 员工」违反动态数字纪律——商品长期挂载属常青资产，agent 数量会变，应用约数或不写数免维护。
- **改了什么**（2026-09-20）：`listing.txt` 标题段更新——主推「多智能体组织手册：AI 员工管理法」（约 18 字符：主题 + 品类 + 钩子，无写死数字）+ 两个备选（钩子型「把 AI 组成一家公司」/ 纯品类型），以输入框实时计数为准。

### 变更（个人售卖入口分流确认：挂「出售技能」，新增关联收款方式步骤）

- **为什么改**：用户实测页面显示个人售卖分「出售闲置」与「出售技能」两个入口，需确定类目归属；OCR 截图另发现「买家还无法向你付款 → 去关联收款方式」的前置步骤。
- **改了什么**（2026-09-20）：`tmp/xhs-product/listing.txt` 观察点更新为六项——①入口选「出售技能」（入口文案「创建技能服务/商品」证明支持商品形态；闲置是二手交易类目，数字手册不属于）；②新增关联收款方式步骤提醒；其余项顺延。

### 新增（商品副图 3 张：内容清单 / 适用人群 / 交付说明，与主图同视觉成套）

- **为什么改**：用户问商品是否只有一张主图——个人售卖公开文档未查到张数规则（新功能文档少），但电商惯例大概率支持多图；且虚拟商品买家看不到实物，图片即「实物」，多图能显著提升信任与转化。
- **改了什么**（2026-09-20）：`tmp/xhs-product/` 新建 `detail-1.svg/png`（内容清单：7 模块 / 3 模板 / 2 走读 + 迁移指南）、`detail-2.svg/png`（适用人群三画像：订阅吃灰 / 插件囤积 / 多 agent 管理者）、`detail-3.svg/png`（交付说明：电子版整合包 / 开源边界 / 不锁底座）——均 2160×2160、与主图同视觉（深蓝紫渐变 + 青色卡片 + 圆角）；`listing.txt` 图片清单与观察点同步（新增第⑤项：实测图片张数上限）。

### 变更（商品主图与描述措辞：「付费买的是『组织』」→「付费买的是组织方法」）

- **为什么改**：用户指出中文语感问题——「组织」裸用默认指机构，「买组织」听着像买部门，别扭；但不改用 Know How（丢差异词、与英文侧 organization 口径漂移），而是语义补全。
- **改了什么**（2026-09-20）：`tmp/xhs-product/main.svg` 底行与 `listing.txt` 描述同步改为「付费买的是组织方法」，PNG 重新生成（2160×2160）；与 china.md 既有「组织层」表述同源，中英口径均不漂移。

### 新增（小红书商品创建物料包：主图 + 标题/描述/定价初值）

- **为什么改**：用户要先行商品创建流程实测（T3 第①步）；实测需主图与商品信息，且站内定价属 Vendy 决策、需以初值先跑通流程再交接。
- **改了什么**（2026-09-20）：新建 `tmp/xhs-product/`——`main.svg` + `main.png`（2160×2160 商品主图，沿用 X banner 同族视觉：深蓝紫渐变底 + 青色极简 org chart + 中文文案，圆角无棱角）；`listing.txt`（商品标题 / 描述 / 定价初值/ 数量填法 + 四项实测观察点：卡点、改价能力、交付选项、审核时长）。主图不放价格（避免改价后图文不一致）；open-core 声明已入图与描述。

### 变更（个人售卖入口默认可用：T3 推进到商品创建实测 + Vendy 交接阶段）

- **为什么改**：用户确认小号上个人售卖功能默认就有（无需等灰度/单独开通），站内通道可用时间比预估更早；但「入口可见」与「商品创建流程畅通」仍需最后一验。
- **改了什么**（2026-09-20）：① `china.md` 实名约束段「剩余动作」更新为「商品创建流程实测 + Vendy 定价交接」，专业号认证降为可选；② `TODO.md` T3 更新为「商品创建实测 + 交接」版本（时间戳 22:18），实测时同步收集定价 / 交付 / 类目选项（正是 Vendy 决策需要的输入）。D2/D6 纯内容版与 D8 商业元素解锁节奏不变。

### 变更（小号实名解决：共用实名实测成功，个人售卖通道解锁在望）

- **为什么改**：用户在小号 App 实测「共用实名」成功并完成实名绑定——实名一证一号约束解除，站内成交主通道的前置堵点清除，注销大号/家人证路线不再需要。
- **改了什么**（2026-09-20）：① `china.md` 实名约束段标注已解决（路线①达成、②③作废；大号闲置策略不变，属违规观察名单原因，与实名无关）；② `TODO.md` T3 更新为「实名已解决」版本（时间戳 21:17），剩余动作：专业号认证 → 个人售卖开通 → 交接 Vendy。引流排期与养号纪律不变（D2/D6 纯内容版、D8 商业元素解锁）。

### 变更（「账号关联」带货路线二次查证后排除：绑店铺、撞电子资源类目新规）

- **为什么改**：用户质疑关联带货功能是否真实存在；二次查证确认功能存在（官方专业号文档 + 知乎 / 卖家网 / 腾讯云多源交叉），但发现关键前提——账号关联绑定的是店铺（主号开店、子账号为店铺带货），而店铺上架电子资料类目正是被 2026-02 新规卡住的门槛，大号开店同样进不去 → 子账号无货可带，路线对本产品基本不通。
- **改了什么**（2026-09-20）：`china.md` 实名约束段新增「已排除」记录（防未来重复提出）；实名出路优先级不变：共用实名 > 注销释放身份证 > 家人证。

### 变更（大号预警定性：仅提醒级、不阻注销，注销路线时间表落定）

- **为什么改**：用户提供了大号 08-25 违规通知原图（OCR 提取）：类型为「账号违规预警」，平台明示「仅作提醒」、无处罚时限——比预设的「警告」更轻，且非封禁级，不阻碍正常注销流程，直接影响 T3 注销分支的可行性与时间表。
- **改了什么**（2026-09-20）：① `china.md` 实名约束段「注销大号」行更新——预警不阻注销，09-25 满 30 天后提交、7 天冷静期、预计 10 月初身份证释放；② `TODO.md` T3 背景同步该时间表。大号闲置策略与引流排期均不变。

### 变更（小红书实名一证一号约束：个人售卖通道加实名前置，引流不受影响）

- **为什么改**：用户指出小号实名可能行不通——身份证已被大号占用；查证确认小红书实名一证一号（不注销账号无法解绑/换绑），小号的专业号认证与个人售卖被实名卡住。
- **改了什么**（2026-09-20）：① `china.md` 成交通道策略节新增「实名约束」段——三条出路按优先级：共用实名（2026-07 内测，一证两号，用户 App 实测灰度）→ 注销大号释放身份证（等处罚期结束 + 7 天冷静期）→ 家人证（法律归属风险自担）；未解决期间站内通道搁置、成交走 Payloadz 直链；② 同文件 D8 商业元素解锁行改为分支口径（实名已过则双通道、未过则仅置顶评论直链）；③ `TODO.md` T3 改写为「实名前置待解」版本（时间戳 18:20）。发笔记 / 养号不需要实名，D2/D6 引流排期不变。

### 变更（小红书成交通道与账号策略定稿：小号主号 + 个人售卖双通道，商业元素后置）

- **为什么改**：原方案小红书成交通道为站外 Payloadz 直链（PayPal 支付），国内买家有付款门槛；查证发现 2026-02-10 小红书《电子资源定向准入及退出规则》生效，店铺电子资源类目准入门槛（粉丝 ≥1000 + 笔记 ≥30 篇 + 月流水 ≥6000 元证明）当前不可达；用户账号现状（大号内容违规警告不足一个月、小号注册满 180 天且干净）决定账号分工。
- **改了什么**（2026-09-20）：① `china.md` 新增「账号与成交通道策略」节——小号为主号（引流 + 成交，手机 App 常驻）、大号闲置 3–6 个月退出手机登录；成交通道改为「站内个人售卖（主，费率约 0.6%，支付宝/微信原生支付）+ 置顶评论 Payloadz 直链（辅）」双通道；发布纪律改为商业元素后置：D2/D6 笔记发纯内容版（删购买指引句、不放置顶评论），D8（09-26）养号期满后补置顶评论、新笔记挂站内商品；笔记 1/2 成稿同步改纯内容版、置顶评论行加注后置说明；② `plan.md` 发布节奏表 D2/D6 行同步纯内容版口径；③ `TODO.md` 新增 T3（个人售卖开通结果确认 + 站内定价/交付决策交接 Vendy）。

### 新增（TODO 记 T2：配 GA4 读取 service account）

- **为什么改**：D1 帖串发布当晚用户要看 GA4 Realtime，发现 Mason 工具链只有 Measurement Protocol 写入凭证（api_secret），无读取凭证，agent 无法代查，只能用户手动开后台。
- **改了什么**（2026-09-19）：`TODO.md` 新增 T2（🟢 绿色）——GCP 建 service account → GA4 property G-FRE2DZS751 加为 Viewer → 凭证放本机被忽略路径 → Data API runRealtimeReport 验证拉通，之后每日自查（Realtime / Traffic acquisition 按 utm_content 拆分）agent 可代拉。

### 新增（X profile 背景图 banner，交付用户上传）

- **为什么改**：用户 profile 无 banner，空 banner 是新号特征，损 TweepCred 可信度；置顶帖串把流量引到 profile，banner 是第一眼广告位，空着等于白送。
- **改了什么**（2026-09-19）：`tmp/banner/` 新建 banner.svg（源）+ banner.png（3000×1000，3:1 比例，X 推荐 1500×500 的高清 2x 版，抗上传压缩）——深蓝→深紫渐变底、左侧极简 org chart 图形（CEO 圆节点→三个 squad 圆角矩形→agent 小点，全圆角无棱角）、右侧人设主文案「The only human in a 20-agent AI company」+ tagline「the org lives in files」；所有内容收在中央安全区（手机端裁两侧）。几何自检：三行文案 x 范围均不与图形区重叠且在裁切容限内。产物在 tmp/（上传 X 用，不进 git）；用户采用后如需永久存档再迁正式目录。

### 变更（D1 帖串 Tweet 9 与 D8 / D10 单帖正文压进 280 字限，补全量字数验证）

- **为什么改**：用户发布 D1 帖串到第 9 帖时被 X 拒发（超 280 限）——成稿时未按 X v2 加权计数验证字数（em dash / 箭头 / box-drawing 等非拉丁字符算 2 权重，按字符数看考似不超、实际超）。全面复测：Tweet 9 实测 311/280 超标；D8（332）、D10（351）同样超标（未到发布日，提前修复）；其余帖串各条、首条回复、D4 均合规。
- **改了什么**（2026-09-19）：三处正文压缩（核心信息点全部保留）：①Tweet 9 第三行列举压缩（organization layer→org layer；copy-and-fill templates→templates；file-by-file walkthroughs of real repos→repo walkthroughs；cross-harness migration guide→migration guide）→ 246/280；②D8 删语气词与冗余句（That's it. / I run / Five sections 改冒号连接 / constraints→limits）→ 277/280；③D10 删 Hot take: / That's the real moat in 2026 引导句、末句 carry across all of them→ports across them → 274/280。`x.md` 与 `x-post-text.txt` 两处同步；全量 17 条（10 帖 + 4 首条回复 + 3 单帖）复测全部 ≤280。教训：X 非拉丁字符按 2 权重计，后续新内容成稿时必须跑加权计数脚本（非字符数）验证。

### 变更（D1 帖串 Tweet 4 改为 ASCII 组织架构图，兑现 Tweet 1 的 org chart 钩子）

- **为什么改**：用户审稿发现 Tweet 1 结尾钩子承诺「Here's the org chart 🧵」，但帖串里没有真正的架构图——Tweet 4 只有一行流水线文字名单（Scout (research) → ...），读者预期落空，钩子承诺未兑现。且内容包从头未设计配图。经与用户对齐，选 ASCII 纯文本方案（不制图）：改动最小、承诺帖串内当场兑现、与全 campaign 贯穿的 org chart 主题词一致。
- **改了什么**（2026-09-19）：`x.md` 与 `x-post-text.txt` 两处同步把 Tweet 4 改为 ASCII 树状架构图——CEO（唯一人类）→ Sales squad（Scout→Wright→Mason→Buzz→Vendy→Echo 流水线 + 职能行）→ Infra squad → Trading squad → 4 direct reports，收尾保留「20 agents. One registry.」。职能标注从括号内联改为独立行（sales ops 缩为 sales）；箭头间不留空格压字数，按 X v2 加权计数实测 260 / 280，不超限。

### 变更（数字口径补动态数字纪律：agent 数量会变，常青资产不写死精确数）

- **为什么改**：用户指出 agent 数量会随组织增减变化，不是恒定 20；bio / 置顶帖是常驻资产，写死精确数字会随组织变动失真，且每次增减 agent 都要改 bio（维护雷）。
- **改了什么**（2026-09-19）：`plan.md` 数字口径段补三条纪律——①常青资产（bio / 置顶帖）用约数（20-ish）或不写数；②叙事帖用时点快照数字不算漂移（与落地页当前口径一致即可）；③数字真实变动后落地页由 Mason 侧同步，bio 因用约数免跟改。既有帖串文案（含 20 处）不动：帖串是「上个月这次发布」的快照叙事，与落地页当前口径一致。

### 新增（同域短链路由 go/，X 发帖链接换短链）

- **为什么改**：用户反馈 UTM 长链接（127 字符）在 X bio / 帖子里太长且复制易断裂（已发生一次断链事故：链接断在 utm_campaign 值中间，归因丢失）；要求提供短链接。
- **改了什么**（2026-09-19）：①在落地页部署仓（SiteBuilderAgent 仓 tmp/deploy，即 GitHub agent-team-playbook 仓库）新建 `go/` 同域短链路由——bio/t1/p2/p3/p4 五个目录各一个 index.html，meta refresh + JS 双跳转到带完整 UTM 的落地页（跳转页不埋 GA，避免重复 page_view；归因靠落地页 URL 参数，不变；noindex 防搜索引擎索引短链页）；②GrowthMarketerAgent 仓 `x-post-text.txt` 全部链接换短链（头部附短链↔长链对照与生效条件）；③`plan.md` 登记短链映射表。短链生效条件：agent-team-playbook 仓 push 后 GitHub Pages 部署完成（待用户确认 push）。

### 新增（发帖用即贴纯文本包 `x-post-text.txt`，解决长链接复制断裂问题）

- **为什么改**：用户发帖时遇到链接显示异常——蓝色部分可点击但后面多出黑色文本，典型症状是从聊天窗口/终端复制长 URL 时软折行被复制成真实换行符，X 只把换行前半段识别为链接，后半段变纯文本；被截断的链接会丢失 utm_campaign/utm_content 参数，归因数据作废。需要一个「从文件直接复制」的干净源，避免经手聊天窗口/终端。
- **改了什么**（2026-09-19）：新建 `artifacts/playbook-launch/x-post-text.txt`——D1 帖串 x-thread-launch-01 全 10 节（去 markdown 标记的即贴版）+ 首条回复 + bio 链接 + D4/D8/D10 三条单帖及其首条回复，链接全部独占一行；头部注明务必从编辑器打开复制、不要从终端选区复制。另：同时补齐 x.md 里 launch thread 缺的发布时间窗与发后动作小节（见下条）。

### 变更（补齐 `x-thread-launch-01` 的四件套小节，D1 首发执行包就绪）

- **为什么改**：用户要启动 X 发帖引流；首波内容包里 launch thread 有成品文案但缺「发布时间窗 + 发后 30 分钟动作 + 首条回复话术」的配套小节（此前只有 company org thread 配齐了四件套），发帖时需临时拼凑、易漏掉置顶与 30 分钟互动 SOP。
- **改了什么**（2026-09-19）：`artifacts/playbook-launch/x.md` 第 1 节 launch thread 末尾补「发布时间窗（美东 8:00–9:30 AM = 北京 20:00–21:30，2026-09-19 周六晚首发；勿在北京白天发布，30 分钟攒回复触发点需受众在线）」+「发后 30 分钟动作（立即跟首条回复、攒 10 条回复、置顶、24h 回全部评论）」小节，回复话术储备指向文末通用表格。

### 变更（x-growth skill 触发优化：真实 pi 环境三轮评测，description 微调）

- **为什么改**：用户要求开跑 skill-creator 的 description 触发优化流程，验证 x-growth description 的触发准确率并改进；过程中发现 skill-creator 自带的评测管道（run_loop，基于 `claude -p` + `.claude/commands/` stub）对 pi 环境严重失真，需要换道自建 pi 原生评测。
- **改了什么**（2026-09-19）：①诊断：诊断实验实锤 skill-creator 管道两处失真——模型先调非 Skill/Read 工具即被判未触发（早退 bug）+ 判定只认读 commands stub，而模型实际主动读的是 `.pi/skills/` 真实文件，导致 should-trigger 全军覆没、5 轮优化全是噪声；②自建 pi 原生评测器（`tmp/x-growth-workspace/pi-trigger-eval.mjs`，用 pi SDK 构造与真实会话同构的环境：同一套 skill 发现注入 available_skills、同模型 zai-coding-cn/glm-5.3、同项目 cwd、只读工具集零副作用、read `.pi/skills/x-growth/` 即判触发、触发即提前中止），20 条查询 ×3 次；③三轮结果：基线 19/20（should-trigger 10/10 全 3/3）→ 第二轮 NOT for 具体化反而把「KOL 邮件」从 1/3 恶化到 3/3（排除项写得越具体越像反向触发器，字面重叠变成强匹配信号）→ 回滚后终态 19/20；④description 终态仅一处强化：NOT for 首条扩为「调研 / 抓取 / 看讨论 / 搜热帖（哪怕目的是为养号找回复目标，获取 X 站内内容一律 agent-reach）」。剩余唯一 FAIL「去 X 上看看评价 + 找值得回复的帖子」为语义双重意图查询的自然摇摆（三轮 2/3→1/3→2/3），非 description 缺陷，接受。

### 新增（X 组织管理视角帖串 `x-thread-company-07`，追加进首波 X 内容包）

- **为什么改**：用户要求写一个「我怎么用 20 个 AI agent 开一家公司」的 X thread，10 节左右、末节引到落地页。经核对，首波内容包里的 D1 首发主力帖串 `x-thread-launch-01` 已是同一题材（20 agents / 唯一人类 CEO / 10 节 / 末节 CTA），且已用过「agent 计划发死渠道 → hook 拦截」同一案例——直接新写会与主力帖串撞车。处理：不覆盖 `x-thread-launch-01`，按**换钩重发版**定位新写一条，入口钩子从「我们交付了产品」换成「这家公司怎么管」，重心从产品叙事移到组织管理（招聘 / 交接 / 绩效 / 裁撤）；两版是否替换 D1 主力由人定，不擅自改发布节奏。
- **改了什么**（2026-09-19）：①`artifacts/playbook-launch/x.md` 追加第 5 节 `x-thread-company-07`——10 节帖串成品（EN，组织管理视角：公司规模钩子 → 六部门流水线 → 一文件即招聘 → artifacts 交接契约 → 踩坑变规则再变 hook 执法（中段最强干货，第 4 节末预告）→ 绩效以交付契约为准 → 角色按文件裁撤 → 跨底座可移植 → 公开仓库即收据 → open-core 定价 CTA + 开放问题），含四件套（UTM 链接、发布时间窗、发后 30 分钟动作、回复话术储备）与本条过检记录；②`plan.md` utm_content 登记表新增 `x-thread-company-07` 行并标注与 `x-thread-launch-01` 至少隔 3 天。红线照旧：$49 无早鸟、无文件数、open-core 第 10 节明示、链接只指落地页。

### 新增（x-growth skill：X 平台引流变现工艺，装项目级 `.pi/skills/x-growth/`）

- **为什么改**：用户要求根据根目录 `x-algorithm.md` 的推荐算法机制，写一个本项目级的从 X 平台引流变现的 skill——算法情报此前是「知道」状态，缺一层「每条内容都过检」的执行工艺，把机制固化成写帖、发布、养号、质检的标准流程，避免每次做 X 内容时凭印象执行、漏掉外链 / 早鸟价这类高代价红线。
- **改了什么**（2026-09-19）：新建 `.pi/skills/x-growth/`（SKILL.md 140 行 + references/patterns.md 100 行，按 skill-creator 的 Progressive Disclosure 组织）：①SKILL.md 固化执行层规则——权威源路由（机制详解指根 `x-algorithm.md`、链接资产每次从 `artifacts/handoff.md` 取当前值，skill 不复制 URL 防漂移）、六条铁律（正文零外链、对话钩优先、6 小时生命周期运营、TweepCred 养号、建设性语气、常青层 + Starter Pack 中期目标，每条带 why）、产物契约（内容包四件套：UTM 链接 + 发布时间窗 + 发后 30 分钟动作 + 回复话术储备）、UTM 命名约定、内容红线（$49 / 无早鸟 / open-core / 不编数字 / 不数文件数 / TikTok Gumroad 禁用）、输出前 9 项质检清单；②references/patterns.md 放形态模板——单帖三型（对话钩 / 观点断言 / 算法帖）、干货 thread 节奏设计（吃完成率信号）、重发钩子操作（换钩换形态换 utm_content）、回复区链接 SOP（首条回复预写、作者回应 +75 的优先级）、bio 与置顶常青层、每日养号动作清单。

### 新增（X 推荐算法情报移交：根目录 `x-algorithm.md`）

- **为什么改**：用户要求把 Scout 仓里关于 X 平台开源推荐系统源码（`xai-org/x-algorithm`）的内容移交给 Buzz（引流执行要用算法机制做发帖决策）；该情报此前只在 Scout 仓选品报告 §3.5 里，Buzz 侧无本地依据。
- **改了什么**（2026-09-19）：新建根目录 `x-algorithm.md`，从 Scout《选品方案 v3》摘出自包含快照：①九条关键机制（互动权重序、外链惩罚、6 小时半衰期、30 分钟 10 回复触发点、TweepCred、情感信号、thread 完成率、主题一致性、长尾判定与 Starter Packs 通道）+ 补充机制细节；②X 算法运营手册六条铁律（链接铁律、发帖节奏、养号纪律、内容形态、常青层、Starter Pack 中期目标）；③算法帖内容钩子与首发草稿；④数字可信度边界。头部标注来源、快照基线（2026-08-13 release）与 trend_id/product_id 可追溯标签；Scout 侧 MEMO M1 持续跟踪机制更新后本文件同步换版。

### 新增（Playbook 上架引流方案 + 七渠道首波内容包，产出 `artifacts/playbook-launch/`）

- **为什么改**：Agent Team Playbook 已上架（Mason 交接：落地页 + Payloadz 双链接 + GA4 就绪，见 `artifacts/handoff.md`），流水线进入④引流期；需要把「怎么引、发什么、怎么归因、什么节奏」落成可执行方案与首波成品文案。
- **改了什么**（2026-09-19）：新建 `artifacts/playbook-launch/` 四文件——`plan.md`（总方案：核心叙事「meta 证明」、信息屋、渠道矩阵、utm_content 登记表、6 周发布节奏、红线清单、二波选题库）、`x.md`（EN：首发帖串 + 算法帖 / 56 行最小 agent 帖 / DSH 桥接帖）、`instagram-youtube.md`（EN：IG 三帖 + bio 链接、YT 60s Short 脚本 + 长视频大纲）、`china.md`（ZH：小红书两篇笔记、知乎价值先行回答、B 站动态 + 短视频脚本、视频号文案）。全部链接带 UTM（`utm_campaign=playbook-launch`，19 个 utm_content 已分配登记）；红线落死：不提早鸟价（EARLY35 未配置）、不数文件数（12/zip 与落地页 20 files 口径不一，文案一律回避）、open-core 边界每条内容明示、直链仅用于放不下落地页的场景。

### 新增（Hypit 实战：可口可乐 30s 广告改编百事版，产出 `tmp/pepsi/`）

- **为什么改**：用户要求把 30 秒可口可乐广告（「For Everyone :30」，已下载的 `tmp/ads/`）改成百事可乐版；Hypit 试用评估（见上条）需要一次真实改编验证纯本地路线的完整生产能力。
- **改了什么**（2026-09-18）：`tmp/pepsi/` 下建标准 Hypit 工程（references/ad 分析档案 + productions/pepsi-30s 创作源码）：① 选色 HSV 红转百事蓝预处理器（保护肤色与白背景，逐帧验证残余红 ≤0.28%）；② 原声 "Coca-Cola"（25.44–27.44s）压至 10% 并以本地 TTS "Pepsi."（Reed 声、音高 +1.12×、RMS 对齐原词 -28 dBFS）替换；③ 17 条跟随旁白的百事蓝字幕（YouTube 字幕轨词级对时）+ 白底百事地球仪尾卡（Wikimedia 2023 SVG）覆盖 24.56s 起的红色尾卡；④ 本地 Runtime 渲染成片 `output/pepsi-for-everyone-30s.mp4`（30s、1280×720、$0）。另：项目 `.gitignore` 补 `tmp/`（临时产物不入库）。

### 变更（video-download skill 补记「VSC 内有声播放扩展不存在」查证结论）

- **为什么改**：用户追问「有没有 VSCE 能在 VSC 里正常播放视频」；需把查证结论沉淀进 skill，防止后续重复搜索死路。
- **改了什么**（2026-09-18）：skill 的 VSC 专段补记：marketplace 查证（两轮关键词搜索）唯一专用扩展 analytic-signal.preview-mp4 解包源码实锤为 webview `<video>` 方案、同样无声；Simple Browser 同套限制（#329583）；WASM 解码路线无现成扩展；一键外部播放 `open -a QuickTimePlayer <file>`。

### 变更（video-download skill 纠错：VSC 内置预览不支持 AAC，音频验收换道）

- **为什么改**：实测证伪了 skill 初版的「H.264+AAC 全平台通吃（含 VSCode）」表述——最保守的 H.264+AAC 测试文件在 VSC 内置预览里仍无声；读本机 VSC 内置 media-preview 扩展源码（`videoPreview.js` autoplay 时默认 muted）+ 官方 issue（microsoft/vscode#167685 OPEN、#329811 实测产品自带 ffmpeg 缺 `ff_aac_decoder`、#156558 官方确认编解码器许可证裁剪）确认：VSC 预览就是解不出 MP4 里的 AAC，与文件无关、转码救不了，须防止后续再在这个死胡同里排查。
- **改了什么**（2026-09-18）：`.pi/skills/video-download/SKILL.md` 兼容性表述改为「QuickTime / 微信 / 剪辑软件等常规场景通吃」，新增「VSCode 内置预览听不到任何 MP4 音频」专段（成因 + issue 链接 + QuickTime 不解 AV1 的提醒）；修复配方段补充分流（音轨 opus = 文件问题照旧修；已是 aac 仍无声 = VSC 环境限制，换 QuickTime / `afplay` 验收，不动文件）；速查表同步。

### 新增（video-download skill 沉淀视频下载工艺，装项目级 `.pi/skills/`）

- **为什么改**：为 Buzz 下载 30 秒广告参考素材（Coca-Cola「For Everyone :30」）时踩坑——yt-dlp 默认按画质排序选中 AV1+Opus 流，`--merge-output-format mp4` 只换容器不重编码，Opus 音轨装进 MP4 后 VSC 内置播放器（Chromium 媒体栈）解不出、画面正常但静音（VLC 可放、易掩盖）；用户要求把下载工艺沉淀为 skill 并与 hypit 同策略装项目级（项目专用能力随仓库走、不污染全局）。
- **改了什么**（2026-09-18）：新建 `.pi/skills/video-download/SKILL.md`：三步标准流程（`ytsearch` + jq 按时长筛候选 → `-S "res:720,vcodec:h264,acodec:aac"` 兼容性优先选流 → ffprobe 验证编码与时长）、Opus-in-MP4 静音成因与修复配方（`ffmpeg -c:v copy -c:a aac -b:a 160k`，视频流无损）、平台边界（B站禁 yt-dlp 走 agent-reach bili-cli；调研/字幕归 agent-reach、视频制作改编归 hypit）。skill 初建于用户级 `~/.pi/agent/skills/`（与 `~/.claude/skills` 同 inode），后按用户要求整体移动到本项目 `.pi/skills/`，用户级已移除。

### 变更（hypit skill 从全局改到本项目项目级安装）

- **为什么改**：用户要求（2026-09-18）hypit skill 不装全局，改装项目级——它是 Buzz 专用能力，随仓库走（clone 后可用），不污染全局环境。
- **改了什么**（2026-09-18）：`npx skills remove hypit -g -y` 卸载全局（含 `~/.agents/skills/hypit` 与 pi 全局 symlink）；在本项目根 `npx skills add hypit-ai/hypit` 项目级安装到 `.agents/skills/hypit`（pi 原生扫描项目 `.agents/skills/`，Claude Code 得到 `.claude/skills/hypit` 相对 symlink），项目根新增 `skills-lock.json`；同步更新 `references/hypit-trial.md` 的安装位置表述。npm 可执行包 `@hypit/hypit`（机器级命令行工具，非 skill）保持全局安装不动。

### 新增（T1 完成：Hypit 试用评估报告 `references/hypit-trial.md`）

- **为什么改**：TODO **T1**（试用开源项目 Hypit、评估用于引流内容批量生产）已执行完毕，评估结论需要沉淀为正式参考文档供 Buzz 后续内容生产决策。
- **改了什么**（2026-09-18）：零成本路线全链路实测（装 skill + 可执行 v0.2.5、纯本地 Runtime、官方 chat 例子 8 秒竖屏片 28.7s 出片、换文案变体 20.9s、全程 $0），新建 `references/hypit-trial.md` 记录实测事实、对 Buzz 各渠道的适用形态（纯动效 / 字幕卡 / 聊天叙事）、暂缓形态（真人 / 数字人付费路线）、许可证与版本风险，结论为纳入工具箱作纯动效短视频批量生产线。同步归档 **T1** 至 `TODO-archive.md`（✅已完成），`TODO.md` 活跃条目清空。

### 新增（TODO.md 落地 + 试用 Hypit 待办）

- **为什么改**：用户调研开源项目 Hypit（github.com/hypit-ai/hypit，AI agent 批量克隆爆款视频工具）后决定试用，其批量视频变体能力与 Buzz 引流内容生产对口，按 TODO 管理规范记入待办；项目此前无 TODO.md（缺失标配）。
- **改了什么**（2026-09-18）：新建 `TODO.md`（含头部分流指引），🟢 绿色节新增 **T1**：试用 Hypit 并评估用于引流内容批量生产，附最快试用路径（`npx skills add hypit-ai/hypit -g` + `/hypit` 指令、纯代码渲染零成本路线）、许可证边界（Apache-2.0 附加条件，自用引流不受限）与版本风险（v0.2.x 迭代快）。

### 新增（接收 Mason→Buzz 建设期交接：成交阵地就绪，引流链接可用）

- **为什么改**：建设期（Mason）完成 Payloadz 上架 + 落地页部署 + GA4 埋点，销售闭环全链路生产环境验证通过；按流水线接力（③ Mason → ④ Buzz），引流期开工前需要正式接收链接资产与引流纪律。
- **改了什么**（2026-09-18）：新建 `artifacts/handoff.md`（被 gitignore 忽略的交接输入）：资产清单（落地页主推链接 / EN·ZH 购买直链 / GA4 看板）、UTM 约定（utm_source / medium / campaign / content 逐项口径，utm_content 每条引流内容唯一）、引流纪律（open-core 边界第一屏明示；早鸟码未配置前禁提早鸟价；渠道硬约束；product_id 与 campaign_id 双归因标签）、数据自查路径与 purchase 补录延迟说明。
- **边界**：仅新增交接输入；素材细节指向 Wright 仓《产品说明》；未动本仓任何既有文件。

## [1.0.0] - 2026-09-14

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
