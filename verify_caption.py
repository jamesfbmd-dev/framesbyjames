
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto('http://localhost:8000')
        # Click the first image in the gallery
        await page.click('.aspect-ratio-content')
        # Wait for the lightbox to be visible
        await page.wait_for_selector('#lightbox.visible')
        await page.screenshot(path='verification.png')
        await browser.close()

asyncio.run(main())
