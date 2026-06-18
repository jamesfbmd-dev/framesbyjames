export async function fetchImageData() {
    try {
        const response = await fetch('data/images.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Could not fetch image data:", error);
        return [];
    }
}
