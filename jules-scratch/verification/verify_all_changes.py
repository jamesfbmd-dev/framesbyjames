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

        # 1. Verify Hero Section Styles
        hero_element = page.locator('#hero')
        await hero_element.wait_for(state='visible')
        await page.screenshot(path='jules-scratch/verification/hero_style_verification.png')

        # 2. Verify Filtered Gallery Layout
        # Click the "Portraits" filter button
        await page.get_by_role("button", name="Portraits").click()
        # Wait for the gallery to update (give it a moment for JS to run)
        await page.wait_for_timeout(500)
        await page.screenshot(path='jules-scratch/verification/gallery_filter_verification.png')

        # 3. Verify Lightbox SVGs
        # Click the first gallery item to open the lightbox
        first_gallery_item = page.locator('.gallery-item .aspect-ratio-content').first
        await first_gallery_item.click()

        # Wait for the lightbox to be visible
        lightbox_element = page.locator('#lightbox')
        await lightbox_element.wait_for(state='visible')
        await page.wait_for_timeout(500) # Allow for fade-in

        # Take a screenshot of the lightbox
        await lightbox_element.screenshot(path='jules-scratch/verification/lightbox_svg_verification.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())