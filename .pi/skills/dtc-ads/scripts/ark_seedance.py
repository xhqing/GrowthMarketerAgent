#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""火山方舟标准 API · Seedance 视频生成最小工具（直充 / 后付费）

为什么有它：AgentPlan 端点（byted-ark-seedance-skill）在套餐不含视频模型时无法生视频，
本工具直连标准端点，只依赖标准后付费 API Key。

用法（在 skill 根目录或其上层任意位置均可，用自己的路径）：
  python3 scripts/ark_seedance.py submit --prompt "..." [--model doubao-seedance-2-0-mini-260615] \
      [--resolution 720p] [--duration 5] [--ratio 9:16] [--image 首帧路径] [--seed 12345]
  python3 scripts/ark_seedance.py get <task_id>
  python3 scripts/ark_seedance.py wait <task_id> [--out 保存目录] [--timeout 600] [--interval 10]

凭证：默认读 ~/.config/volcengine/ark_std_api_key；可用环境变量 ARK_STD_KEY_FILE 改路径。
说明：
  - 参数按方舟视频生成 API 的「文本命令」风格拼接在 prompt 末尾（--resolution / --duration / --ratio）。
  - --image 传首帧 / 参考图（base64 data URI）；建议先用 Seedream 出关键帧再图生视频，可大幅减少抽卡。
  - 仅在用户授权的生产场景下使用；任务与费用产生在账号侧。
"""
import argparse
import base64
import json
import mimetypes
import os
import pathlib
import sys
import time
import urllib.error
import urllib.request

BASE = "https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks"
KEY_FILE = pathlib.Path(
    os.environ.get("ARK_STD_KEY_FILE", "~/.config/volcengine/ark_std_api_key")
).expanduser()

DEFAULT_MODEL = "doubao-seedance-2-0-mini-260615"


def api_key():
    if not KEY_FILE.exists():
        sys.exit(f"缺少 API Key 文件: {KEY_FILE}")
    key = KEY_FILE.read_text().strip()
    if not key:
        sys.exit(f"API Key 文件为空: {KEY_FILE}")
    return key


def request(method, url, payload=None):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(url, data=body, method=method, headers={
        "Authorization": "Bearer " + api_key(),
        "Content-Type": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")
        print(f"[HTTP {e.code}] {detail}", file=sys.stderr)
        sys.exit(2)
    except urllib.error.URLError as e:
        print(f"[NETWORK] {e}", file=sys.stderr)
        sys.exit(2)


def build_text(args):
    text = args.prompt.strip()
    text += f" --resolution {args.resolution} --duration {args.duration} --ratio {args.ratio}"
    return text


def do_submit(args):
    content = [{"type": "text", "text": build_text(args)}]
    if args.image:
        p = pathlib.Path(args.image)
        mime = mimetypes.guess_type(str(p))[0] or "image/jpeg"
        b64 = base64.b64encode(p.read_bytes()).decode("ascii")
        content.append({"type": "image_url", "image_url": {"url": f"data:{mime};base64,{b64}"}})
    payload = {"model": args.model, "content": content}
    if getattr(args, "seed", None) is not None:
        payload["seed"] = args.seed  # 固定随机种子（-1=随机；范围 [-1, 2^32]；同 seed 只保证"相似"）
    resp = request("POST", BASE, payload)
    print(json.dumps(resp, ensure_ascii=False, indent=2))
    if resp.get("id"):
        print("TASK_ID=" + resp["id"])


def do_get(task_id):
    resp = request("GET", f"{BASE}/{task_id}")
    print(json.dumps(resp, ensure_ascii=False, indent=2))
    return resp


def do_wait(args):
    deadline = time.time() + args.timeout
    while True:
        resp = request("GET", f"{BASE}/{args.task_id}")
        status = resp.get("status", "?")
        print(f"[{time.strftime('%H:%M:%S')}] status={status}", flush=True)
        if status == "succeeded":
            print(json.dumps(resp, ensure_ascii=False, indent=2))
            url = (resp.get("content") or {}).get("video_url")
            if args.out and url:
                outdir = pathlib.Path(args.out)
                outdir.mkdir(parents=True, exist_ok=True)
                fname = outdir / f"{args.task_id}.mp4"
                urllib.request.urlretrieve(url, fname)
                print("SAVED=" + str(fname))
            return
        if status in ("failed", "canceled", "expired"):
            print(json.dumps(resp, ensure_ascii=False, indent=2))
            sys.exit(3)
        if time.time() > deadline:
            print("TIMEOUT（任务仍在平台侧继续，稍后用 wait/get 重查）", file=sys.stderr)
            sys.exit(4)
        time.sleep(args.interval)


def main():
    ap = argparse.ArgumentParser(description="Ark 标准 API Seedance 最小工具")
    sub = ap.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("submit", help="提交生成任务")
    s.add_argument("--prompt", required=True)
    s.add_argument("--model", default=DEFAULT_MODEL)
    s.add_argument("--resolution", default="720p", choices=["480p", "720p", "1080p", "4k"])
    s.add_argument("--seed", type=int, default=None, help="固定随机种子（-1=随机；[-1, 2^32]；同 seed 生成相似但不保证一致的结果）")
    s.add_argument("--duration", type=int, default=5)
    s.add_argument("--ratio", default="9:16")
    s.add_argument("--image", help="本地参考图路径（首帧/参考，视模型语义）")
    s.set_defaults(fn=do_submit)

    g = sub.add_parser("get", help="查询任务")
    g.add_argument("task_id")
    g.set_defaults(fn=lambda a: do_get(a.task_id))

    w = sub.add_parser("wait", help="轮询直到完成并下载")
    w.add_argument("task_id")
    w.add_argument("--out", default="")
    w.add_argument("--timeout", type=int, default=600)
    w.add_argument("--interval", type=int, default=10)
    w.set_defaults(fn=do_wait)

    args = ap.parse_args()
    args.fn(args)


if __name__ == "__main__":
    main()
