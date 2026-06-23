"""Generate MeroGhar app icon — bold saffron M on forest green."""
from PIL import Image, ImageDraw
import os

FOREST = (17, 32, 24)
SAFFRON = (245, 166, 35)

SIZES = {
    'mdpi': 108,
    'hdpi': 162,
    'xhdpi': 216,
    'xxhdpi': 324,
    'xxxhdpi': 432,
}

def draw_icon(size):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    sz = size
    cx = sz // 2

    # A bold, rounded "M" — the two outer strokes angle inward, the inner
    # V dips to ~55% of the height so the letter feels balanced.
    m_w = int(sz * 0.54)
    m_h = int(sz * 0.60)
    mx = cx - m_w // 2
    my = int(sz * 0.18)

    stroke_w = int(sz * 0.09)

    # Points (left → peak → valley → peak → right)
    pts = [
        (mx, my + m_h),                    # bottom-left
        (mx, my),                           # top-left
        (cx, my + int(m_h * 0.55)),        # inner V
        (mx + m_w, my),                     # top-right
        (mx + m_w, my + m_h),              # bottom-right
    ]

    # Draw the M as one thick polyline using multiple overlapping
    # line segments so the corners stay crisp.
    for i in range(len(pts) - 1):
        x1, y1 = pts[i]
        x2, y2 = pts[i + 1]
        draw.line([(x1, y1), (x2, y2)], fill=SAFFRON, width=stroke_w)

    # Rounded caps on the two bottom feet
    r = stroke_w // 2
    draw.ellipse([mx - r, my + m_h - r, mx + r, my + m_h + r], fill=SAFFRON)
    draw.ellipse([mx + m_w - r, my + m_h - r, mx + m_w + r, my + m_h + r], fill=SAFFRON)

    return img


def generate_combined_icon(foreground, bg_color, size):
    bg = Image.new('RGBA', (size, size), bg_color)
    bg.paste(foreground, (0, 0), foreground)
    return bg.convert('RGB')


base_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'android', 'app', 'src', 'main', 'res')

# Background color XML
bg_color_xml = '''<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#112018</color>
</resources>
'''
with open(f'{base_dir}/values/ic_launcher_background.xml', 'w') as f:
    f.write(bg_color_xml)
print("Updated background color to FOREST (#112018)")

# Background drawable
bg_drawable = '''<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#112018"
        android:pathData="M0,0h108v108h-108z" />
</vector>
'''
with open(f'{base_dir}/drawable/ic_launcher_background.xml', 'w') as f:
    f.write(bg_drawable)
print("Updated background drawable")

for density, size in SIZES.items():
    img = draw_icon(size)

    fg_path = f'{base_dir}/mipmap-{density}/ic_launcher_foreground.png'
    img.save(fg_path, 'PNG')
    print(f"Generated {fg_path} ({size}x{size})")

    combined = generate_combined_icon(img, FOREST, size)

    launcher_path = f'{base_dir}/mipmap-{density}/ic_launcher.png'
    combined.save(launcher_path, 'PNG')

    launcher_round_path = f'{base_dir}/mipmap-{density}/ic_launcher_round.png'
    combined.save(launcher_round_path, 'PNG')
    print(f"Generated {launcher_path}")

print("\nDone!")
