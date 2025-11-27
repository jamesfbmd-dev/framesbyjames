
import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    # Ensure the screenshot directory exists
    os.makedirs("jules-scratch/verification/screenshots", exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Start a local server to serve the files
        # This assumes a server is running on port 8000
        await page.goto("http://localhost:8000/trips/great-ocean-road.html")

        # 1. Take screenshot of the first image
        await page.screenshot(path="jules-scratch/verification/screenshots/great-ocean-road-1.png")

        # 2. Scroll to the second image
        gallery_selector = ".gallery-container"
        await page.evaluate(f"""
            document.querySelector('{gallery_selector}').scrollBy({{ left: window.innerWidth, behavior: 'smooth' }})
        """)
        # Wait for scroll to complete
        await page.wait_for_timeout(1000)
        await page.screenshot(path="jules-scratch/verification/screenshots/great-ocean-road-2.png")

        # 3. Scroll to the third image
        await page.evaluate(f"""
            document.querySelector('{gallery_selector}').scrollBy({{ left: window.innerWidth, behavior: 'smooth' }})
        """)
        # Wait for scroll to complete
        await page.wait_for_timeout(1000)
        await page.screenshot(path="jules-scratch/verification/screenshots/great-ocean-road-3.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
