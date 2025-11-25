import asyncio
import os
from playwright.async_api import async_playwright

async def main():
    # Ensure the scratch directory exists
    os.makedirs("jules-scratch", exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Listen for console events and print them
        page.on("console", lambda msg: print(f"Console log: {msg.text}"))

        await page.goto("http://localhost:8000")

        # Scroll down the page to trigger parallax
        await page.evaluate("window.scrollBy(0, 300)")
        await asyncio.sleep(1) # Wait for parallax to apply

        await page.screenshot(path="jules-scratch/homepage.png")

        await page.goto("http://localhost:8000/trips/great-ocean-road.html")
        await page.screenshot(path="jules-scratch/trip-page.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
