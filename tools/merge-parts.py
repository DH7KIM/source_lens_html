#!/usr/bin/env python3
"""분리 파일을 이어 붙여 단일 source-viewer.html을 만든다.

사용: python3 merge-parts.py <분리 폴더(split)> <만들 파일> [--check <원본 파일>]
--check를 주면 만든 파일이 원본과 바이트 단위로 같은지 비교한다 (같으면 0, 다르면 1로 끝남).
합친 파일은 직접 고치지 않는다. 고칠 때는 분리 파일을 고치고 다시 합친다.
"""
import sys, os

def main():
    args = sys.argv[1:]
    check = None
    if "--check" in args:
        i = args.index("--check")
        if i + 1 >= len(args):
            sys.exit(__doc__)
        check = args[i + 1]
        del args[i:i + 2]
    if len(args) != 2:
        sys.exit(__doc__)
    root, out = args
    names = []
    with open(os.path.join(root, "parts.txt"), encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#"):
                names.append(line)
    data = b""
    for n in names:
        with open(os.path.join(root, n), "rb") as f:
            data += f.read()
    with open(out, "wb") as f:
        f.write(data)
    print("합쳤습니다: 분리 파일 %d개 → %s (%d 바이트)" % (len(names), out, len(data)))
    if check:
        with open(check, "rb") as f:
            orig = f.read()
        if orig == data:
            print("확인: 원본과 바이트 단위로 같습니다.")
        else:
            n = next((i for i, (a, b) in enumerate(zip(orig, data)) if a != b), min(len(orig), len(data)))
            print("확인 실패: 원본과 다릅니다 (원본 %d 바이트, 합친 것 %d 바이트, 처음 다른 위치 %d)" % (len(orig), len(data), n))
            sys.exit(1)

if __name__ == "__main__":
    main()
