#!/usr/bin/env python3
"""
Stop hook：检测本次会话是否有新的 AutoMemory 写入。
若有，返回 decision=block + additionalContext，提醒 Claude 按 CLAUDE.md
「经验提炼」规则把可复用经验固化到 .claude/rules/。

可移植：从 hook 输入的 cwd 动态推算 memory 目录（Claude Code 默认位置规则），
不硬编码机器路径；纯 Python，无 jq 依赖。

两路检测：
  ① marker 文件（PostToolUse 在 Write memory 时打的标记）—— 覆盖 Write 工具路径
  ② memory 目录 diff（与上次 checkpoint 比）—— 兜底，覆盖 Bash 等非 Write 修改
"""
import json
import sys
import os
import glob


def derive_memory_dir(cwd: str) -> str:
    """按 Claude Code 默认规则推算项目 memory 目录：
    ~/.claude/projects/<-绝对路径-斜杠替成短横>/memory/"""
    abs_cwd = os.path.abspath(cwd)
    derived = "-" + abs_cwd.lstrip("/").replace("/", "-")
    return os.path.join(os.path.expanduser("~/.claude/projects"), derived, "memory")


def main() -> None:
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)

    # 防循环：已连续 block 过，放行
    if data.get("stop_hook_active"):
        sys.exit(0)

    project_dir = data.get("cwd") or os.environ.get("CLAUDE_PROJECT_DIR") or "."
    state_dir = os.path.join(project_dir, ".claude")
    marker = os.path.join(state_dir, ".memory-changed-this-session")
    checkpoint = os.path.join(state_dir, ".last-memory-checkpoint")
    memory_dir = derive_memory_dir(project_dir)

    has_new = False
    new_files = []

    # ① marker 检测
    if os.path.exists(marker):
        has_new = True
        try:
            os.remove(marker)
        except OSError:
            pass

    # ② memory 目录 diff（兜底）
    if os.path.isdir(memory_dir):
        md_files = sorted(glob.glob(os.path.join(memory_dir, "*.md")))
        current_sig = json.dumps(
            {os.path.basename(f): os.path.getmtime(f) for f in md_files},
            sort_keys=True,
        )
        old_sig = ""
        if os.path.exists(checkpoint):
            try:
                old_sig = open(checkpoint, encoding="utf-8").read()
            except OSError:
                pass
        # 有基线且发生变化才算「新」；首次只建基线、不触发
        if old_sig and current_sig != old_sig:
            old = json.loads(old_sig)
            cur = json.loads(current_sig)
            new_files = [
                name for name in cur
                if name not in old or old.get(name) != cur[name]
            ]
            has_new = True
        try:
            os.makedirs(state_dir, exist_ok=True)
            open(checkpoint, "w", encoding="utf-8").write(current_sig)
        except OSError:
            pass

    if not has_new:
        sys.exit(0)

    files_str = ", ".join(new_files) if new_files else "未识别文件"
    result = {
        "decision": "block",
        "reason": (
            f"检测到本次会话有新的 AutoMemory 写入（{files_str}）。"
            "请按 CLAUDE.md 的「经验提炼」规则，把其中反复验证、可复用的经验"
            "提炼到 .claude/rules/（新增 <主题>.md 或追加到 CLAUDE.md）；"
            "纯临时上下文或未验证尝试则保留在 memory。完成后即可停止。"
        ),
        "additionalContext": (
            "[AutoMemory → Rules] 本次会话产生了新的 memory 条目。"
            "请判断哪些值得固化为确定性规则（跨会话复用），写入 .claude/rules/；"
            "提炼后从 memory 清除原条目，避免重复。"
        ),
    }
    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
