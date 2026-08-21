import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const logoSrc = "/Users/suyashsunilnarade/.gemini/antigravity/brain/2f3e5290-d644-47a4-a78f-23ae6d829321/.user_uploaded/media_1787310189829.png";
const iconSrc = "/Users/suyashsunilnarade/.gemini/antigravity/brain/2f3e5290-d644-47a4-a78f-23ae6d829321/.user_uploaded/media_1787310191816.jpg";

async function processAssets() {
  console.log("Processing logo image...");
  
  // 1. Load logo, trim outer whitespace, make near-white background transparent
  const logoBuffer = await sharp(logoSrc)
    .trim({ threshold: 10 }) // trim outer white space
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = logoBuffer;

  // Loop through pixels and make white/near-white transparent
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r > 240 && g > 240 && b > 240) {
      data[i + 3] = 0; // alpha = 0 (transparent)
    }
  }

  const cleanLogo = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  })
  .trim() // trim again after making background transparent
  .png()
  .toBuffer();

  fs.writeFileSync("public/v_brothers_logo_clean.png", cleanLogo);
  fs.writeFileSync("src/assets/v_brothers_logo_clean.png", cleanLogo);
  console.log("v_brothers_logo_clean.png created successfully!");

  // 2. Create circular mask for favicon & icon emblem
  const iconMeta = await sharp(iconSrc).metadata();
  const width = iconMeta.width || 500;
  const height = iconMeta.height || 500;
  const size = Math.min(width, height);
  const radius = size / 2 - 2;

  // Create SVG circle mask
  const circleMask = Buffer.from(
    `<svg width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="#fff" />
    </svg>`
  );

  const circularIcon = await sharp(iconSrc)
    .resize(size, size, { fit: 'cover' })
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  fs.writeFileSync("public/v_brothers_icon_circle.png", circularIcon);
  fs.writeFileSync("src/assets/v_brothers_icon_circle.png", circularIcon);

  // Resize for favicons
  const favicon128 = await sharp(circularIcon).resize(128, 128).png().toBuffer();
  fs.writeFileSync("public/favicon.png", favicon128);

  const favicon64 = await sharp(circularIcon).resize(64, 64).png().toBuffer();
  fs.writeFileSync("public/favicon.ico", favicon64);

  console.log("Circular favicon and icon assets generated successfully!");
}

processAssets().catch(err => console.error(err));
