#!/usr/bin/env python3
"""
PostToolUse(Write) hook：当 Claude 用 Write 工具写入 memory 文件时，
在项目 .claude/ 下打一个标记文件，供 Stop hook 检测「本次会话写过 memory」。

匹配策略：检查 tool_input.file_path 是否含 "memory" 段。
（auto memory 默认写到 ~/.claude/projects/<project>/memory/，路径必含 memory。）
"""
import json
import sys
import os


def main() -> None:
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)

    file_path = (data.get("tool_input") or {}).get("file_path", "") or ""
    if "memory" not in file_path:
        sys.exit(0)

    project_dir = data.get("cwd") or os.environ.get("CLAUDE_PROJECT_DIR") or "."
    state_dir = os.path.join(project_dir, ".claude")
    marker = os.path.join(state_dir, ".memory-changed-this-session")
    try:
        os.makedirs(state_dir, exist_ok=True)
        open(marker, "w").close()
    except OSError:
        pass


if __name__ == "__main__":
    main()
