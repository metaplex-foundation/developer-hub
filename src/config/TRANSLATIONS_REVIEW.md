# Navigation Translations Review

## Purpose

This document coordinates native-speaker review of Japanese and Korean translations used in the Metaplex Developer Hub navigation system.

## Location

All centralized navigation translations are located in:
- **File**: `src/config/navigation-translations.js`
- **Structure**: Organized by sections, links, and product-specific content

## Review Process

### For Japanese Translations (日本語)

**Native Speaker Needed**: Yes
**Review Status**: ⚠️ PENDING REVIEW
**Priority**: High

Please review all translations marked with `ja:` in `navigation-translations.js` for:
1. **Accuracy**: Does the translation correctly convey the English meaning?
2. **Naturalness**: Does it sound natural to native Japanese speakers?
3. **Consistency**: Are similar terms translated consistently throughout?
4. **Technical Appropriateness**: Are technical terms (NFT, API, etc.) handled correctly?

**Common Terms to Verify**:
- Overview → 概要
- Getting Started → はじめに
- Features → 機能
- Advanced → 高度
- FAQ → よくある質問
- Guides → ガイド
- Introduction → 紹介

### For Korean Translations (한국어)

**Native Speaker Needed**: Yes
**Review Status**: ⚠️ PENDING REVIEW
**Priority**: High

Please review all translations marked with `ko:` in `navigation-translations.js` for:
1. **Accuracy**: Does the translation correctly convey the English meaning?
2. **Naturalness**: Does it sound natural to native Korean speakers?
3. **Consistency**: Are similar terms translated consistently throughout?
4. **Technical Appropriateness**: Are technical terms (NFT, API, etc.) handled correctly?

**Common Terms to Verify**:
- Overview → 개요
- Getting Started → 시작하기
- Features → 기능
- Advanced → 고급
- FAQ → 자주 묻는 질문
- Guides → 가이드
- Introduction → 소개

## Known Issues

### Japanese Inconsistencies
- **"Advanced"** has two variants in original files:
  - `高度` (short form) - Currently used in centralized file
  - `高度な機能` (long form with "functions/features")
  - **Action Needed**: Confirm which is preferred

### Korean Inconsistencies
- **"Advanced"** has two variants in original files:
  - `고급` (short form) - Currently used in centralized file
  - `고급 기능` (long form with "functions")
  - **Action Needed**: Confirm which is preferred

## How to Submit Review Feedback

### Option 1: Direct File Edit
1. Open `src/config/navigation-translations.js`
2. Edit the translations directly
3. Submit a pull request with your changes
4. Include reasoning for significant changes in PR description

### Option 2: Issue Report
1. Create a new GitHub issue
2. Title: "Translation Review: [Language] - [Section]"
3. List translations that need changes
4. Provide corrected translations with explanations

### Option 3: Spreadsheet Review
1. Request access to review spreadsheet (if available)
2. Mark corrections in dedicated review columns
3. Add comments for context

## Translation Coverage

Current translations cover:

### Common Navigation Elements
- ✅ Section titles (Introduction, SDK, Features, Guides, etc.)
- ✅ Common links (Overview, Getting Started, FAQ, etc.)
- ✅ Programming languages (JavaScript, Rust)

### Product-Specific Content
- ✅ DAS API navigation (~30 unique terms)
- ✅ Bubblegum v2 navigation (~20 unique terms)
- ⚠️ Other products: Pending migration to centralized system

### Areas Not Yet Centralized
- Product headlines and descriptions (partially centralized)
- Page content and markdown files
- Error messages and UI text

## Testing Translations

After making changes:

1. **Build the site**:
   ```bash
   pnpm run build
   ```

2. **Test in browser**:
   - Navigate to `/ja/[product]` for Japanese
   - Navigate to `/ko/[product]` for Korean
   - Verify navigation text displays correctly

3. **Check for missing translations**:
   ```bash
   pnpm run validate-translations
   ```

## Contact

For questions about the translation system or review process:
- File an issue: `https://github.com/metaplex-foundation/developer-hub/issues`
- Tag with: `translations`, `i18n`, `needs-review`

## Timeline

**Target Review Completion**: [To be determined]
**Assigned Reviewers**:
- Japanese: [To be assigned]
- Korean: [To be assigned]

---

## Review Checklist

### Japanese Reviewer

- [ ] Review all `sections` translations
- [ ] Review all `links` translations
- [ ] Review product-specific headlines/descriptions
- [ ] Verify technical term consistency
- [ ] Confirm "Advanced" translation preference
- [ ] Test in browser
- [ ] Submit feedback

### Korean Reviewer

- [ ] Review all `sections` translations
- [ ] Review all `links` translations
- [ ] Review product-specific headlines/descriptions
- [ ] Verify technical term consistency
- [ ] Confirm "Advanced" translation preference
- [ ] Test in browser
- [ ] Submit feedback

---

**Last Updated**: 2025-01-22
**Review Status**: Awaiting native speaker review
