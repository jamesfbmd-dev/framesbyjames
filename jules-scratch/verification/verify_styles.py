import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Get the absolute path to the index.html file
        file_path = os.path.abspath('index.html')

        # Go to the local HTML file
        await page.goto(f'file://{file_path}')

        # 1. Verify Hero Section (already verified, but keeping it for completeness)
        hero_element = page.locator('#hero')
        await hero_element.wait_for(state='visible')
        await page.screenshot(path='jules-scratch/verification/hero_verification.png')

        # 2. Verify Lightbox
        # Find the first gallery item and click it
        first_gallery_item = page.locator('.gallery-item .aspect-ratio-content').first
        await first_gallery_item.click()

        # Wait for the lightbox to be visible
        lightbox_element = page.locator('#lightbox')
        await lightbox_element.wait_for(state='visible')

        # Add a short delay to allow for the CSS opacity transition to complete
        await page.wait_for_timeout(500)

        # Take a screenshot of ONLY the lightbox element
        await lightbox_element.screenshot(path='jules-scratch/verification/lightbox_verification.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())