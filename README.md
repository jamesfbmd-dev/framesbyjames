# framesbyjames
Photography Portfolio

## Development

This project uses SASS for styling. To work with the project, you'll need to have Node.js and npm installed.

### Prerequisites

- [Node.js](https://nodejs.org/)

### Getting Started

1. **Install Dependencies:**

   Open your terminal and navigate to the project root directory. Then, run the following command to install the required packages (Node version 8.11.2 works):

   ```bash
   npm install
   ```

2. **Compile SASS:**

   This project uses Gulp to compile SASS into CSS. To compile the `scss` files, run the following command in your terminal:

   ```bash
   npx gulp
   ```

   This will compile the `scss/styles.scss` file and output the CSS to `css/styles.css`.


## Gallery JSON File Example

{
   "id": 2, - Self Explanatory
   "src": "images/photos/photo-2.jpg", - File path
   "hiRes": {
      "useHiRes": true, - Use a hires version of the image in the lightbox
      "hiResSrc": "images/photos/hires/photo-2.jpg" - File path for hi res image
   },
   "category": ["landscapes", "street"], - Which category(s) this will show under on the gallery
   "alt": "Christchurch Hills", - Alt text
   "ratio": "4x3" - Dictates how image will appear on masonry (3x4 or 4x3)
}

Categories available:
 - landscapes
 - street
 - human nature
 - architecture
