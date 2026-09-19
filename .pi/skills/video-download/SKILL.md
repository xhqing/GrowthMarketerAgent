---
name: video-download
description: >
  MUST USE when user wants to 下载视频 / download video / 保存视频 / 扒视频 /
  下载个 mp4 / 下载视频文件到本地 / 下载素材视频（广告参考、竞品视频等）/
  download a video under N seconds / 按时长筛选下载视频，或下载后发现
  「视频没声音 / 播放器静音 / silent video / no audio」需要排查修复时。
  覆盖：yt-dlp 选流与编码兼容（避免 Opus-in-MP4 静音坑）、按时长搜索筛选、
  下载后 ffprobe 验证、已踩坑文件的音频修复。
  NOT for：平台内容调研 / 字幕提取 / 评论抓取（用 agent-reach）；在线视频制作改编（用 hypit）。
metadata:
  homepage: https://github.com/Panniantong/Agent-Reach
---

# Video Download — 视频下载工艺

把网上的视频可靠地下载到本地文件，并保证「下载完就能在目标播放器里正常出声出画」。
平台访问路由（哪个平台用哪个工具、登录态、字幕提取）归 agent-reach，本 skill 只管
「下载成什么格式、怎么选流、怎么验证、坏了怎么修」。

## 标准流程（三步：查 → 下 → 验）

### 1. 查：先按条件筛候选，别盲下

需要按时长 / 标题挑视频时（例如「30 秒之内的广告」），先用 `ytsearch` 拿元数据：

```bash
yt-dlp --dump-json "ytsearch8:30 second TV commercial" | jq -r '[.id, .duration, .title] | @tsv'
```

从结果里选满足时长条件的视频 ID，再进入下载。

### 2. 下：编码兼容性优先，不是画质优先

**核心坑（实测踩过）**：yt-dlp 默认按「质量」排序选流，YouTube 上经常选中
AV1 视频 + Opus 音频；`--merge-output-format mp4` 只是换容器、不重新编码，
于是 Opus 音轨被装进 MP4 容器（dOps 轨）。**Chromium 媒体栈（VSCode 内置播放器等）
解不出这种音轨——画面正常但完全静音**；VLC、ffplay 能正常出声，所以问题容易被
掩盖，直到在 VSC / QuickTime / 微信里打开才发现。

预防：下载时就用 `-S` 偏好排序直接选 H.264 视频 + AAC 音频——QuickTime、微信、
各类剪辑软件等常规场景通吃：

```bash
yt-dlp -S "res:720,vcodec:h264,acodec:aac" --merge-output-format mp4 \
  -o "tmp/ads/<清晰命名>-%(id)s.%(ext)s" "https://www.youtube.com/watch?v=VIDEO_ID"
```

- `-S` 是软偏好不是硬过滤，选不到会回退，不会下载失败；
- `res:720` 参考素材够用且文件小，要高清按需调；
- 临时素材放项目 `tmp/`（确认在 `.gitignore`），正式交付物再迁移。

**VSCode 内置预览听不到任何 MP4 音频（产品限制，别在这上面浪费时间）**：
VSCode 自带的 ffmpeg 因编解码器许可证限制被裁剪，缺 AAC 解码器——MP4 里的
AAC 音轨在内置 media preview 里一律无声（画面正常），转成什么编码都救不了
（官方长期 issue：microsoft/vscode#167685，OPEN）。此外其播放器 autoplay 时
默认 muted。在 VSC 里只看画面，验收音频用 QuickTime / `afplay`。
QuickTime 不解 AV1，所以给 QuickTime / 微信用的文件必须是 H.264 版。
**找「能在 VSC 里出声的播放器扩展」也是死路**（2026-09 实测查证）：扩展 UI
全部跑在 webview 里，`<video>` 标签用同一套被裁剪的宿主解码器——marketplace
唯一专用扩展 analytic-signal.preview-mp4 解包源码实锤就是 `<video>` 方案，
同样无声；Simple Browser 内置浏览器同套限制（#329583）；WASM 解码路线无人做。
一键外部播放：`open -a QuickTimePlayer <file>`。

### 3. 验：ffprobe 确认，别信退出码

下载完成后必须实际验证编码与时长（命令成功 ≠ 内容可播）：

```bash
ffprobe -v error -show_entries stream=codec_type,codec_name -show_entries format=duration \
  -of compact FILE.mp4
```

验收标准：`codec_name=aac` 的音频轨在，duration 符合预期。

## 修复配方：已下载的文件在播放器里静音

先 ffprobe 确认音频轨是 `opus`（装在 MP4 里）——这是文件真有问题，修复只需
音频重编码为 AAC，视频流原样拷贝（画质无损、秒级完成）：

```bash
ffmpeg -y -v error -i bad.mp4 -c:v copy -c:a aac -b:a 160k -movflags +faststart fixed.mp4
# 验证通过后覆盖原文件，保持路径不变
mv fixed.mp4 bad.mp4
```

`+faststart` 把元数据挪到文件头，边下边播 / 网页播放更顺。

若音频轨已是 `aac` 却仍无声：用 `ffmpeg -af volumedetect` 确认音轨确有内容
（max_volume 在 -20dB 上下即正常），再确认是不是在 VSCode 内置预览里看的——
那是 VSC 产品限制（见上），换 QuickTime / `afplay` 即有声，文件不用动。

## 平台例外

- **B站禁止 yt-dlp**：B站风控全面 412 拦截 yt-dlp，改走 agent-reach 的
  bili-cli / OpenCLI 路线（见其 references/video.md）。
- 其余平台（YouTube 等）：本 skill 流程直接适用。

## 常用速查

| 需求 | 命令要点 |
|-----|-----|
| 按时长找视频 | `yt-dlp --dump-json "ytsearch8:关键词" \| jq ...` 筛 duration |
| 兼容性优先下载 | `-S "res:720,vcodec:h264,acodec:aac" --merge-output-format mp4` |
| 验证 | `ffprobe -show_entries stream=codec_name,format=duration` |
| 修静音（音轨是 opus） | `ffmpeg -c:v copy -c:a aac -b:a 160k` |
| VSC 里无声 | 不是文件问题：VSC 预览无 AAC 解码器（#167685），用 QuickTime / `afplay` 验收 |
| 只要音频 | `yt-dlp -x --audio-format m4a`（同样避开 opus/webm 兼容问题） |
