"""Generate MeroGhar app icon — bold modern truck + Nepal mountains motif."""
from PIL import Image, ImageDraw
import os, math

# Brand colors
FOREST = (17, 32, 24)
FOREST_LIGHT = (50, 95, 65)
FOREST_MID = (35, 70, 48)
SAFFRON = (245, 166, 35)
SAFFRON_PALE = (255, 200, 80)
SAFFRON_DIM = (200, 135, 28)
WHITE = (255, 255, 255)
CREAM = (253, 250, 244)
CRIMSON = (196, 30, 58)
NAVY = (0, 56, 147)

SIZES = {
    'mdpi': 108,
    'hdpi': 162,
    'xhdpi': 216,
    'xxhdpi': 324,
    'xxxhdpi': 432,
}

def draw_truck_icon(size, pad_ratio=0.16):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    sz = size
    pad = int(sz * pad_ratio)
    cx = sz // 2

    # ── Mountains (Himalayas) ──
    # Three peaks in the upper portion, semi-transparent lighter green
    mt_color = (*FOREST_LIGHT, 160)
    mt_color2 = (*FOREST_MID, 120)

    mtn_bottom = int(sz * 0.52)
    peaks = [
        (pad, mtn_bottom),
        (int(sz * 0.30), int(sz * 0.30)),
        (cx, int(sz * 0.16)),
        (int(sz * 0.72), int(sz * 0.28)),
        (sz - pad, mtn_bottom),
    ]
    draw.polygon(peaks, fill=mt_color, outline=None)

    # Secondary mountain layer (slightly darker, offset)
    peaks2 = [
        (int(sz * 0.12), mtn_bottom),
        (int(sz * 0.48), int(sz * 0.36)),
        (int(sz * 0.60), int(sz * 0.32)),
        (int(sz * 0.88), int(sz * 0.38)),
        (sz - int(sz * 0.08), mtn_bottom),
    ]
    draw.polygon(peaks2, fill=mt_color2, outline=None)

    # Snow caps on main peaks (small white triangles)
    for px, py in [peaks[1], peaks[2], peaks[3]]:
        sw = int(sz * 0.045)
        sh = int(sz * 0.05)
        draw.polygon([
            (px, py),
            (px - sw, py + sh),
            (px + sw, py + sh),
        ], fill=(*WHITE, 140))

    # ── Truck ──
    truck_w = int(sz * 0.58)
    truck_h = int(sz * 0.32)
    truck_x = cx - truck_w // 2
    truck_y = int(sz * 0.52)

    # Box (cargo area)
    box_w = int(truck_w * 0.62)
    box_h = truck_h
    box_x = truck_x
    box_y = truck_y

    draw.rounded_rectangle(
        [box_x, box_y, box_x + box_w, box_y + box_h],
        radius=int(sz * 0.02),
        fill=SAFFRON,
    )

    # Box vertical accent lines (3 ribs)
    rib_color = (*FOREST, 160)
    for i in range(3):
        rx = box_x + int(box_w * 0.15) + i * int(box_w * 0.28)
        rw = max(2, int(sz * 0.01))
        draw.rectangle(
            [rx, box_y + int(box_h * 0.10), rx + rw, box_y + int(box_h * 0.90)],
            fill=rib_color,
        )

    # Nepal flag badge on box
    badge_size = int(box_h * 0.50)
    badge_x = box_x + int(box_w * 0.08)
    badge_y = box_y + int(box_h * 0.25)

    # Flag triangle with blue border
    draw.polygon([
        (badge_x, badge_y),
        (badge_x + badge_size, badge_y + badge_size // 2),
        (badge_x, badge_y + badge_size),
    ], fill=CRIMSON)
    draw.polygon([
        (badge_x, badge_y),
        (badge_x + badge_size, badge_y + badge_size // 2),
        (badge_x, badge_y + badge_size),
    ], outline=NAVY, width=max(2, int(sz * 0.008)))

    # Home icon on box (represents "Ghar" = Home)
    home_w = int(box_h * 0.45)
    home_x = box_x + int(box_w * 0.58)
    home_y = box_y + int(box_h * 0.25)
    home_h = int(box_h * 0.50)

    hw = home_w
    hh = home_h
    hx = home_x
    hy = home_y

    # Roof (triangle)
    draw.polygon([
        (hx, hy + int(hh * 0.45)),
        (hx + hw // 2, hy),
        (hx + hw, hy + int(hh * 0.45)),
    ], fill=FOREST)

    # Walls (rectangle below roof)
    wall_top = hy + int(hh * 0.45)
    draw.rectangle(
        [hx, wall_top, hx + hw, hy + hh],
        fill=FOREST,
    )

    # Door
    door_w = max(2, int(hw * 0.20))
    door_h = int(hh * 0.30)
    door_x = hx + hw // 2 - door_w // 2
    door_y = hy + hh - door_h
    draw.rectangle(
        [door_x, door_y, door_x + door_w, door_y + door_h],
        fill=SAFFRON_PALE,
    )

    # Cab
    cab_w = int(truck_w * 0.30)
    cab_h = int(truck_h * 0.62)
    cab_x = box_x + box_w + int(truck_w * 0.02)
    cab_y = truck_y + int(truck_h * 0.08)

    draw.rounded_rectangle(
        [cab_x, cab_y, cab_x + cab_w, cab_y + cab_h],
        radius=int(sz * 0.025),
        fill=SAFFRON_PALE,
    )

    # Cab window
    win_margin = int(sz * 0.02)
    draw.rounded_rectangle(
        [cab_x + win_margin, cab_y + win_margin,
         cab_x + cab_w - win_margin, cab_y + int(cab_h * 0.42)],
        radius=int(sz * 0.015),
        fill=(*FOREST, 210),
    )

    # Side mirror (small rectangle on cab front)
    mirror_w = max(2, int(sz * 0.008))
    mirror_h = int(cab_h * 0.25)
    draw.rectangle(
        [cab_x + cab_w - 1, cab_y + int(cab_h * 0.08),
         cab_x + cab_w + mirror_w, cab_y + int(cab_h * 0.08) + mirror_h],
        fill=SAFFRON_DIM,
    )

    # Chassis (connecting bar)
    chassis_y = box_y + box_h - int(sz * 0.008)
    draw.rectangle(
        [truck_x, chassis_y, cab_x + cab_w, chassis_y + max(2, int(sz * 0.012))],
        fill=SAFFRON,
    )

    # Wheels (2 wheels, larger and cleaner)
    wheel_r = int(sz * 0.04)
    wheel_y = chassis_y + int(sz * 0.025)
    wheel_positions = [
        box_x + int(box_w * 0.25),
        cab_x + int(cab_w * 0.5),
    ]

    for wx in wheel_positions:
        # Tire (outer)
        draw.ellipse(
            [wx - wheel_r, wheel_y - wheel_r, wx + wheel_r, wheel_y + wheel_r],
            fill=FOREST_LIGHT,
        )
        # Hub
        hr = int(wheel_r * 0.55)
        draw.ellipse(
            [wx - hr, wheel_y - hr, wx + hr, wheel_y + hr],
            fill=SAFFRON_PALE,
        )
        # Hub dots (5 spokes)
        dot_r = max(1, int(wheel_r * 0.12))
        for angle in range(0, 360, 72):
            rad = math.radians(angle)
            dx = int(hr * 0.6 * math.cos(rad))
            dy = int(hr * 0.6 * math.sin(rad))
            draw.ellipse(
                [wx + dx - dot_r, wheel_y + dy - dot_r,
                 wx + dx + dot_r, wheel_y + dy + dot_r],
                fill=FOREST,
            )
        # Center dot
        cd = max(1, int(wheel_r * 0.15))
        draw.ellipse(
            [wx - cd, wheel_y - cd, wx + cd, wheel_y + cd],
            fill=FOREST,
        )

    # Road dashes
    road_y = wheel_y + wheel_r + int(sz * 0.02)
    dash_count = 3
    dash_w = int(sz * 0.08)
    dash_h = max(2, int(sz * 0.01))
    total_dash_width = dash_count * dash_w + (dash_count - 1) * int(sz * 0.06)
    start_x = cx - total_dash_width // 2
    for i in range(dash_count):
        dx = start_x + i * (dash_w + int(sz * 0.06))
        draw.rectangle(
            [dx, road_y, dx + dash_w, road_y + dash_h],
            fill=(*WHITE, 100),
        )

    return img

def generate_combined_icon(foreground, bg_color, size):
    bg = Image.new('RGBA', (size, size), bg_color)
    bg.paste(foreground, (0, 0), foreground)
    return bg.convert('RGB')

base_dir = '/home/subodh/workspace/Mero-Ghar-Logistics-Website/android/app/src/main/res'

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

# Generate foreground images for each density
for density, size in SIZES.items():
    img = draw_truck_icon(size)

    fg_path = f'{base_dir}/mipmap-{density}/ic_launcher_foreground.png'
    img.save(fg_path, 'PNG')
    print(f"Generated {fg_path} ({size}x{size})")

    combined = generate_combined_icon(img, FOREST, size)

    launcher_path = f'{base_dir}/mipmap-{density}/ic_launcher.png'
    combined.save(launcher_path, 'PNG')

    launcher_round_path = f'{base_dir}/mipmap-{density}/ic_launcher_round.png'
    combined.save(launcher_round_path, 'PNG')

    print(f"Generated {launcher_path}")

print("\nAll icons generated successfully!")
