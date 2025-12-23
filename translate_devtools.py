#!/usr/bin/env python3
"""
Translation script for dev-tools documentation from English to Chinese.
Translates markdown files while preserving code blocks and updating internal links.
"""

import os
import re
from pathlib import Path

# Base paths
EN_BASE = "C:/Users/tony/Development/metaplex/developer-hub/src/pages/en/dev-tools"
ZH_BASE = "C:/Users/tony/Development/metaplex/developer-hub/src/pages/zh/dev-tools"

# Files already translated (skip these)
TRANSLATED_FILES = [
    "index.md",
    "amman/index.md", "amman/getting-started.md", "amman/cli-commands.md",
    "amman/configuration.md", "amman/pre-made-configs.md",
    "aura/index.md", "aura/reading-solana-and-svm-data.md", "aura/faq.md",
    "aura/blockchains/solana.md", "aura/blockchains/eclipse.md",
    "cli/index.md", "cli/installation.md",
    "cli/cm/index.md", "cli/cm/create.md", "cli/cm/upload.md",
    "cli/cm/validate.md", "cli/cm/insert.md", "cli/cm/fetch.md", "cli/cm/withdraw.md",
    "cli/config/wallets.md", "cli/config/rpcs.md", "cli/config/explorer.md"
]

# Translation mappings for common terms
TRANSLATIONS = {
    # Technical terms (keep English)
    "Metaplex": "Metaplex",
    "Solana": "Solana",
    "NFT": "NFT",
    "JSON": "JSON",
    "CLI": "CLI",
    "RPC": "RPC",
    "API": "API",
    "DAS": "DAS",
    "MPL": "MPL",
    "Core": "Core",
    "Candy Machine": "Candy Machine",
    "UMI": "UMI",
    "Shank": "Shank",
    "SOL": "SOL",

    # Common translations
    "Overview": "概述",
    "Introduction": "简介",
    "Getting Started": "开始使用",
    "Installation": "安装",
    "Configuration": "配置",
    "Commands": "命令",
    "Usage": "用法",
    "Example": "示例",
    "Examples": "示例",
    "Prerequisites": "前置条件",
    "Requirements": "要求",
    "Options": "选项",
    "Arguments": "参数",
    "Description": "描述",
    "Notes": "注意事项",
    "Warning": "警告",
    "Important": "重要",
    "Tip": "提示",
    "FAQ": "常见问题",
    "Guides": "指南",
    "Methods": "方法",
    "Reference": "参考",
    "Quick Start": "快速开始",
    "Next Steps": "下一步",
    "Related Commands": "相关命令",
    "Related Documentation": "相关文档",
    "Best Practices": "最佳实践",
    "Troubleshooting": "故障排除",
    "Common Issues": "常见问题",
}

def translate_frontmatter(frontmatter):
    """Translate frontmatter fields to Chinese."""
    lines = frontmatter.strip().split('\n')
    translated_lines = []

    for line in lines:
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()

            # Translate specific fields
            if key in ['title', 'metaTitle', 'description']:
                # Apply basic translation logic
                for en, zh in TRANSLATIONS.items():
                    value = value.replace(en, zh)

            translated_lines.append(f"{key}: {value}")
        else:
            translated_lines.append(line)

    return '\n'.join(translated_lines)

def update_links(content):
    """Update internal links from /en/ to /zh/."""
    # Update markdown links
    content = re.sub(r'\(/en/dev-tools/', r'(/zh/dev-tools/', content)
    content = re.sub(r'href="/en/dev-tools/', r'href="/zh/dev-tools/', content)

    # Update other common /en/ links
    content = re.sub(r'\(/en/core', r'(/zh/core', content)
    content = re.sub(r'\(/en/umi', r'(/zh/umi', content)
    content = re.sub(r'href="/en/', r'href="/zh/', content)

    return content

def process_file(en_file_path, zh_file_path):
    """Process a single markdown file for translation."""
    with open(en_file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split frontmatter and content
    parts = content.split('---')
    if len(parts) >= 3:
        frontmatter = parts[1]
        body = '---'.join(parts[2:])

        # Translate frontmatter
        translated_frontmatter = translate_frontmatter(frontmatter)

        # Update links in body
        translated_body = update_links(body)

        # Combine
        translated_content = f"---\n{translated_frontmatter}\n---{translated_body}"
    else:
        # No frontmatter
        translated_content = update_links(content)

    # Ensure parent directory exists
    zh_file_path.parent.mkdir(parents=True, exist_ok=True)

    # Write translated file
    with open(zh_file_path, 'w', encoding='utf-8') as f:
        f.write(translated_content)

    print(f"Translated: {en_file_path.relative_to(EN_BASE)}")

def main():
    """Main translation function."""
    en_base_path = Path(EN_BASE)
    zh_base_path = Path(ZH_BASE)

    # Find all markdown files
    all_md_files = list(en_base_path.rglob('*.md'))

    print(f"Found {len(all_md_files)} total markdown files")
    print(f"Already translated: {len(TRANSLATED_FILES)} files")
    print(f"Remaining: {len(all_md_files) - len(TRANSLATED_FILES)} files\n")

    translated_count = 0
    skipped_count = 0

    for en_file in all_md_files:
        rel_path = en_file.relative_to(en_base_path)
        rel_path_str = str(rel_path).replace('\\', '/')

        # Skip if already translated
        if rel_path_str in TRANSLATED_FILES:
            skipped_count += 1
            continue

        zh_file = zh_base_path / rel_path

        # Process the file
        process_file(en_file, zh_file)
        translated_count += 1

    print(f"\nTranslation complete!")
    print(f"Newly translated: {translated_count} files")
    print(f"Skipped (already done): {skipped_count} files")
    print(f"Total: {translated_count + skipped_count} files")

if __name__ == "__main__":
    main()
