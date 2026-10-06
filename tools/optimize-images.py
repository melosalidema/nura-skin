"""Optimize the editorial JPGs to WebP (and AVIF where Pillow supports it).

Dev-only tool. Emits width-variant WebP alongside each source image so the
HTML can use <picture> with a JPG fallback. Does not touch the source JPGs.

Run:  python tools/optimize-images.py
"""
import os
import sys

from PIL import Image, features

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
IMG_DIR = os.path.join(ROOT, "assets", "img")
WIDTHS = [800, 1200, 1600]
QUALITY = 72

HAS_AVIF = features.check("avif")


def human(n):
    return f"{n / 1024:.0f}KB"


def optimize():
    total_before = total_after = 0
    for name in sorted(os.listdir(IMG_DIR)):
        if not name.lower().endswith(".jpg"):
            continue
        path = os.path.join(IMG_DIR, name)
        before = os.path.getsize(path)
        total_before += before
        with Image.open(path) as im:
            im = im.convert("RGB")
            best = before
            stem = name[:-4]
            # full-width format siblings (used by <picture>)
            im.save(os.path.join(IMG_DIR, f"{stem}.webp"), "WEBP", quality=QUALITY, method=6)
            if HAS_AVIF:
                im.save(os.path.join(IMG_DIR, f"{stem}.avif"), "AVIF", quality=QUALITY)
            for w in WIDTHS:
                if w > im.width:
                    continue
                ratio = w / im.width
                resized = im.resize((w, max(1, round(im.height * ratio))), Image.LANCZOS)
                out_w = os.path.join(IMG_DIR, f"{stem}-{w}.webp")
                resized.save(out_w, "WEBP", quality=QUALITY, method=6)
                best = min(best, os.path.getsize(out_w))
                if HAS_AVIF:
                    resized.save(os.path.join(IMG_DIR, f"{stem}-{w}.avif"), "AVIF", quality=QUALITY)
        total_after += best
        print(f"{name:24} {human(before):>7} -> webp {human(best):>7}")
    print(f"\nTotal {human(total_before)} -> {human(total_after)}  (avif supported: {HAS_AVIF})")


if __name__ == "__main__":
    optimize()
    sys.exit(0)
