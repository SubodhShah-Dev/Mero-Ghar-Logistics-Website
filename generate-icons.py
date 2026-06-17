"""Generate MeroGhar app icon — moving truck + Nepal mountains motif."""
from PIL import Image, ImageDraw
import os, math

# Brand colors
FOREST = (17, 32, 24)
FOREST_LIGHT = (42, 90, 60)
SAFFRON = (245, 166, 35)
SAFFRON_PALE = (255, 200, 80)
WHITE = (255, 255, 255)
CREAM = (253, 250, 244)

# Density sizes (foreground images for adaptive icons)
SIZES = {
    'mdpi': 108,
    'hdpi': 162,
    'xhdpi': 216,
    'xxhdpi': 324,
    'xxxhdpi': 432,
}

def draw_truck_icon(size, pad_ratio=0.18):
    """Draw a moving truck + Nepal mountain icon on transparent bg."""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Scale: safe zone = 72% of size (adaptive icon safe zone)
    sz = size
    pad = int(sz * pad_ratio)
    cx, cy = sz // 2, sz // 2
    
    # === Mountain (Himalayas) in background ===
    mt_color = (*[min(c + 30, 255) for c in FOREST], 60)  # Very subtle
    mtn_pts = []
    peaks = [
        (pad, sz - pad),         # bottom-left
        (sz * 0.3, sz * 0.35),   # peak 1 (small)
        (cx, sz * 0.22),         # peak 2 (tallest - Everest)
        (sz * 0.68, sz * 0.32),  # peak 3
        (sz - pad, sz - pad),    # bottom-right
    ]
    draw.polygon(peaks, fill=mt_color, outline=None)
    
    # Snow caps on peaks (small white triangles)
    for px, py in peaks[1:-1]:
        snow_h = int(sz * 0.04)
        draw.polygon([
            (px, py),
            (px - int(sz * 0.04), py + snow_h),
            (px + int(sz * 0.04), py + snow_h),
        ], fill=(*WHITE, 40))
    
    # === Moving Truck ===
    truck_h = int(sz * 0.30)
    truck_w = int(sz * 0.55)
    truck_x = cx - truck_w // 2 + int(sz * 0.02)
    truck_y = (sz - pad) - truck_h - int(sz * 0.02)
    
    # Truck body (cargo box)
    box_w = int(truck_w * 0.60)
    box_h = int(truck_h * 0.75)
    box_x = truck_x + int(truck_w * 0.02)
    box_y = truck_y + int(truck_h * 0.02)
    
    # Draw box
    draw.rounded_rectangle(
        [box_x, box_y, box_x + box_w, box_y + box_h],
        radius=int(sz * 0.015),
        fill=SAFFRON,
    )
    
    # Box stripes (roof ribs)
    for i in range(3):
        sx = box_x + int(box_w * 0.15) + i * int(box_w * 0.25)
        draw.rectangle(
            [sx, box_y + int(box_h * 0.08), sx + int(sz * 0.012), box_y + int(box_h * 0.92)],
            fill=(*FOREST, 180),
        )
    
    # Nepal flag on box side
    flag_h = int(box_h * 0.5)
    flag_w = int(flag_h * 0.55)
    flag_x = box_x + int(box_w * 0.2)
    flag_y = box_y + int(box_h * 0.25)
    
    # Flag: crimson red triangle shape
    draw.polygon([
        (flag_x, flag_y),
        (flag_x + flag_w, flag_y + flag_h // 2),
        (flag_x, flag_y + flag_h),
    ], fill=(220, 20, 60, 220))
    # Flag: blue border
    draw.polygon([
        (flag_x, flag_y),
        (flag_x + flag_w, flag_y + flag_h // 2),
        (flag_x, flag_y + flag_h),
    ], outline=(0, 56, 147, 220), width=max(1, int(sz * 0.008)))
    
    # "M G" text on box (simplified as small dots)
    dot_r = max(2, int(sz * 0.012))
    draw.ellipse([box_x + int(box_w * 0.6) - dot_r, box_y + int(box_h * 0.3) - dot_r,
                  box_x + int(box_w * 0.6) + dot_r, box_y + int(box_h * 0.3) + dot_r], fill=FOREST)
    draw.ellipse([box_x + int(box_w * 0.72) - dot_r, box_y + int(box_h * 0.3) - dot_r,
                  box_x + int(box_w * 0.72) + dot_r, box_y + int(box_h * 0.3) + dot_r], fill=FOREST)
    draw.ellipse([box_x + int(box_w * 0.6) - dot_r, box_y + int(box_h * 0.55) - dot_r,
                  box_x + int(box_w * 0.6) + dot_r, box_y + int(box_h * 0.55) + dot_r], fill=FOREST)
    draw.ellipse([box_x + int(box_w * 0.72) - dot_r, box_y + int(box_h * 0.55) - dot_r,
                  box_x + int(box_w * 0.72) + dot_r, box_y + int(box_h * 0.55) + dot_r], fill=FOREST)
    
    # Truck cab
    cab_w = int(truck_w * 0.32)
    cab_h = int(truck_h * 0.55)
    cab_x = box_x + box_w + int(truck_w * 0.02)
    cab_y = truck_y + int(truck_h * 0.02) + int(box_h * 0.15)
    
    draw.rounded_rectangle(
        [cab_x, cab_y, cab_x + cab_w, cab_y + cab_h],
        radius=int(sz * 0.02),
        fill=SAFFRON_PALE,
    )
    
    # Cab window
    win_pad = int(sz * 0.02)
    draw.rounded_rectangle(
        [cab_x + win_pad, cab_y + win_pad, cab_x + cab_w - win_pad, cab_y + int(cab_h * 0.45)],
        radius=int(sz * 0.01),
        fill=(*FOREST, 200),
    )
    
    # Chassis (bottom line connecting cab and box)
    chassis_y = box_y + box_h - int(sz * 0.01)
    draw.rectangle(
        [truck_x, chassis_y, cab_x + cab_w, chassis_y + int(sz * 0.012)],
        fill=SAFFRON,
    )
    
    # Wheels
    wheel_r = int(sz * 0.035)
    wheel_y = chassis_y + int(sz * 0.025)
    
    for wx in [box_x + int(box_w * 0.2), box_x + int(box_w * 0.8), cab_x + int(cab_w * 0.5)]:
        draw.ellipse(
            [wx - wheel_r, wheel_y - wheel_r, wx + wheel_r, wheel_y + wheel_r],
            fill=FOREST_LIGHT,
        )
        draw.ellipse(
            [wx - int(wheel_r * 0.55), wheel_y - int(wheel_r * 0.55),
             wx + int(wheel_r * 0.55), wheel_y + int(wheel_r * 0.55)],
            fill=SAFFRON_PALE,
        )
        # Hub dot
        hr = max(1, int(wheel_r * 0.2))
        draw.ellipse(
            [wx - hr, wheel_y - hr, wx + hr, wheel_y + hr],
            fill=FOREST,
        )
    
    # Road line beneath
    road_y = wheel_y + wheel_r + int(sz * 0.015)
    for i in range(4):
        rx = int(sz * 0.12) + i * int(sz * 0.2)
        draw.rectangle(
            [rx, road_y, rx + int(sz * 0.08), road_y + max(2, int(sz * 0.01))],
            fill=(*WHITE, 80),
        )
    
    # Small "moving" arrow above truck
    arrow_y = box_y - int(sz * 0.04)
    arrow_size = int(sz * 0.025)
    draw.polygon([
        (cx - arrow_size, arrow_y),
        (cx, arrow_y - arrow_size - int(sz * 0.01)),
        (cx + arrow_size, arrow_y),
    ], fill=(*SAFFRON, 180))
    
    return img

def generate_combined_icon(foreground, bg_color, size):
    """Combine foreground with background for fallback icons."""
    bg = Image.new('RGBA', (size, size), bg_color)
    bg.paste(foreground, (0, 0), foreground)
    return bg.convert('RGB')

base_dir = '/home/subodh/workspace/Mero-Ghar-Logistics-Website/android/app/src/main/res'

# Update background color XML
bg_color_xml = '''<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#112018</color>
</resources>
'''
with open(f'{base_dir}/values/ic_launcher_background.xml', 'w') as f:
    f.write(bg_color_xml)
print("Updated background color to FOREST (#112018)")

# Update background drawable to solid color vector
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
print("Updated background drawable to solid forest green")

# Generate foreground images for each density
for density, size in SIZES.items():
    img = draw_truck_icon(size)
    
    # Save foreground
    fg_path = f'{base_dir}/mipmap-{density}/ic_launcher_foreground.png'
    img.save(fg_path, 'PNG')
    print(f"Generated {fg_path} ({size}x{size})")
    
    # Generate combined fallback icon (with background)
    combined = generate_combined_icon(img, FOREST, size)
    
    launcher_path = f'{base_dir}/mipmap-{density}/ic_launcher.png'
    combined.save(launcher_path, 'PNG')
    
    launcher_round_path = f'{base_dir}/mipmap-{density}/ic_launcher_round.png'
    combined.save(launcher_round_path, 'PNG')
    
    print(f"Generated {launcher_path}")

print("\nAll icons generated successfully!")
