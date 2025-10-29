
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:8000")

    # Wait for the gallery to be populated
    page.wait_for_selector('.gallery-item', state='visible')

    # Click the "Landscapes" filter button
    page.click(".filter-btn[data-filter='landscapes']")

    # Wait for the animation to complete (a little longer than the timeout in the script)
    page.wait_for_timeout(500)

    # Take a screenshot of the filtered gallery
    gallery = page.query_selector('#gallery')
    if gallery:
        gallery.screenshot(path="jules-scratch/verification/verification.png")
    else:
        print("Gallery not found.")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
