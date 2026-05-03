import cv2
import numpy as np

files = [
    "public/brand/carry-hero-v4.png",
    "public/brand/modern-essentials-hero-v4.png",
    "public/brand/sun-ready-hero-v4.png",
    "public/brand/new-arrivals-hero-v2.png"
]

for f in files:
    img = cv2.imread(f, cv2.IMREAD_GRAYSCALE)
    if img is None:
        print(f"Could not read {f}")
        continue
    h, w = img.shape
    
    # We want to find where the sharpest edges are (text usually has high frequency edges)
    edges = cv2.Canny(img, 100, 200)
    
    left = edges[:, :w//3].sum()
    center = edges[:, w//3:2*w//3].sum()
    right = edges[:, 2*w//3:].sum()
    
    total = left + center + right
    if total == 0: total = 1
    
    print(f"{f}:")
    print(f"  Left:   {left/total*100:.1f}%")
    print(f"  Center: {center/total*100:.1f}%")
    print(f"  Right:  {right/total*100:.1f}%")

