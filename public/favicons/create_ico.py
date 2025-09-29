#!/usr/bin/env python3
import struct

def create_ico_from_png(png_path, ico_path):
    with open(png_path, 'rb') as f:
        png_data = f.read()

    ico_header = struct.pack('<HHH', 0, 1, 1)

    width = 32
    height = 32
    color_palette = 0
    reserved = 0
    color_planes = 1
    bits_per_pixel = 32
    image_size = len(png_data)
    image_offset = 22

    directory_entry = struct.pack('<BBBBHHII',
                                  width if width < 256 else 0,
                                  height if height < 256 else 0,
                                  color_palette,
                                  reserved,
                                  color_planes,
                                  bits_per_pixel,
                                  image_size,
                                  image_offset)

    with open(ico_path, 'wb') as f:
        f.write(ico_header)
        f.write(directory_entry)
        f.write(png_data)

    print(f"Created {ico_path} with transparency support")

if __name__ == "__main__":
    create_ico_from_png('favicon-32x32.png', 'favicon.ico')