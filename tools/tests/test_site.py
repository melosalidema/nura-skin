"""NŪRA Skin — Playwright smoke + regression harness.

Serves the static site, loads every page at desktop and mobile, asserts no
console errors and no horizontal overflow, and writes screenshots.

Run:  python tools/tests/test_site.py
"""
import functools
import http.server
import os
import socketserver
import sys
import threading
import time

from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SHOTS = os.path.join(os.path.dirname(__file__), "shots")
PORT = 8130

PAGES = [
    "index.html",
    "shop.html",
    "shop.html?skin=oily&stock=1",
    "concern.html?c=texture",
    "compare.html?ids=dewdrop-serum,clarity-toner",
    "ingredients.html",
    "methodology.html",
    "cart-page.html",
    "product.html?id=dewdrop-serum",
    "product.html?id=golden-hour-oil",
    "routine.html",
    "about.html",
    "info.html?p=faq",
]

failures = []


def start_server():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    httpd = socketserver.ThreadingTCPServer(("127.0.0.1", PORT), handler)
    httpd.daemon_threads = True
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    time.sleep(0.4)
    return httpd


def check(page, url, label, errors):
    page.goto(url, wait_until="networkidle")
    page.wait_for_timeout(300)
    overflow = page.evaluate(
        "() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth })"
    )
    if overflow["sw"] > overflow["cw"] + 1:
        failures.append(f"{label}: horizontal page scroll {overflow['sw']} > {overflow['cw']}")
    if errors:
        failures.append(f"{label}: console errors {errors[:3]}")
    return page


def shot(page, path, full_page=False):
    """Screenshots are diagnostic only; a flaky capture must not fail the run."""
    try:
        page.screenshot(path=path, full_page=full_page)
    except Exception as exc:  # noqa: BLE001
        print("  (screenshot skipped:", exc, ")")


def main():
    os.makedirs(SHOTS, exist_ok=True)
    httpd = start_server()
    try:
        with sync_playwright() as p:
            b = p.chromium.launch()
            for name, vp in [("d", {"width": 1440, "height": 900}), ("m", {"width": 390, "height": 844})]:
                ctx = b.new_context(viewport=vp, reduced_motion="reduce")
                page = ctx.new_page()
                errors = []
                page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
                page.on("pageerror", lambda e: errors.append(str(e)))
                for slug in PAGES:
                    errors.clear()
                    url = f"http://127.0.0.1:{PORT}/{slug}"
                    label = f"{slug}[{name}]"
                    check(page, url, label, errors)
                    fname = slug.split("?")[0].replace(".html", "") + ("_" + slug.split("=")[-1].split("&")[0] if "=" in slug else "") + f"_{name}.png"
                    shot(page, os.path.join(SHOTS, fname), full_page=True)
                # step-number regression: no "Step 6 of 5"
                page.goto(f"http://127.0.0.1:{PORT}/product.html?id=golden-hour-oil", wait_until="networkidle")
                eyebrow = page.inner_text("#pdp .eyebrow")
                if "Step 6" in eyebrow:
                    failures.append("PDP: invalid step label for golden-hour-oil")

                # structured data must be valid JSON
                for url, expected in [
                    (f"http://127.0.0.1:{PORT}/product.html?id=dewdrop-serum", "Product"),
                    (f"http://127.0.0.1:{PORT}/info.html?p=faq", "FAQPage"),
                ]:
                    page.goto(url, wait_until="networkidle")
                    import json
                    blocks = page.eval_on_selector_all(
                        'script[type="application/ld+json"]', "els => els.map(e => e.textContent)"
                    )
                    types = []
                    for blk in blocks:
                        try:
                            types.append(json.loads(blk).get("@type"))
                        except Exception as exc:  # noqa: BLE001
                            failures.append(f"JSON-LD invalid on {url}: {exc}")
                    if expected not in types:
                        failures.append(f"JSON-LD missing {expected} on {url}: {types}")

                # sitemap + robots reachable
                for asset in ["sitemap.xml", "robots.txt"]:
                    r = page.request.get(f"http://127.0.0.1:{PORT}/{asset}")
                    if r.status != 200:
                        failures.append(f"{asset} returned {r.status}")
                ctx.close()
            # search: grouped results + keyboard navigation
            sp = b.new_page(viewport={"width": 1440, "height": 900})
            sp.goto(f"http://127.0.0.1:{PORT}/index.html", wait_until="networkidle")
            sp.click("[data-search]")
            sp.fill("#q", "niacinamide")
            sp.wait_for_timeout(300)
            groups = sp.eval_on_selector_all(".search-group", "els => els.map(e => e.textContent)")
            if "Products" not in groups or "Ingredients" not in groups:
                failures.append(f"search: expected grouped results, got {groups}")
            sp.keyboard.press("ArrowDown")
            sp.keyboard.press("ArrowDown")
            focused = sp.evaluate("() => document.activeElement && document.activeElement.hasAttribute('data-hit')")
            if not focused:
                failures.append("search: arrow keys did not move focus to a result")
            sp.fill("#q", "zzzznomatch")
            sp.wait_for_timeout(250)
            if not sp.query_selector(".search-recover"):
                failures.append("search: zero-result recovery missing")
            shot(sp, os.path.join(SHOTS, "search_grouped_d.png"))

            # evidence ledger + sample results timeline on the PDP
            lp = b.new_page(viewport={"width": 1440, "height": 900})
            lp.goto(f"http://127.0.0.1:{PORT}/product.html?id=dewdrop-serum", wait_until="networkidle")
            lp.wait_for_timeout(300)
            if not lp.query_selector(".results__chart"):
                failures.append("PDP: results timeline missing for dewdrop-serum")
            claim = lp.query_selector(".assay__n[data-claim]")
            if not claim:
                failures.append("PDP: no clickable evidence figure found")
            else:
                claim.click()
                lp.wait_for_timeout(350)
                if not lp.query_selector(".ledger.is-on"):
                    failures.append("ledger: panel did not open on evidence click")
                else:
                    title = lp.inner_text(".ledger__title")
                    if not title.strip():
                        failures.append("ledger: empty title")
                    shot(lp, os.path.join(SHOTS, "ledger_d.png"))
                    lp.keyboard.press("Escape")
                    lp.wait_for_timeout(250)
                    if lp.query_selector(".ledger.is-on"):
                        failures.append("ledger: Escape did not close the panel")

            # comparison: tray + table
            cp = b.new_page(viewport={"width": 1440, "height": 900})
            cp.goto(f"http://127.0.0.1:{PORT}/shop.html", wait_until="networkidle")
            cp.wait_for_timeout(300)
            btns = cp.query_selector_all("[data-compare]")
            if len(btns) < 2:
                failures.append("compare: fewer than two compare buttons on shop")
            else:
                btns[0].click()
                btns[1].click()
                cp.wait_for_timeout(300)
                if not cp.query_selector(".cmp-tray.is-on"):
                    failures.append("compare: tray did not appear after selecting")
            cp.goto(f"http://127.0.0.1:{PORT}/compare.html?ids=dewdrop-serum,clarity-toner", wait_until="networkidle")
            cp.wait_for_timeout(300)
            rowheads = cp.eval_on_selector_all(".cmp tbody th", "els => els.map(e => e.textContent)")
            if "Cost per ml" not in rowheads:
                failures.append(f"compare: table missing rows {rowheads}")
            shot(cp, os.path.join(SHOTS, "compare_d.png"))

            # ingredient atlas: filter, search and deep link
            ap = b.new_page(viewport={"width": 1440, "height": 900})
            ap.goto(f"http://127.0.0.1:{PORT}/ingredients.html", wait_until="networkidle")
            ap.wait_for_timeout(300)
            if len(ap.query_selector_all("#atlas .gl")) != 12:
                failures.append("atlas: expected 12 entries")
            ap.fill("#atlas-q", "bakuchiol")
            ap.wait_for_timeout(250)
            if len(ap.query_selector_all("#atlas .gl")) != 1:
                failures.append("atlas: search did not narrow to one entry")
            ap.goto(f"http://127.0.0.1:{PORT}/ingredients.html#niacinamide", wait_until="networkidle")
            ap.wait_for_timeout(400)
            opened = ap.evaluate("() => { const e = document.getElementById('niacinamide'); return !!(e && e.classList.contains('is-open')); }")
            if not opened:
                # same-document hash navigation does not re-run scripts; load fresh
                dp = b.new_page(viewport={"width": 1440, "height": 900})
                dp.goto(f"http://127.0.0.1:{PORT}/ingredients.html#niacinamide", wait_until="networkidle")
                dp.wait_for_timeout(400)
                opened = dp.evaluate("() => { const e = document.getElementById('niacinamide'); return !!(e && e.classList.contains('is-open')); }")
                if not opened:
                    failures.append("atlas: deep link did not open the entry")
            shot(ap, os.path.join(SHOTS, "atlas_d.png"))

            # bag page: add an item, then verify line + summary + cross-sell
            bpg = b.new_page(viewport={"width": 1440, "height": 900})
            bpg.goto(f"http://127.0.0.1:{PORT}/product.html?id=dewdrop-serum", wait_until="networkidle")
            bpg.wait_for_timeout(300)
            bpg.click("[data-main-add]")
            bpg.wait_for_timeout(400)
            bpg.goto(f"http://127.0.0.1:{PORT}/cart-page.html", wait_until="networkidle")
            bpg.wait_for_timeout(400)
            if not bpg.query_selector(".cline"):
                failures.append("bag: line item missing after add")
            if not bpg.query_selector(".cart-sum"):
                failures.append("bag: summary missing")
            if not bpg.query_selector("#cart-cross .card"):
                failures.append("bag: cross-sell missing")
            # quantity stepper updates subtotal
            bpg.click(".cline [data-inc]")
            bpg.wait_for_timeout(300)
            sub = bpg.inner_text(".cart-sum__tot dd")
            if sub.strip() in ("", "$0"):
                failures.append("bag: subtotal did not update")
            shot(bpg, os.path.join(SHOTS, "cart_page_d.png"))

            # routine builder: complete quiz -> AM/PM + printable routine
            rp = b.new_page(viewport={"width": 1440, "height": 900})
            rp.goto(f"http://127.0.0.1:{PORT}/routine.html", wait_until="networkidle")
            rp.wait_for_timeout(300)
            for _ in range(3):
                rp.click("#panels [data-pick]")
                rp.wait_for_timeout(300)
            summary = rp.inner_text(".summary").upper()
            if "MORNING" not in summary or "EVENING" not in summary:
                failures.append("routine: AM/PM split missing from summary")
            if not rp.query_selector("[data-print]"):
                failures.append("routine: print button missing")
            shot(rp, os.path.join(SHOTS, "routine_result_d.png"))

            # accessibility assertions across pages
            ax = b.new_page(viewport={"width": 1440, "height": 900})
            for slug in PAGES:
                ax.goto(f"http://127.0.0.1:{PORT}/{slug}", wait_until="networkidle")
                ax.wait_for_timeout(200)
                issues = ax.evaluate("""() => {
                    const out = [];
                    const h1 = document.querySelectorAll('h1').length;
                    if (h1 !== 1) out.push('h1 count ' + h1);
                    document.querySelectorAll('img').forEach(i => { if (!i.hasAttribute('alt')) out.push('img without alt'); });
                    document.querySelectorAll('button').forEach(b => {
                        const n = (b.getAttribute('aria-label') || b.textContent || '').trim();
                        if (!n) out.push('button without accessible name');
                    });
                    document.querySelectorAll('[tabindex]').forEach(e => { if (parseInt(e.getAttribute('tabindex'), 10) > 0) out.push('positive tabindex'); });
                    return out;
                }""")
                if issues:
                    failures.append(f"a11y {slug}: {sorted(set(issues))[:4]}")

            b.close()
    finally:
        httpd.shutdown()

    if failures:
        print("FAIL")
        for f in failures:
            print(" -", f)
        sys.exit(1)
    print(f"PASS — {len(PAGES)} pages x2 viewports, no overflow, no console errors")


if __name__ == "__main__":
    main()
