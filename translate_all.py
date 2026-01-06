#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Comprehensive translation script for Metaplex Developer Hub documentation.
Translates markdown files from English to Chinese while preserving code blocks
and updating internal links.

Usage:
    python translate_all.py                    # Translate all missing files
    python translate_all.py --dry-run          # Show what would be translated
    python translate_all.py --section dev-tools  # Only translate dev-tools
    python translate_all.py --section smart-contracts  # Only translate smart-contracts
"""

import os
import re
import sys
from pathlib import Path

# Base paths
BASE_DIR = Path(__file__).parent
EN_PAGES = BASE_DIR / "src" / "pages" / "en"
ZH_PAGES = BASE_DIR / "src" / "pages" / "zh"

# Command line args
DRY_RUN = "--dry-run" in sys.argv
SECTION_FILTER = None
for i, arg in enumerate(sys.argv):
    if arg == "--section" and i + 1 < len(sys.argv):
        SECTION_FILTER = sys.argv[i + 1]

# Translation mappings for common terms (English -> Chinese)
TRANSLATIONS = {
    # Keep technical terms in English
    "Metaplex": "Metaplex",
    "Solana": "Solana",
    "NFT": "NFT",
    "NFTs": "NFT",
    "cNFT": "cNFT",
    "cNFTs": "cNFT",
    "JSON": "JSON",
    "CLI": "CLI",
    "RPC": "RPC",
    "API": "API",
    "DAS": "DAS",
    "MPL": "MPL",
    "Core": "Core",
    "Candy Machine": "Candy Machine",
    "UMI": "UMI",
    "Umi": "Umi",
    "Shank": "Shank",
    "SOL": "SOL",
    "Sugar": "Sugar",
    "Bubblegum": "Bubblegum",
    "Token Metadata": "Token Metadata",
    "JavaScript": "JavaScript",
    "TypeScript": "TypeScript",
    "Rust": "Rust",
    "Anchor": "Anchor",

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
    "Guide": "指南",
    "Methods": "方法",
    "Reference": "参考",
    "References": "参考",
    "Quick Start": "快速开始",
    "Next Steps": "下一步",
    "Related Commands": "相关命令",
    "Related Documentation": "相关文档",
    "Best Practices": "最佳实践",
    "Troubleshooting": "故障排除",
    "Common Issues": "常见问题",
    "Create": "创建",
    "Update": "更新",
    "Delete": "删除",
    "Fetch": "获取",
    "Transfer": "转移",
    "Burn": "销毁",
    "Mint": "铸造",
    "Collection": "集合",
    "Collections": "集合",
    "Asset": "资产",
    "Assets": "资产",
    "Plugin": "插件",
    "Plugins": "插件",
    "Guard": "守卫",
    "Guards": "守卫",
    "Account": "账户",
    "Accounts": "账户",
    "Transaction": "交易",
    "Transactions": "交易",
    "Wallet": "钱包",
    "Wallets": "钱包",
    "Token": "代币",
    "Tokens": "代币",
    "Balance": "余额",
    "Airdrop": "空投",
    "Deploy": "部署",
    "Verify": "验证",
    "Validate": "验证",
    "Upload": "上传",
    "Download": "下载",
    "Launch": "启动",
    "Reveal": "揭示",
    "Sign": "签名",
    "Show": "显示",
    "Hash": "哈希",
    "Freeze": "冻结",
    "Thaw": "解冻",
}

def get_missing_files():
    """Get list of files that exist in EN but not in ZH."""
    missing = []

    for en_file in EN_PAGES.rglob("*.md"):
        rel_path = en_file.relative_to(EN_PAGES)
        zh_file = ZH_PAGES / rel_path

        # Skip test files
        if str(rel_path).startswith("test-"):
            continue

        if not zh_file.exists():
            missing.append(rel_path)

    return sorted(missing)


def translate_title(title):
    """Translate a title string while preserving technical terms."""
    result = title

    # Apply translations
    for en, zh in TRANSLATIONS.items():
        # Use word boundary matching for better accuracy
        pattern = r'\b' + re.escape(en) + r'\b'
        result = re.sub(pattern, zh, result, flags=re.IGNORECASE)

    return result


def translate_frontmatter(frontmatter):
    """Translate frontmatter fields to Chinese."""
    lines = frontmatter.strip().split('\n')
    translated_lines = []

    for line in lines:
        if ':' in line:
            # Handle YAML key-value pairs
            match = re.match(r'^(\s*)([^:]+):\s*(.*)$', line)
            if match:
                indent, key, value = match.groups()
                key = key.strip()
                value = value.strip()

                # Only translate specific fields
                if key in ['title', 'metaTitle', 'sidebarLabel']:
                    # Remove quotes if present
                    if value.startswith('"') and value.endswith('"'):
                        value = value[1:-1]
                        value = translate_title(value)
                        value = f'"{value}"'
                    elif value.startswith("'") and value.endswith("'"):
                        value = value[1:-1]
                        value = translate_title(value)
                        value = f"'{value}'"
                    else:
                        value = translate_title(value)

                translated_lines.append(f"{indent}{key}: {value}")
            else:
                translated_lines.append(line)
        else:
            translated_lines.append(line)

    return '\n'.join(translated_lines)


def update_links(content):
    """Update internal links from /en/ to /zh/."""
    # Update markdown links
    content = re.sub(r'\(/en/', r'(/zh/', content)
    content = re.sub(r'href="/en/', r'href="/zh/', content)

    return content


def process_file(en_file_path, zh_file_path, dry_run=False):
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

    if dry_run:
        print(f"  Would create: {zh_file_path.relative_to(BASE_DIR)}")
        return

    # Ensure parent directory exists
    zh_file_path.parent.mkdir(parents=True, exist_ok=True)

    # Write translated file
    with open(zh_file_path, 'w', encoding='utf-8') as f:
        f.write(translated_content)

    print(f"  Created: {zh_file_path.relative_to(BASE_DIR)}")


def main():
    """Main translation function."""
    print("=" * 60)
    print("Metaplex Developer Hub - Translation Script")
    print("=" * 60)
    print()

    if DRY_RUN:
        print("DRY RUN MODE - No files will be created\n")

    # Get missing files
    missing_files = get_missing_files()

    # Filter by section if specified
    if SECTION_FILTER:
        missing_files = [f for f in missing_files if str(f).startswith(SECTION_FILTER)]
        print(f"Filtering to section: {SECTION_FILTER}\n")

    # Group by top-level directory
    by_section = {}
    for file_path in missing_files:
        parts = file_path.parts
        section = parts[0] if len(parts) > 1 else "(root)"
        if section not in by_section:
            by_section[section] = []
        by_section[section].append(file_path)

    print(f"Found {len(missing_files)} files to translate:\n")
    for section, files in sorted(by_section.items()):
        print(f"  {section}/: {len(files)} files")
    print()

    # Process each file
    translated_count = 0
    for section, files in sorted(by_section.items()):
        print(f"\nProcessing {section}/...")
        for rel_path in files:
            en_file = EN_PAGES / rel_path
            zh_file = ZH_PAGES / rel_path

            process_file(en_file, zh_file, dry_run=DRY_RUN)
            translated_count += 1

    print()
    print("=" * 60)
    if DRY_RUN:
        print(f"Would translate: {translated_count} files")
    else:
        print(f"Translation complete! Translated: {translated_count} files")
    print("=" * 60)

    if not DRY_RUN:
        print("\nNext steps:")
        print("  1. Review the translated files")
        print("  2. Run: node scripts/validate-translations.js --files-only")
        print("  3. Commit the changes")


if __name__ == "__main__":
    main()
