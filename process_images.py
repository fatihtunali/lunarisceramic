#!/usr/bin/env python3
"""
Process product images with clean white studio background
- Removes original background (any color including black)
- Applies pure white background like professional product photography
- Outputs WebP format for faster loading
"""

import os
from pathlib import Path
from PIL import Image, ImageDraw
from rembg import remove
import io

# Paths
BASE_DIR = Path(r"C:\Users\fatih\Desktop\lunarisceramic\public\images_original")
OUTPUT_DIR = Path(r"C:\Users\fatih\Desktop\lunarisceramic\public\images")

# Pure white background
WHITE = (255, 255, 255)


def create_white_background(width, height):
    """Create a clean white studio background"""
    img = Image.new('RGB', (width, height), WHITE)

    # Very subtle shadow at bottom for grounding effect
    draw = ImageDraw.Draw(img)
    shadow_height = int(height * 0.08)
    for y in range(height - shadow_height, height):
        ratio = (y - (height - shadow_height)) / shadow_height
        gray_value = int(255 - (6 * ratio))  # Very subtle: 255 to 249
        draw.line([(0, y), (width, y)], fill=(gray_value, gray_value, gray_value))

    return img


def process_image(input_path, output_path):
    """Process a single image: remove background and add white background"""
    try:
        # Read the image
        with open(input_path, 'rb') as f:
            input_data = f.read()

        # Remove background with alpha matting for better edges
        output_data = remove(
            input_data,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=10,
            alpha_matting_erode_size=10
        )

        # Open the result (RGBA with transparent background)
        product = Image.open(io.BytesIO(output_data)).convert('RGBA')

        # Get dimensions
        width, height = product.size

        # Create white background
        background = create_white_background(width, height)
        background = background.convert('RGBA')

        # Composite product onto white background
        background.paste(product, (0, 0), product)

        # Convert to RGB for output
        final = background.convert('RGB')

        # Save as WebP with high quality
        final.save(output_path, 'WEBP', quality=90)

        return True
    except Exception as e:
        print(f"Error processing {input_path}: {e}")
        return False


def process_all_images():
    """Process all product images"""
    folders = ['cups', 'wine glass', 'wine server', 'Gramophone']

    total_processed = 0
    total_failed = 0

    for folder in folders:
        input_folder = BASE_DIR / folder
        output_folder = OUTPUT_DIR / folder

        if not input_folder.exists():
            print(f"Folder not found: {input_folder}")
            continue

        # Create output folder
        output_folder.mkdir(parents=True, exist_ok=True)

        # Get all jpeg files (skip subdirectories)
        image_files = [f for f in input_folder.glob('*.jpeg') if f.is_file()]
        image_files += [f for f in input_folder.glob('*.jpg') if f.is_file()]

        print(f"\nProcessing {folder}: {len(image_files)} images")

        for i, img_path in enumerate(image_files, 1):
            # Change extension to .webp
            output_filename = img_path.stem + '.webp'
            output_path = output_folder / output_filename
            print(f"  [{i}/{len(image_files)}] {img_path.name} -> {output_filename}...", end=' ', flush=True)

            if process_image(img_path, output_path):
                print("OK")
                total_processed += 1
            else:
                print("FAILED")
                total_failed += 1

    print(f"\n{'='*50}")
    print(f"Completed: {total_processed} processed, {total_failed} failed")
    print(f"Output folder: {OUTPUT_DIR}")


if __name__ == '__main__':
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("Lunaris Ceramic - White Background + WebP Processor")
    print("=" * 50)
    print(f"Input (original): {BASE_DIR}")
    print(f"Output (WebP): {OUTPUT_DIR}")
    print("=" * 50)

    process_all_images()
