#!/usr/bin/env python3
"""
Fix all broken internal links in Korean (ko) markdown files.
This script replaces /ko/cli/ with /ko/dev-tools/cli/ in all markdown files
under src/pages/ko/dev-tools/cli/
"""
import os
import re
from pathlib import Path

# Base directory
base_dir = Path(r"C:\Users\tony\Development\metaplex\developer-hub\src\pages\ko\dev-tools\cli")

# Pattern to replace
old_pattern = r'\(/ko/cli/'
new_pattern = r'(/ko/dev-tools/cli/'

# Counter for tracking changes
files_changed = 0
total_replacements = 0

# Find all markdown files recursively
md_files = list(base_dir.rglob('*.md'))

print(f"Found {len(md_files)} markdown files in {base_dir}")
print(f"Replacing '{old_pattern}' with '{new_pattern}'")
print("-" * 60)

# Process each file
for md_file in md_files:
    try:
        # Read file content
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Track if any changes were made
        original_content = content

        # Count and apply replacements
        matches = len(re.findall(old_pattern, content))
        if matches > 0:
            content = re.sub(old_pattern, new_pattern, content)

            # Write back the changes
            with open(md_file, 'w', encoding='utf-8', newline='\n') as f:
                f.write(content)

            files_changed += 1
            total_replacements += matches
            print(f"✓ Fixed {matches} link(s) in: {md_file.relative_to(base_dir.parent.parent.parent)}")

    except Exception as e:
        print(f"✗ Error processing {md_file}: {e}")

print("-" * 60)
print(f"Done! Fixed {total_replacements} links in {files_changed} file(s).")
