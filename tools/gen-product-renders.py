#!/usr/bin/env python3
"""
NŪRA SKIN — product render generator.

Emits 24 SVG product renders (3 views x 8 products) with a shared studio
system so the catalogue grid reads as one coherent shoot:

  * one warm studio sweep (per-product tint is a 7-10% mix of the packaging
    colour into the bone backdrop, never an arbitrary pastel)
  * single key light from the upper left, consistent across every product
  * grounded shadow: a tight contact ellipse at the object base plus a wide
    low-opacity ambient pool, both tinted warm — never a floating blob
  * packaging archetypes matched to the physical product (pump, dropper,
    jar, tube, screw-cap bottle) rather than one generic silhouette
  * views: 1 = front, 2 = three-quarter turn, 3 = closer camera (grounded)

Run:  python tools/gen-product-renders.py
"""

import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..",
                   "assets", "img", "products")

W, H = 800, 1000
CX = W / 2
BASE_Y = 792          # where every product stands
SCALE = 1.20          # master object scale
FONT = "Georgia,'Times New Roman',serif"

# ---------------------------------------------------------------- colour ---

def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def rgb_hex(c):
    return "#%02X%02X%02X" % tuple(max(0, min(255, round(v))) for v in c)

def mix(a, b, t):
    ca, cb = hex_rgb(a), hex_rgb(b)
    return rgb_hex(tuple(ca[i] + (cb[i] - ca[i]) * t for i in range(3)))

def shade(c, t):
    return mix(c, "#000000", t)

def tint(c, t):
    return mix(c, "#FFFFFF", t)

BONE = "#F2ECDF"          # parchment studio back
BONE_DEEP = "#E3D7C1"
INK = "#24382B"           # bottle-green caps
BRASS = "#9C7B3C"


# ---------------------------------------------------------------- helpers ---

def backdrop(pid, product_colour):
    """Shared studio sweep, tinted a few percent toward the packaging."""
    top = mix(BONE, product_colour, 0.07)
    bot = mix(BONE_DEEP, product_colour, 0.10)
    pool = mix(top, "#FFFFFF", 0.55)
    return f'''<defs>
  <linearGradient id="bd{pid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="{top}"/><stop offset=".72" stop-color="{bot}"/>
    <stop offset="1" stop-color="{shade(bot,0.05)}"/>
  </linearGradient>
  <radialGradient id="pool{pid}" cx=".32" cy=".16" r=".85">
    <stop offset="0" stop-color="{pool}" stop-opacity=".85"/>
    <stop offset=".55" stop-color="{pool}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="vig{pid}" cx=".5" cy=".46" r=".8">
    <stop offset=".6" stop-color="#4A3B2C" stop-opacity="0"/>
    <stop offset="1" stop-color="#4A3B2C" stop-opacity=".12"/>
  </radialGradient>
  <filter id="grain{pid}" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="11" result="n"/>
    <feColorMatrix in="n" type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="linear" slope=".05"/></feComponentTransfer>
  </filter>
</defs>
<rect width="{W}" height="{H}" fill="url(#bd{pid})"/>
<rect width="{W}" height="{H}" fill="url(#pool{pid})"/>
<rect width="{W}" height="{H}" fill="url(#vig{pid})"/>'''


def shadow(pid, base_w, cx=CX, cast=0.05):
    """Contact + ambient shadow pool. Object base sits on BASE_Y."""
    return f'''<defs>
  <filter id="amb{pid}" x="-80%" y="-260%" width="260%" height="620%">
    <feGaussianBlur stdDeviation="22"/>
  </filter>
  <filter id="con{pid}" x="-80%" y="-260%" width="260%" height="620%">
    <feGaussianBlur stdDeviation="6"/>
  </filter>
</defs>
<ellipse cx="{cx + base_w * cast:.0f}" cy="{BASE_Y + 12:.0f}" rx="{base_w * .62:.0f}" ry="{base_w * .085:.0f}"
         fill="#5B4C3B" opacity=".22" filter="url(#amb{pid})"/>
<ellipse cx="{cx + 3:.0f}" cy="{BASE_Y + 3:.0f}" rx="{base_w * .48:.0f}" ry="10"
         fill="#463A2C" opacity=".34" filter="url(#con{pid})"/>'''


def surface_def(pid, name, c, light=0.34, dark=0.38):
    """Vertical material gradient: lit left flank -> mid -> shaded right."""
    return f'''<linearGradient id="{name}{pid}" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="{mix(c,'#FFFFFF',light)}"/>
    <stop offset=".28" stop-color="{tint(c,0.10)}"/>
    <stop offset=".62" stop-color="{c}"/>
    <stop offset="1" stop-color="{shade(c,dark)}"/>
  </linearGradient>'''


def cap_def(pid, name, colour):
    return f'''<linearGradient id="{name}{pid}" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="{mix(colour,'#FFFFFF',0.30)}"/>
    <stop offset=".3" stop-color="{tint(colour,0.06)}"/>
    <stop offset=".7" stop-color="{colour}"/>
    <stop offset="1" stop-color="{shade(colour,0.30)}"/>
  </linearGradient>'''


def gloss(pid, x, y, w, h, op=0.34, rx=None):
    """Soft vertical highlight strip, blurred."""
    rx = rx if rx is not None else w / 2
    return (f'<rect x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="{h:.0f}" rx="{rx:.1f}" '
            f'fill="#FFFFFF" opacity="{op}" filter="url(#soft{pid})"/>')


def cap(pid, x, y, w, h, colour=INK, rx=13, ridged=False):
    """Cap / lid with a lit top face and a soft bottom occlusion."""
    d = f'''
  <rect x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="{h:.0f}" rx="{rx}" fill="url(#cap{pid})"/>
  <rect x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="{h * .38:.0f}" rx="{rx}" fill="#FFFFFF" opacity=".07"/>
  <rect x="{x:.0f}" y="{y + h - 10:.0f}" width="{w:.0f}" height="10" rx="{rx}" fill="#000000" opacity=".22"/>'''
    if ridged:
        teeth = max(6, int(w // 14))
        for i in range(1, teeth):
            tx = x + w * i / teeth
            d += f'<rect x="{tx:.1f}" y="{y + 4:.0f}" width="1.4" height="{h - 12:.0f}" fill="#000" opacity=".14"/>'
    return d


def label(pid, x, y, w, h, name, active, size, colour="#F2EADF", ink="#3A3128", rx=8):
    """Specimen label. Content is anchored to the box: wordmark top, name
    centred, claim and size pinned to the bottom — so it never overflows."""
    lines = name.split("\n")
    compact = h < 176
    if compact and len(lines) > 2:
        lines = lines[:2]
    word_sz = 20 if compact else 28
    name_sz = 13.5 if compact else 18
    active_sz = 16 if compact else 23
    size_sz = 11 if compact else 14
    cx = x + w / 2

    word_y = y + (26 if compact else 40)
    # name block centred vertically in the middle band
    line_h = name_sz + (4 if compact else 6)
    block_h = line_h * len(lines)
    block_top = y + h * 0.5 - block_h / 2 + name_sz * 0.78
    name_svg = ""
    for i, ln in enumerate(lines):
        name_svg += (f'\n  <text x="{cx:.0f}" y="{block_top + i * line_h:.0f}" text-anchor="middle" '
                     f'font-family="{FONT}" font-size="{name_sz}" letter-spacing=".2em" fill="{ink}">{ln}</text>')
    active_y = y + h - (40 if compact else 52)
    size_y = y + h - (14 if compact else 20)
    rule = "" if compact else (
        f'<rect x="{x + w*.3:.0f}" y="{word_y + 14:.0f}" width="{w*.4:.0f}" height="1.2" '
        f'fill="{BRASS}"/>')

    return f'''
  <rect x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="{h:.0f}" rx="{rx}" fill="{colour}"/>
  <rect x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="{h:.0f}" rx="{rx}" fill="none" stroke="#000" stroke-opacity=".07"/>
  <text x="{cx:.0f}" y="{word_y:.0f}" text-anchor="middle" font-family="{FONT}" font-size="{word_sz}"
        letter-spacing=".34em" fill="{ink}" font-weight="500">N&#362;RA</text>{rule}{name_svg}
  <text x="{cx:.0f}" y="{active_y:.0f}" text-anchor="middle" font-family="{FONT}"
        font-size="{active_sz}" letter-spacing=".08em" font-weight="500" fill="{ink}">{active}</text>
  <text x="{cx:.0f}" y="{size_y:.0f}" text-anchor="middle" font-family="{FONT}"
        font-size="{size_sz}" letter-spacing=".26em" fill="{ink}" opacity=".62">{size}</text>'''


# ------------------------------------------------------------ archetypes ---

def arch_dropper(pid, c, name, active, size, cap_h=132):
    """Glass dropper bottle: shoulders, visible pipette, screw cap."""
    bw, bh = 268, 322
    x, y = CX - bw / 2, BASE_Y - bh
    neck_w, neck_h = 104, 44
    nxx = CX - neck_w / 2
    pipette = f'''
  <rect x="{CX - 13:.0f}" y="{y - 6:.0f}" width="26" height="{bh * .52:.0f}" rx="12" fill="#FFFFFF" opacity=".16"/>
  <rect x="{CX - 5:.0f}" y="{y - 6:.0f}" width="10" height="{bh * .46:.0f}" rx="5" fill="#FFFFFF" opacity=".22"/>'''
    body = f'''
  <rect x="{nxx:.0f}" y="{y - neck_h:.0f}" width="{neck_w}" height="{neck_h + 24:.0f}" fill="url(#mat{pid})"/>''' + pipette + f'''
  <rect x="{x:.0f}" y="{y:.0f}" width="{bw}" height="{bh}" rx="34" fill="url(#mat{pid})"/>
  <rect x="{x:.0f}" y="{y:.0f}" width="{bw}" height="{bh}" rx="34" fill="none" stroke="#000" stroke-opacity=".10"/>''' \
        + gloss(pid, x + 16, y + 26, 20, bh - 110, .30, 10) \
        + gloss(pid, x + bw - 44, y + 60, 9, bh * .45, .16, 4.5) \
        + gloss(pid, x + 40, y + 22, bw - 84, 16, .28, 8)
    body += cap(pid, CX - cap_h * .46, y - neck_h - cap_h + 10, cap_h * .92, cap_h)
    lab = (x + 26, y + bh * .40, bw - 52, bh * .54)
    return body, bw, lab, ""

def arch_pump(pid, c, name, active, size):
    """Airless pump: tall body, collar, stem, nozzle."""
    bw, bh = 240, 352
    x, y = CX - bw / 2, BASE_Y - bh
    collar_w, collar_h = 92, 34
    body = f'''
  <rect x="{CX - collar_w/2:.0f}" y="{y - collar_h:.0f}" width="{collar_w}" height="{collar_h + 22:.0f}" fill="url(#mat{pid})"/>
  <rect x="{CX - 15:.0f}" y="{y - collar_h - 52:.0f}" width="30" height="56" rx="6" fill="{shade(c,0.35)}"/>
  <rect x="{CX - 64:.0f}" y="{y - collar_h - 74:.0f}" width="88" height="30" rx="12" fill="{shade(c,0.45)}"/>
  <rect x="{CX - 64:.0f}" y="{y - collar_h - 74:.0f}" width="52" height="30" rx="12" fill="#FFFFFF" opacity=".10"/>
  <rect x="{x:.0f}" y="{y:.0f}" width="{bw}" height="{bh}" rx="26" fill="url(#mat{pid})"/>
  <rect x="{x:.0f}" y="{y:.0f}" width="{bw}" height="{bh}" rx="26" fill="none" stroke="#000" stroke-opacity=".10"/>''' \
        + gloss(pid, x + 14, y + 20, 18, bh - 80, .30, 9) \
        + gloss(pid, x + bw - 38, y + 50, 8, bh * .42, .15, 4)
    lab = (x + 22, y + bh * .32, bw - 44, bh * .58)
    return body, bw, lab, ""

def arch_jar(pid, c, lid_c, name, active, size):
    """Wide cosmetic jar with an overhanging lid."""
    bw, bh = 316, 204
    x, y = CX - bw / 2, BASE_Y - bh
    lid_w, lid_h = bw + 14, 104
    lx = CX - lid_w / 2
    body = f'''
  <ellipse cx="{CX:.0f}" cy="{y + bh - 8:.0f}" rx="{bw/2:.0f}" ry="26" fill="{shade(c,0.18)}"/>
  <rect x="{x:.0f}" y="{y - 16:.0f}" width="{bw}" height="{bh - 8:.0f}" rx="20" fill="url(#mat{pid})"/>
  <rect x="{x:.0f}" y="{y - 16:.0f}" width="{bw}" height="{bh - 8:.0f}" rx="20" fill="none" stroke="#000" stroke-opacity=".10"/>''' \
        + gloss(pid, x + 16, y - 2, 20, bh - 44, .28, 10)
    body += f'''
  <rect x="{lx:.0f}" y="{y - 16 - lid_h:.0f}" width="{lid_w}" height="{lid_h + 8:.0f}" rx="20" fill="url(#lid{pid})"/>
  <ellipse cx="{CX:.0f}" cy="{y - 16 - lid_h + 6:.0f}" rx="{lid_w/2 - 6:.0f}" ry="17" fill="{mix(lid_c,'#FFFFFF',0.22)}"/>
  <rect x="{lx:.0f}" y="{y - 26:.0f}" width="{lid_w}" height="12" rx="6" fill="#000" opacity=".18"/>''' \
        + gloss(pid, lx + 18, y - lid_h - 8, 18, lid_h - 8, .26, 9)
    lab = (x + 36, y + 4, bw - 72, bh - 32)
    return body, bw, lab, ""

def arch_tube(pid, c, name, active, size):
    """Standing tube: crimped top, cap at the base."""
    bw, bh = 188, 348
    x, y = CX - bw / 2, BASE_Y - bh - 34
    cap_h = 46
    crimp = ""
    for i in range(9):
        cxp = x + 12 + i * (bw - 24) / 8
        crimp += f'<rect x="{cxp:.1f}" y="{y + 6:.0f}" width="2" height="24" rx="1" fill="#000" opacity=".13"/>'
    body = f'''
  <rect x="{x - 4:.0f}" y="{y:.0f}" width="{bw + 8:.0f}" height="34" rx="8" fill="{shade(c,0.10)}"/>
  {crimp}
  <rect x="{x:.0f}" y="{y + 22:.0f}" width="{bw}" height="{bh - 22:.0f}" rx="16" fill="url(#mat{pid})"/>
  <rect x="{x:.0f}" y="{y + 22:.0f}" width="{bw}" height="{bh - 22:.0f}" rx="16" fill="none" stroke="#000" stroke-opacity=".09"/>''' \
        + gloss(pid, x + 12, y + 40, 16, bh - 100, .30, 8) \
        + gloss(pid, x + bw - 30, y + 80, 7, bh * .34, .16, 3.5)
    body += cap(pid, CX - 62, BASE_Y - cap_h + 12, 124, cap_h, rx=10)
    lab = (x + 20, y + 96, bw - 40, bh - 156)
    return body, bw, lab, ""

def arch_bottle(pid, c, name, active, size):
    """Tall screw-cap bottle."""
    bw, bh = 224, 372
    x, y = CX - bw / 2, BASE_Y - bh
    cap_h, cap_w = 74, 108
    body = f'''
  <rect x="{CX - 46:.0f}" y="{y - 34:.0f}" width="92" height="40" fill="url(#mat{pid})"/>
  <rect x="{x:.0f}" y="{y:.0f}" width="{bw}" height="{bh}" rx="22" fill="url(#mat{pid})"/>
  <rect x="{x:.0f}" y="{y:.0f}" width="{bw}" height="{bh}" rx="22" fill="none" stroke="#000" stroke-opacity=".10"/>''' \
        + gloss(pid, x + 14, y + 18, 17, bh - 70, .30, 8) \
        + gloss(pid, x + bw - 36, y + 60, 8, bh * .4, .15, 4)
    body += cap(pid, CX - cap_w / 2, y - 34 - cap_h + 12, cap_w, cap_h, rx=9, ridged=True)
    lab = (x + 24, y + bh * .30, bw - 48, bh * .56)
    return body, bw, lab, ""


ARCHES = {
    "dropper": arch_dropper,
    "pump": arch_pump,
    "jar": arch_jar,
    "tube": arch_tube,
    "bottle": arch_bottle,
}

# arch, material colour, lid colour, name lines, headline claim, size, label ink/paper
PRODUCTS = {
    "cloudmilk-cleanser": dict(
        arch="pump", mat="#EDE6D7", lid="#24382B", name="CLOUDMILK\nCLEANSER",
        active="AMINO 9%", size="200 ML", ink="#2A241B", label="#F6F0E4"),
    "dewdrop-serum": dict(
        arch="dropper", mat="#B07A3A", lid="#24382B", name="DEWDROP\nHYDRA SERUM",
        active="HA 2%", size="30 ML", ink="#F6EEE2", label="#8A5C27"),
    "radiance-ritual": dict(
        arch="jar", mat="#EBDFC9", lid="#D5C2A2", name="RADIANCE\nRITUAL",
        active="BAKUCHIOL 1%", size="50 ML", ink="#2A241B", label="#F7F2E6"),
    "barrier-balm": dict(
        arch="jar", mat="#33513C", lid="#2A4433", name="BARRIER\nBALM",
        active="CERAMIDES 3%", size="60 ML", ink="#F2EBDC", label="#2A4433"),
    "pure-shield-spf": dict(
        arch="tube", mat="#EFE8D9", lid="#24382B", name="PURE SHIELD\nSPF 50",
        active="ZINC 18.6%", size="50 ML", ink="#2A241B", label="#F7F2E6"),
    "golden-hour-oil": dict(
        arch="dropper", mat="#B98A48", lid="#24382B", name="GOLDEN HOUR\nFACE OIL",
        active="SQUALANE 78%", size="30 ML", ink="#F6EEE2", label="#91652C"),
    "clarity-toner": dict(
        arch="bottle", mat="#E9E3D5", lid="#D7CDB7", name="CLARITY\nPHA TONIC",
        active="PHA 4%", size="120 ML", ink="#2A241B", label="#F7F2E6"),
    "night-bloom-masque": dict(
        arch="jar", mat="#55282A", lid="#472023", name="NIGHT BLOOM\nMASQUE",
        active="PAPAIN 2%", size="75 ML", ink="#F2EBDC", label="#421E20"),
}

VIEW_SCALE = {1: 1.0, 2: 0.94, 3: 1.62}


# ------------------------------------------------------------------ views ---

def build(pid, cfg, view):
    mat, lid = cfg["mat"], cfg["lid"]
    fn = ARCHES[cfg["arch"]]
    if cfg["arch"] == "jar":
        body, bw, lab, extra = fn(pid, mat, lid, cfg["name"], cfg["active"], cfg["size"])
    else:
        body, bw, lab, extra = fn(pid, mat, cfg["name"], cfg["active"], cfg["size"])

    lx, ly, lw, lh = lab
    body += label(pid, lx, ly, lw, lh, cfg["name"], cfg["active"], cfg["size"],
                  colour=cfg["label"], ink=cfg["ink"], rx=8)

    # view 2: three-quarter turn — narrower body nudged off-axis + side plane
    if view == 2:
        turn = f'<g transform="translate({CX} 0) scale(.94 1) translate({-CX + 14} 0)">{body}</g>'
        obj = turn + f'''
  <rect x="{CX + bw * .28:.0f}" y="{BASE_Y - 190:.0f}" width="{bw * .12:.0f}" height="190"
        fill="#FFFFFF" opacity=".05"/>'''
        scene = shadow(pid, bw * .94, cx=CX + 10, cast=0.06) + obj
    else:
        scene = shadow(pid, bw) + body

    # view 3: closer camera — grounded, slightly off-centre, no shadow pass
    s = VIEW_SCALE[view] * SCALE
    if view == 3:
        inner = f'<g transform="translate({CX - 26} {BASE_Y}) scale({s}) translate({-CX} {-BASE_Y})">{body}</g>'
    else:
        inner = f'<g transform="translate({CX} {BASE_Y}) scale({s}) translate({-CX} {-BASE_Y})">{scene}</g>'

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="{cfg['name'].replace(chr(10),' ').title()} — view {view}">
{backdrop(pid, mat)}
{defs(pid, mat, lid)}
<g>
{inner}
</g>
<rect width="{W}" height="{H}" filter="url(#grain{pid})" opacity=".5" style="mix-blend-mode:multiply"/>
</svg>
'''


def defs(pid, mat, lid):
    return f'''<defs>
  {surface_def(pid, 'mat', mat)}
  {cap_def(pid, 'cap', INK)}
  {cap_def(pid, 'lid', lid)}
  <filter id="soft{pid}" x="-80%" y="-40%" width="260%" height="180%">
    <feGaussianBlur stdDeviation="9"/>
  </filter>
</defs>'''


def main():
    os.makedirs(OUT, exist_ok=True)
    for pid, cfg in PRODUCTS.items():
        for v in (1, 2, 3):
            path = os.path.join(OUT, f"{pid}-{v}.svg")
            with open(path, "w", encoding="utf-8") as f:
                f.write(build(pid, cfg, v))
            print("wrote", os.path.relpath(path))


if __name__ == "__main__":
    main()
