from playwright.sync_api import sync_playwright, expect

def verify_trips_feature(page):
    # Verify the "Trips" section on the home page
    page.goto("http://localhost:8000")
    trips_section = page.locator("#trips")
    expect(trips_section).to_be_visible()

    # Take a screenshot of the home page
    page.screenshot(path="trips_section_on_home.png")

    # Verify the "Great Ocean Road" trip page
    great_ocean_road_card = page.locator('a[href="trips/great-ocean-road.html"]')
    great_ocean_road_card.click()

    page.wait_for_url("http://localhost:8000/trips/great-ocean-road.html")

    trip_title = page.locator("#trip-title")
    expect(trip_title).to_have_text("Great Ocean Road")

    gallery_container = page.locator("#trip-gallery-container")
    expect(gallery_container).to_be_visible()

    # Take a screenshot of the trip page
    page.screenshot(path="great_ocean_road_trip_page.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        verify_trips_feature(page)
        browser.close()
