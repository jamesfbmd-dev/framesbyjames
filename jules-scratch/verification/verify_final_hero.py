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

        # Verify Hero Section
        hero_element = page.locator('#hero')
        await hero_element.wait_for(state='visible')
        await page.screenshot(path='jules-scratch/verification/final_hero_verification.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())