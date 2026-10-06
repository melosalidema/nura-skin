"""Fetch IBM Plex Sans (300-600) + IBM Plex Mono (400,500), latin + latin-ext only."""
import os, re, urllib.request

# tools/ -> assets/fonts
FONTS = os.path.normpath(os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "..", "assets", "fonts"))
os.makedirs(FONTS, exist_ok=True)

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/122.0 Safari/537.36")

REQUESTS = [
    ("garamond", "family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600",
     ["latin", "latin-ext"]),
    ("caslon", "family=Libre+Caslon+Display", ["latin", "latin-ext"]),
]

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    return urllib.request.urlopen(req, timeout=60).read().decode("utf-8")

for slug, query, subsets in REQUESTS:
    css = fetch(f"https://fonts.googleapis.com/css2?{query}&display=swap")
    # split into /* subset */ @font-face blocks
    blocks = re.findall(r"/\*\s*([\w-]+)\s*\*/\s*@font-face\s*\{(.*?)\}", css, re.S)
    for subset, body in blocks:
        if subset not in subsets:
            continue
        weight = re.search(r"font-weight:\s*(\d+)", body).group(1)
        style = re.search(r"font-style:\s*(\w+)", body).group(1)
        suffix = weight + ("i" if style == "italic" else "")
        url = re.search(r"url\((https://[^)]+\.woff2)\)", body).group(1)
        out = os.path.join(FONTS, f"{slug}-{suffix}-{subset}.woff2")
        data = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60).read()
        with open(out, "wb") as f:
            f.write(data)
        print(f"{os.path.basename(out):34} {len(data)//1024:4} KB")

print("done ->", FONTS)
