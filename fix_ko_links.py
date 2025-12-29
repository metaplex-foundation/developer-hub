#!/usr/bin/env python3
import os
import re
from pathlib import Path

# Base directory
base_dir = r"C:\Users\tony\Development\metaplex\developer-hub\src\pages\ko"

# Pattern to replace
pattern = (r'\(/ko/cli/', r'(/ko/dev-tools/cli/')

# Find all markdown files
md_files = list(Path(base_dir).rglob('*.md'))

print(f"Found {len(md_files)} markdown files")

# Process each file
for md_file in md_files:
    try:
        # Read file content
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Track if any changes were made
        original_content = content

        # Apply replacement
        content = re.sub(pattern[0], pattern[1], content)

        # Write back if changed
        if content != original_content:
            with open(md_file, 'w', encoding='utf-8', newline='\n') as f:
                f.write(content)
            print(f"Fixed: {md_file}")
    except Exception as e:
        print(f"Error processing {md_file}: {e}")

print("Done!")
