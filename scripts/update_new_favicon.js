import sharp from 'sharp';
import fs from 'fs';

const newFaviconSrc = "/Users/suyashsunilnarade/.gemini/antigravity/brain/2f3e5290-d644-47a4-a78f-23ae6d829321/.user_uploaded/media_1787311015224.png";

async function processNewFavicon() {
  console.log("Processing new standalone V emblem favicon...");
  
  // 1. Trim outer padding & make near-white background transparent
  const rawBuffer = await sharp(newFaviconSrc)
    .trim({ threshold: 10 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = rawBuffer;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // If pixel is near pure white background
    if (r > 245 && g > 245 && b > 245) {
      data[i + 3] = 0; // transparent
    }
  }

  const cleanVEmblem = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  })
  .trim()
  .png()
  .toBuffer();

  // Save clean emblem PNGs
  fs.writeFileSync("public/v_brothers_icon.png", cleanVEmblem);
  fs.writeFileSync("src/assets/v_brothers_icon.png", cleanVEmblem);

  // Favicon PNG (128x128)
  const fav128 = await sharp(cleanVEmblem)
    .resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync("public/favicon.png", fav128);

  // Favicon ICO (64x64)
  const fav64 = await sharp(cleanVEmblem)
    .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync("public/favicon.ico", fav64);

  // Circular / Transparent background SVG wrapper
  const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <image href="/v_brothers_icon.png" x="2" y="2" width="96" height="96" preserveAspectRatio="xMidYMid meet" />
</svg>`;
  fs.writeFileSync("public/favicon.svg", svgFavicon);

  console.log("New V emblem favicons generated successfully!");
}

processNewFavicon().catch(err => console.error(err));
