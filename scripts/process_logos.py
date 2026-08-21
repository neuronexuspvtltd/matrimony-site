import os
from PIL import Image, ImageDraw

# Input paths
LOGO_SRC = "/Users/suyashsunilnarade/.gemini/antigravity/brain/2f3e5290-d644-47a4-a78f-23ae6d829321/.user_uploaded/media_1787310189829.png"
ICON_SRC = "/Users/suyashsunilnarade/.gemini/antigravity/brain/2f3e5290-d644-47a4-a78f-23ae6d829321/.user_uploaded/media_1787310191816.jpg"

# 1. Process Logo: Make white background transparent and crop bounding box
logo_img = Image.open(LOGO_SRC).convert("RGBA")
datas = logo_img.getdata()

new_data = []
for item in datas:
  # If pixel is near white, make it transparent
  if item[0] > 240 and item[1] > 240 and item[2] > 240:
    new_data.append((255, 255, 255, 0))
  else:
    new_data.append(item)

logo_img.putdata(new_data)

# Crop bounding box of non-transparent content
bbox = logo_img.getbbox()
if bbox:
  logo_cropped = logo_img.crop(bbox)
else:
  logo_cropped = logo_img

# Add small 4px padding so edges look crisp
padding = 4
w, h = logo_cropped.size
logo_final = Image.new("RGBA", (w + padding * 2, h + padding * 2), (0, 0, 0, 0))
logo_final.paste(logo_cropped, (padding, padding))

logo_final.save("public/v_brothers_logo_clean.png", "PNG")
logo_final.save("src/assets/v_brothers_logo_clean.png", "PNG")
print(f"Clean logo saved with size {logo_final.size}")

# 2. Process Icon: Create circular masked transparent PNG favicon
icon_img = Image.open(ICON_SRC).convert("RGBA")
width, height = icon_img.size

# Bounding box crop for icon to center circle
bbox_icon = icon_img.getbbox()
if bbox_icon:
  icon_img = icon_img.crop(bbox_icon)
  width, height = icon_img.size

# Make near-white background transparent outside circle
mask = Image.new("L", (width, height), 0)
draw = ImageDraw.Draw(mask)
# Draw circular mask matching the gold border ring
draw.ellipse((2, 2, width - 2, height - 2), fill=255)

icon_circle = Image.new("RGBA", (width, height), (0, 0, 0, 0))
icon_circle.paste(icon_img, (0, 0), mask=mask)

icon_circle.save("public/v_brothers_icon_circle.png", "PNG")
icon_circle.save("src/assets/v_brothers_icon_circle.png", "PNG")

# Also save resized 64x64 favicon.png & favicon.ico
icon_favicon = icon_circle.resize((64, 64), Image.Resampling.LANCZOS)
icon_favicon.save("public/favicon.png", "PNG")
icon_favicon.save("public/favicon.ico", "ICO")

print("Circular icon and favicons generated successfully!")
