# 人声旁白（VO）工艺

## 为什么要旁白

十几秒的广告里，观众的注意力总得有个落点。**人声是最强的锚**——观众会不自觉跟着句子走，
于是注意力落在「内容」上，而不是「画面怎么切换的」上。旁白还有两个副作用是白赚的：

1. **缝合转场**：一句话跨过切点（J-cut），观众的听觉是连续的，视觉的切就被"带"过去了；
2. **静音之外可达**：开着声音刷的人听到卖点，静音刷的人看到字幕——两条通道各有交付。

经验判据：如果观众反馈「切镜头太明显 / 老盯着转场看」，第一处方不是改转场，是**加旁白**。

## 一句一镜：脚本写法

**每个镜头配一句话，全部读出来**（字幕就是这句）。句长按镜头时长控：

- 语速按 **≈ 2.5 词/秒**估算（TTS 默认语速附近）；**2 秒的镜头 ≈ 最多 5 个词**，3 秒约 7 个词；
- 句子太长就两选一：把镜头加长，或把句子砍短——**不要靠加快语速硬塞**（听起来像赶场）；
- 句式按镜头岗位配：
  - Hook（前 3 秒）＝ 断言句 / 悬念句：`This is what cold looks like.`
  - Desire ＝ 好处句：`Chilled all the way through.`
  - Proof ＝ 证明句：`And it fizzes to the very end.`
  - 收尾 ＝ 品牌句 + 卖点句：`FLOE sparkling water.` / `Finer fizz. To the last drop.`
- 全英文（铁律 2）；不写 CTA（铁律 3）；数字与功效类表述先过合规红线（铁律 4）。

## 落位：旁白跨切点（J-cut）

- 每句**提前 0.1–0.2 秒进**（画面还没切、人声先起）＝ J-cut；句尾让它自然收，不硬切；
- 旁白落在**新画面的开头**，观众听到句子时画面正好到——注意力被句子牵着走；
- 不要给旁白配"逐字出现"的字幕（字幕按镜头整句出现即可）——两个字幕系统会互相打架。

### 落位节奏：旁白要密，第一句尽早进

旁白不是"能少就少"——**声音的"空"很容易被当成没做完**（实际案例：开头 3 秒纯环境音的「先静后说」被客户退回，理由「旁白不能太少」）：

- **默认**：每镜都有话、**第一句尽早进**（0.5s 左右就开口）——观众从第一秒就有内容可跟，注意力不会被转场吸走；
- **「先静后说」只在客户明确要求"纯 ASMR 开场"时用**（头 2–3 秒纯环境音、第一句落在 3 秒前后）；用则要提醒代价：静音观看者前 2–3 秒没文字，**画面本身必须是钩子**；
- **句间留气**：两句之间留 0.1–0.2s 空白（慢速柔声尤其需要），但别主动把镜头前段空出来；
- 拿不准时先按「密」做：少说了观众会问，多说了可以再剪——反过来就得重排。

## 配音来源（按成本从低到高）

| 来源 | 成本 | 适用 |
|---|---|---|
| **macOS `say`** | 0 元、离线 | 打样、内部评审、非商业演示；音色偏机械，只有标准音色时不够「高级」 |
| **神经语音 TTS（`edge-tts`）** | 0 元、需联网、无需 key | 打样与内部评审的首选：音色接近商用 TTS（见下方“音色风格”）；**商用授权边界不明确，正式投放前换付费通道** |
| 客户自录 | 0 元 | 客户愿意出声（UGC 风格反而更真） |
| 付费 TTS（Azure Speech / ElevenLabs 等） | 低 | **正式商业投放的常规选择**（音色自然、授权链条清楚） |
| 真人配音 | 高 | 品牌片、预算充足时 |

### 神经语音（`edge-tts`）速用

```bash
# 列英文音色（看 Name / Gender / 风格标签）
edge-tts --list-voices | grep -E "en-US" | grep -i female

# 生成：--rate 调语速（-10% 已明显慢于默认）、--pitch 调音高
edge-tts --voice en-US-AvaMultilingualNeural --rate=-12% --pitch=-2Hz \
  --text "This is what cold looks like." --write-media /tmp/raw1.mp3

# 去首尾静音（TTS 输出的头尾常带 0.5s 以上空白，不去会害你误判“句子装不下”）
ffmpeg -i /tmp/raw1.mp3 -af "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,\
areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse" /tmp/v1.wav
```

- 好用的美音女声：`en-US-AvaMultilingualNeural`（温柔、自然、最“高级”）、`en-US-EmmaMultilingualNeural`（更亮更年轻）、`en-US-MichelleNeural`（沉静叙事感）、`en-US-JennyNeural`（邻家亲和）；
- **许可提醒**：`edge-tts` 走微软 Edge「朗读」通道，免费无 key，打样没问题；**正式商业投放改 Azure Speech 付费 key / ElevenLabs / 真人**，换音色只是重跑生成与混音两步，零成本。

### 音色风格怎么选（与卖点对齐）

慢速 ＋ 微降音高 ＋ 干声，是“高级感”的三个旋钮：

| 片子调性 | 音色 / 参数 |
|---|---|
| 高端、ASMR、质感（护肤 / 酒水 / 香氛 / 家电） | 温柔女声（Ava / Michelle）· `--rate=-10~15%` · `--pitch=-1~3Hz` · 干声 + 暖声 EQ ＋ 侧链闪避 |
| 活力、性价比、日常 | 亮一点的女/男声（Emma / Jenny）· 默认语速或 -5% |
| UGC / 口播风 | 换气声、口述感强的音色（或客户自录），不要太“播报” |

- **音色挑选法**：同一句 \+ 品牌句，做 5–6 个音色的试听带发给客户，听完点一个——比来回改稿省一轮；
- 慢速的代价是句长变长：**定语速后要重新核对「句长 ≤ 镜头时长」**，装不下就先砍句子，或者把尾卡延长（尾卡长点无妨）。

macOS `say` 用法与挑选：

```bash
# 生成（-r 语速 words-per-minute；默认 ≈ 175，广告播报常用 165–175）
say -v "Daniel" -r 168 -o /tmp/vo1.aiff "This is what cold looks like."

# 看本机有哪些英文音色
say -v '?' | grep -E "en_(US|GB|AU|CA|IE)"

# 音色挑选法：同一句话做一条「试听带」给客户挑（成本 0、省一轮返工）
#   5 个音色 × 同一句 → 拼成一条 m4a，客户听完点一个即可
```

- 标准音色里质量较稳的：`Daniel`（英音男）、`Samantha`（美音女）、`Karen`（澳音女）、`Moira`（爱音女）；
- 系统里还有大量**角色音**（Bubbles / Trinoids / Zarvox 等），只用于玩笑，不进广告；
- 想要更自然的音色：系统设置 → 辅助功能 → 朗读内容 → 系统声音 → 管理声音 → 下载 **Premium / Enhanced** 音色（免费，下载后 `say` 直接可用）；
- **注意**：`say -v` 指定一个未安装的音色时可能**静默回退**到默认音色——批量生成前先抽查 md5 或时长，确认不是同一条音频。

## 音频链（把旁白做到「清楚、有层次」）

```bash
# ① 每句：去静音 + 轻 EQ + 统一响度（句与句之间听起来一样响）
ffmpeg -i vo1.wav -af "highpass=f=85,equalizer=f=250:t=q:w=1:g=+1.5,\
equalizer=f=3500:t=q:w=2:g=+1.5,equalizer=f=9000:t=h:g=+1.5,\
acompressor=threshold=-18dB:ratio=3:attack=5:release=140,alimiter=limit=0.95,\
loudnorm=I=-14:TP=-2:LRA=7" -ar 44100 -ac 2 vl1.wav

# ② 铺轨：每句按落位时间 adelay（毫秒），全部混成一条旁白轨
ffmpeg -i vl1.wav -i vl2.wav -filter_complex \
  "[0:a]adelay=550:all=1[v1];[1:a]adelay=4050:all=1[v2];[v1][v2]amix=inputs=2:normalize=0[vo]" \
  -map "[vo]" vonorm.wav

# ③ 侧链闪避：旁白一开口，环境音自动压低（专业配音的标准做法）
ffmpeg -i amb.wav -i vonorm.wav -filter_complex \
  "[0:a][1:a]sidechaincompress=threshold=0.03:ratio=6:attack=5:release=250:makeup=1[duck];\
   [duck][1:a]amix=inputs=2:normalize=0,alimiter=limit=0.93[aout]" \
  -map "[aout]" mix.wav
```

**⚠️ 重封装后必须重验（2026-10-04 真实事故）**

- 只要做过任何「重新封装」动作（加字幕、换音轨、改容器），**必须在最终文件里重验旁白**：量**语音频段**（`highpass=f=300,lowpass=f=3000`）在"有旁白窗口"与"无旁白窗口"的能量差，**正常应差 6–8 dB 以上**；若两处相同 = **旁白轨已丢失**。
- 事故复盘：加字幕时把**拼接用的中间画面文件**当成了带完整混音的文件（中间文件里可能带着各段原始音轨），旁白与闪避被整轨替换，只剩环境音；当时只验了时长与黑帧、没验旁白 → 直到客户反馈才发现。**中间文件不可信，只认最终容器。**
- **音色选择**：温柔美式女声首选 **`en-US-JennyNeural`**（官方标签 Friendly / Considerate / **Comfort**），配 `rate -8%` / `pitch -2Hz`；`AvaMultilingual`（Expressive / Caring）次之；`Michelle`（Friendly / Pleasant）备选。
- **峰值**：效果声抬升后必须查 `max_volume`，**整片峰值 ≤ -1 dB**（本次 1.9× 抬升把峰值顶到 0 dBFS，降到 1.5× + `alimiter` 后为 -2.2 dB）。

**验收口径**（用 `volumedetect` 量）：

- 旁白句内 mean ≈ **-17 dB**，句间环境音 ≈ **-24 dB** → **分离 ≥ 8 dB 最好、≥ 6 dB 可接受**（低于 6 dB 就会听不清 / 显脏）；
- 整轨 max ≤ **-1 dB**（无削波）；
- 旁白是干声（不加混响）；ASMR 素材**不加音乐床**（音乐会同时削弱「干净」和「人声清楚」两件事）。

## ⚠️ 旁白与字幕必须同批交付（2026-10-07 用户立）

**旁白和字幕是一体两面**——字幕就是那句话本身（`references/voiceover.md` 早就写着"字幕即该句"）。因此：

- **任何时候给客户看/听旁白，必须连着字幕一起出**（预览片里带字幕、粗剪里带字幕），**不允许先出"只有旁白"的版本**再补字幕 ✗；
- 理由：① 观众绝大多数静音刷视频，**没有字幕的预览等于只完成了半条信息通道**；② 旁白与字幕的落点/断行/时长是同一个设计动作，分两次做必然返工（2026-10-07 NOPE 实拍：先交无字幕预览 → 用户当场指出 ✗）；
- 实操：剪片脚本里把"旁白轨 + 字幕卡"当**同一个构建步骤**（一次生成、一起进预览）。

## 字幕工艺（2026-10-04 实做固化）

**位置与样式**（720×1280 竖屏基准）：

| 项 | 取值 | 理由 |
|---|---|---|
| 位置 | 距顶 **13%**（`y=166`），水平居中 | 主体（产品/狗/碗）通常占中下部，**上方是唯一稳定空区**；62% 会压碗、30% 会压产品 |
| 字体 | Arial Bold `46px`（macOS：`/System/Library/Fonts/Supplemental/Arial Bold.ttf`） | 粗体无衬线、竖屏小字仍清晰 |
| 样式 | 白字 + **黑描边 5px**（`stroke_fill=(0,0,0,235)`）+ 微阴影 | 亮背景（窗光/地板）上也读得清，不用底板、不破坏画面 |
| 断行 | 最多 2 行、行距 12px、超宽自动缩字号 | 不许溢出画面 |
| 出入 | 淡入 0.12s / 淡出 0.15s | 避免硬闪 |
| 时长 | 与旁白句同步；短句（如 `Nine.`）多留 0.4–0.8s 便于阅读 | 字幕可比旁白晚 0.05–0.1s 收 |

**实现（必用 PIL 渲染 + ffmpeg 叠加，不要用 drawtext）**：

- `drawtext` 的坑：**不认 `\n`**（会原样打印）、不自动换行、长句**直接溢出画面**；
- 正确做法：PIL 逐卡渲染 **透明 PNG**（`ImageFont.truetype` + `draw_text` 描边 + `textlength` 量宽），再用 ffmpeg 叠加：

```bash
ffmpeg -i base.mp4 -loop 1 -i cap0.png -loop 1 -i cap1.png \
  -filter_complex "[1:v]format=rgba,fade=t=in:st=A:d=0.12:alpha=1,fade=t=out:st=B:d=0.15:alpha=1[c0]; \
                   [0:v][c0]overlay=x=0:y=166:enable='between(t,A,B)':format=auto[o0]; ..." \
  -map "[vout]" -map 0:a -t <成片时长> -c:v libx264 -crf 18 -c:a copy out.mp4
```

- **⚠️ 必须加 `-t <时长>`**：`-loop 1` 的图片输入是**无限流**，不加限长 ffmpeg 会一直编码下去（实测卡死 >20 分钟）；
- 字幕与旁白**逐句一字不差**（含标点）；一条片只用一种语言。

## 质检补充

- [ ] 每镜都有对应旁白句；句长与镜头时长匹配（没赶语速）
- [ ] 旁白与字幕逐句一字不差；品牌名读音正确
- [ ] 旁白提前 0.1–0.2s 进（J-cut），句尾不硬切
- [ ] 旁白句内电平比句间环境音高 ≥ 8 dB（至少 ≥ 6 dB）；整轨无削波
