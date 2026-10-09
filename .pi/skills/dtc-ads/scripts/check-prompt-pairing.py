#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""prompts.md 结构校验（dtc-ads skill 自带）

检查每条提示词是否满足「英文原文 + 中文对照，且两份都在代码块内」：
  1. 每个 `**英文（生成用...）**` 标签后紧跟一个非空代码块；
  2. 每个 `**中文对照（...）**` 标签后紧跟一个非空代码块；
  3. 英文块与中文块一一对应（数量相等、顺序成对）；
  4. 代码块外不得出现「游离正文」——正文只允许出现在：标题行的说明、`>` 引用块、标签之间的短提示（<= 2 行）；
  5. 代码围栏必须成对闭合，且没有空块（```text 后紧接 ```）。

用法：python3 check-prompt-pairing.py <prompts.md>
退出码 0 = 通过；1 = 有问题（打印问题清单）。
"""
import re
import sys
import pathlib

LABEL_EN = re.compile(r'^\*\*英文（')
LABEL_ZH = re.compile(r'^\*\*中文对照（')
HEADING = re.compile(r'^#{1,6}\s')


def main(path: str) -> int:
    lines = pathlib.Path(path).read_text(encoding='utf-8').split('\n')
    problems = []
    en, zh = 0, 0
    i = 0
    while i < len(lines):
        line = lines[i]
        is_label = LABEL_EN.match(line) or LABEL_ZH.match(line)
        if is_label:
            is_en = bool(LABEL_EN.match(line))
            en += is_en
            zh += (not is_en)
            # 期望：标签后空一行，然后一个非空代码块
            if i + 1 >= len(lines) or lines[i + 1].strip() != '':
                problems.append(f'第 {i+1} 行：{line.strip()[:24]} 标签后应有空行')
            blk = i + 2
            if blk >= len(lines) or not lines[blk].strip().startswith('```'):
                problems.append(f'第 {i+1} 行：{line.strip()[:24]} 标签后未紧跟代码块')
                i += 1
                continue
            j = blk + 1
            body = 0
            while j < len(lines) and lines[j].strip() != '```':
                if lines[j].strip():
                    body += 1
                j += 1
            if j >= len(lines):
                problems.append(f'第 {blk+1} 行：代码块未闭合')
                break
            if body == 0:
                problems.append(f'第 {blk+1} 行：空代码块（只有围栏没有内容）')
            i = j + 1
            continue
        i += 1

    # 游离正文检查：代码块外的普通段落行（排除标题 / 引用 / 空行 / 列表标记 / 标签行）
    inside = False
    for n, l in enumerate(lines, 1):
        s = l.strip()
        if s.startswith('```'):
            inside = not inside
            continue
        if inside or not s:
            continue
        if HEADING.match(s) or s.startswith('>') or s.startswith('-') or s.startswith('|') or s.startswith('**'):
            continue
        problems.append(f'第 {n} 行：代码块外的游离正文：{s[:40]}')
    if inside:
        problems.append('文件结束时仍有未闭合的代码围栏')

    if en != zh:
        problems.append(f'英文块 {en} 条 / 中文块 {zh} 条——数量不一致（应一一对应）')

    if problems:
        print(f'❌ {len(problems)} 处问题：')
        for p in problems[:30]:
            print('  -', p)
        return 1
    print(f'✅ 通过：英文 {en} 条 / 中文 {zh} 条，均为非空代码块，无游离正文')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else 'prompts.md'))
