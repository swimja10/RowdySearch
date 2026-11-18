"""Draws public/preview.png, the picture shown when a link to the site is sent in GroupMe, Discord,
iMessage, and so on. It's 1200 by 630, the size those apps expect. Run it again only when the
picture should change:

  .venv/bin/python site/scripts/make_preview_image.py

It loads the Inter font from Google Fonts while drawing. Without a connection the text is drawn in
the computer's own font.
"""
import base64
import pathlib

from playwright.sync_api import sync_playwright

SITE = pathlib.Path(__file__).resolve().parent.parent
LOGO = base64.b64encode((SITE / "public/icons/icon-128.png").read_bytes()).decode()

PICTURE = f"""
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;800&display=swap">
<style>
  * {{ box-sizing: border-box; margin: 0; }}
  body {{ width: 1200px; height: 630px; background: #18181b; color: #f4f4f5; font-family: Inter, system-ui, sans-serif;
         padding: 64px 72px; display: flex; flex-direction: column; }}
  .name {{ display: flex; align-items: center; gap: 22px; font-size: 46px; font-weight: 800; }}
  .name img {{ width: 84px; height: 84px; border-radius: 18px; }}
  h1 {{ margin-top: 52px; font-size: 84px; line-height: 1.05; font-weight: 800; letter-spacing: -2px; }}
  h1 span {{ color: #fb923c; }}
  p {{ margin-top: 28px; font-size: 33px; line-height: 1.3; font-weight: 500; color: #d4d4d8; }}
  .foot {{ margin-top: auto; display: flex; justify-content: space-between; align-items: center; font-size: 32px; font-weight: 600; }}
  .address {{ color: #fb923c; }}
  .free {{ color: #a1a1aa; }}
</style>
<body>
  <div class="name"><img src="data:image/png;base64,{LOGO}">RowdySearch</div>
  <h1>Pick the right <span>UTSA</span> professor</h1>
  <p>Grade data, Bluebook, Rate My Professors, and syllabi, in one search.</p>
  <div class="foot"><span class="address">rowdysearch.com</span><span class="free">Free. No account.</span></div>
</body>
"""

with sync_playwright() as playwright:
    browser = playwright.chromium.launch()
    page = browser.new_page(viewport={"width": 1200, "height": 630})
    page.set_content(PICTURE, wait_until="networkidle")
    page.evaluate("document.fonts.ready")
    page.screenshot(path=str(SITE / "public/preview.png"))
    print("font:", page.evaluate("document.fonts.check('800 84px Inter') ? 'Inter' : 'the computer\\'s own'"))
    browser.close()
print("wrote", SITE / "public/preview.png")
