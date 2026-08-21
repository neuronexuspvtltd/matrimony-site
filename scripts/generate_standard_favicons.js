import sharp from 'sharp';
import fs from 'fs';

const newFaviconSrc = "/Users/suyashsunilnarade/.gemini/antigravity/brain/2f3e5290-d644-47a4-a78f-23ae6d829321/.user_uploaded/media_1787311015224.png";

async function generateFavicons() {
  console.log("Generating standard cross-browser favicons...");

  // Load emblem and trim whitespace
  const trimmedEmblem = await sharp(newFaviconSrc)
    .trim({ threshold: 10 })
    .ensureAlpha()
    .png()
    .toBuffer();

  // Make near-white background transparent
  const rawBuffer = await sharp(trimmedEmblem).raw().toBuffer({ resolveWithObject: true });
  const { data, info } = rawBuffer;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r > 240 && g > 240 && b > 240) {
      data[i + 3] = 0;
    }
  }

  const cleanPng = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  })
  .trim()
  .png()
  .toBuffer();

  // 1. Save main PNG assets
  fs.writeFileSync("public/v_brothers_icon.png", cleanPng);
  fs.writeFileSync("src/assets/v_brothers_icon.png", cleanPng);

  // 2. Generate standard 32x32 PNG favicon
  const fav32 = await sharp(cleanPng)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync("public/favicon-32x32.png", fav32);
  fs.writeFileSync("public/favicon.png", fav32);

  // 3. Generate 16x16 PNG favicon
  const fav16 = await sharp(cleanPng)
    .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync("public/favicon-16x16.png", fav16);

  // 4. Generate 180x180 Apple Touch Icon
  const fav180 = await sharp(cleanPng)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync("public/apple-touch-icon.png", fav180);

  // 5. Generate 48x48 ICO file compatible format
  const fav48 = await sharp(cleanPng)
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync("public/favicon.ico", fav48);

  // 6. Embedded base64 SVG favicon for instant 100% vector loading in modern Chrome
  const base64Data = cleanPng.toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <image href="data:image/png;base64,${base64Data}" x="0" y="0" width="128" height="128" preserveAspectRatio="xMidYMid meet" />
</svg>`;

  fs.writeFileSync("public/favicon.svg", svgContent);

  console.log("All favicons generated successfully!");
}

generateFavicons().catch(err => console.error(err));
