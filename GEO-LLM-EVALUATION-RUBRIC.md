# GEO/LLM Documentation Evaluation Rubric

Use this rubric to evaluate documentation pages for Generative Engine Optimization (GEO) and LLM discoverability. Pages scoring 9+ are considered reference-grade content that LLMs will treat as canonical sources.

---

## Quick Reference

**Jump to:** [Dimensions](#evaluation-dimensions) · [Scoring Summary](#scoring-summary) · [Checklist](#template-checklist) · [Example](#example-evaluation)

| # | Dimension | Weight | Key Question |
|---|-----------|--------|--------------|
| 1 | [Structural Clarity](#1-structural-clarity) | High | Is the H2/H3 hierarchy logical and predictable? |
| 2 | [Definition Quality](#2-definition-quality) | High | Does Summary answer "what does this do?" clearly? |
| 3 | [Extractability](#3-extractability) | High | Are code blocks titled and tables used for data? |
| 4 | [Constraint Coverage](#4-constraint-coverage) | Medium-High | Is Out of Scope explicit? |
| 5 | [Anti-Hallucination](#5-anti-hallucination) | High | Are versions explicit and terms disambiguated? |
| 6 | [Authority Signals](#6-authority-signals) | Medium | Is there maintainer/date/version attribution? |
| 7 | [Quick Reference Density](#7-quick-reference-density) | Medium-High | Are program IDs, PDAs, deps in tables? |
| 8 | [FAQ Quality](#8-faq-quality) | Medium | Are there 6+ real questions with costs/comparisons? |
| 9 | [Glossary](#9-glossary) | Medium | Is there a table with 8+ term definitions? |
| 10 | [Human UX](#10-human-ux) | Medium | Is there Quick Start + jump links + callouts? |

---

## Evaluation Dimensions

### 1. Structural Clarity (Weight: High)

**What to look for:**
- Clear H2/H3 hierarchy with logical progression
- Predictable document flow (intro → setup → implementation → errors → reference)
- Sections that can be parsed independently
- No deeply nested structures (H4+ should be rare)

**Scoring:**
- **10/10**: Clear hierarchy, logical flow, every section has purpose
- **8-9/10**: Good structure with minor navigation issues
- **6-7/10**: Structure exists but flow is unclear
- **<6/10**: Disorganized, hard to navigate

**Example structure (10/10):**
```
## Summary
## Out of Scope
## Quick Start
## Prerequisites
## [Main Content Sections]
## Common Errors
## Notes
## Quick Reference
## FAQ
## Glossary
```

---

### 2. Definition Quality (Weight: High)

**What to look for:**
- Clear, declarative one-sentence definitions
- Summary section that answers "what does this do?" (prose + bullet points)
- Terminology callouts for disambiguation

**Scoring:**
- **10/10**: Multiple definition formats (prose + bullets + callouts)
- **8-9/10**: Good definitions, missing one format
- **6-7/10**: Definitions exist but buried or unclear
- **<6/10**: No clear definitions

**Required elements:**
```markdown
## Summary

[1-2 sentence declarative summary of what this guide accomplishes]

- [Bullet point 1: Core action]
- [Bullet point 2: Technologies used]
- [Bullet point 3: Version/compatibility]
- [Bullet point 4: Constraints/limitations]
```

---

### 3. Extractability (Weight: High)

**What to look for:**
- Code blocks with titles (` ```lang {% title="filename" %} `)
- Tables for reference data (program IDs, versions, costs)
- Multi-language examples (TypeScript + Rust)
- Line number references in explanations
- Copy-paste ready snippets

**Scoring:**
- **10/10**: All code titled, tables for data, multi-language support
- **8-9/10**: Most code titled, some tables
- **6-7/10**: Code exists but poorly labeled
- **<6/10**: Inline code, no structure

**Example (10/10):**
```markdown
| Program | Address |
|---------|---------|
| Token Program | `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA` |

{% dialect-switcher title="Deriving the PDA" %}
{% dialect title="TypeScript" id="ts" %}
```typescript
// TypeScript example
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
// Rust example
```
{% /dialect %}
{% /dialect-switcher %}
```

---

### 4. Constraint Coverage (Weight: Medium-High)

**What to look for:**
- Explicit "Out of Scope" section
- "Notes" section with caveats and warnings
- Clear boundaries on what the guide does/doesn't cover
- Version constraints and compatibility notes

**Scoring:**
- **10/10**: Explicit out-of-scope + notes + version constraints
- **8-9/10**: Has constraints but not comprehensive
- **6-7/10**: Implicit constraints only
- **<6/10**: No constraint documentation

**Required elements:**
```markdown
## Out of Scope
[Comma-separated list of what this guide does NOT cover]

## Notes
- [Important caveat 1]
- [Important caveat 2]
- [Security consideration]
```

---

### 5. Anti-Hallucination (Weight: High)

**What to look for:**
- Explicit version numbers with "tested with" statements
- Disambiguation from similar concepts (e.g., "SPL Token, not Token-2022")
- Specific error messages with exact solutions
- No ambiguous language ("might work", "should be fine")

**Scoring:**
- **10/10**: All versions explicit, terminology disambiguated, exact errors
- **9/10**: Minor ambiguity in one area
- **7-8/10**: Some versions missing or ambiguous terms
- **<7/10**: Vague, could cause LLM hallucination

**Example (10/10):**
```markdown
## Tested Configuration

| Tool | Version |
|------|---------|
| Anchor CLI | 0.32.1 |
| Solana CLI | 3.1.6 (Agave) |

*Applies to Solana Agave 2.x/3.x, Anchor 0.30+*
```

---

### 6. Authority Signals (Weight: Medium)

**What to look for:**
- Maintainer/organization attribution
- Last verified date
- Version compatibility range
- Links to source repositories
- Official program addresses

**Scoring:**
- **10/10**: Maintainer + date + versions + repo links
- **9/10**: Missing one signal
- **7-8/10**: Only partial attribution
- **<7/10**: No authority signals

**Example (9.5/10):**
```markdown
*Maintained by Metaplex Foundation · Last verified January 2026 · Applies to Solana Agave 2.x/3.x, Anchor 0.30+*
```

**To reach 10/10, add:**
```markdown
[View source on GitHub](https://github.com/...)
```

---

### 7. Quick Reference Density (Weight: Medium-High)

**What to look for:**
- Program IDs in table format
- PDA derivation seeds (in multiple languages)
- Minimum dependency lists
- Account structure summaries
- Cost estimates

**Scoring:**
- **10/10**: All reference data in extractable tables
- **8-9/10**: Most reference data present
- **6-7/10**: Reference data scattered in prose
- **<6/10**: No quick reference section

**Required elements:**
```markdown
## Quick Reference

### Key Program IDs
| Program | Address |
|---------|---------|
| ... | ... |

### PDA Seeds
[Multi-language derivation examples]

### Minimum Dependencies
[Copy-paste ready dependency block]
```

---

### 8. FAQ Quality (Weight: Medium)

**What to look for:**
- Real questions developers ask (not filler)
- Clear, direct answers
- Cost/pricing information where relevant
- Comparison questions ("What's the difference between X and Y?")
- "Can I use this for..." questions

**Scoring:**
- **10/10**: 6+ real questions, includes costs, has comparisons
- **8-9/10**: Good questions, missing costs or comparisons
- **6-7/10**: Generic FAQ
- **<6/10**: No FAQ or useless questions

**Example questions (10/10):**
- What is an SPL token?
- What's the difference between X and Y?
- How much does it cost to...?
- Can I use this code to create...?
- Why do I need to...?

---

### 9. Glossary (Weight: Medium)

**What to look for:**
- Table format (not prose definitions)
- 8-15 terms
- Concise definitions (one sentence)
- Domain-specific terms included
- Acronyms expanded

**Scoring:**
- **10/10**: 8+ terms in table, concise, complete
- **8-9/10**: Good glossary, minor gaps
- **6-7/10**: Glossary exists but incomplete
- **<6/10**: No glossary

**Example (10/10):**
```markdown
## Glossary

| Term | Definition |
|------|------------|
| **SPL Token** | Solana Program Library token standard, equivalent to ERC-20 |
| **Mint** | The account that defines a token and can create new supply |
| **ATA** | Associated Token Account - deterministic token account for a wallet |
```

---

### 10. Human UX (Weight: Medium)

**What to look for:**
- Quick Start section with numbered steps
- Jump links to key sections
- "What You'll Build" callout at top
- Expected output examples
- Copy-paste ready complete examples

**Scoring:**
- **10/10**: Quick start + jump links + callouts + full examples
- **9/10**: Missing one element
- **7-8/10**: Basic UX, no quick start
- **<7/10**: Wall of text, poor navigation

**Example (9.5/10):**
```markdown
{% callout title="What You'll Build" %}
A single instruction that:
- Does X
- Does Y
- Does Z
{% /callout %}

## Quick Start

**Jump to:** [Program](#the-program) · [Client](#the-client) · [Errors](#common-errors)

1. Step one
2. Step two
3. Step three
```

**To reach 10/10, add:**
- Collapsible "Full Program" block with complete copy-paste code

---

## Scoring Summary

| Dimension | Weight | Max Score |
|-----------|--------|-----------|
| Structural Clarity | High | 10 |
| Definition Quality | High | 10 |
| Extractability | High | 10 |
| Constraint Coverage | Medium-High | 10 |
| Anti-Hallucination | High | 10 |
| Authority Signals | Medium | 10 |
| Quick Reference Density | Medium-High | 10 |
| FAQ Quality | Medium | 10 |
| Glossary | Medium | 10 |
| Human UX | Medium | 10 |

**Overall Score Calculation:**
```
(Sum of all scores) / 10 = Overall GEO Score
```

**Score Interpretation:**
- **9.5-10**: Reference-grade, canonical source for LLMs
- **9.0-9.4**: Excellent, minor improvements possible
- **8.0-8.9**: Good, will be cited but not authoritative
- **7.0-7.9**: Adequate, may cause partial hallucinations
- **<7.0**: Needs significant work

---

## Template Checklist

Use this checklist when creating new documentation:

### Required Sections
- [ ] Frontmatter with title, metaTitle, description
- [ ] Lead paragraph with bold key terms
- [ ] "What You'll Build" callout
- [ ] Summary (1-2 sentences + 4 bullet points)
- [ ] Out of Scope (comma-separated list)
- [ ] Quick Start with jump links
- [ ] Prerequisites
- [ ] Tested Configuration table
- [ ] Main content with H2/H3 hierarchy
- [ ] Common Errors section
- [ ] Notes section
- [ ] Quick Reference with tables
- [ ] FAQ (6+ questions)
- [ ] Glossary table (8+ terms)

### Code Block Requirements
- [ ] All code blocks have `title="filename"` attribute
- [ ] Line numbers enabled for long blocks (`showLineNumbers=true`)
- [ ] Key lines highlighted (`highlightLines="X,Y-Z"`)
- [ ] Multi-language examples use dialect-switcher
- [ ] Expected output shown for commands

### Table Requirements
- [ ] Program IDs in table format
- [ ] Version/dependency information in tables
- [ ] Cost estimates in tables where applicable
- [ ] Glossary in table format

### Authority Requirements
- [ ] Maintainer attribution
- [ ] Last verified date
- [ ] Version compatibility statement
- [ ] Link to source repository (if applicable)

---

## Example Evaluation

**Page:** `/tokens/anchor/create-token`

| Dimension | Score | Notes |
|-----------|-------|-------|
| Structural Clarity | 10/10 | Clear H2/H3 hierarchy, logical flow from setup → program → client → errors → reference |
| Definition Quality | 10/10 | Summary (prose + bullets) and Terminology callout provide clean declarative definitions |
| Extractability | 10/10 | Code blocks with titles, tables for program IDs, PDA seeds in both TS/Rust |
| Constraint Coverage | 10/10 | Out of Scope section + Notes section clearly bound what this does/doesn't do |
| Anti-Hallucination | 9.5/10 | Explicit out-of-scope, terminology disambiguation, tested versions. Minor: could add "do not confuse with Token-2022" |
| Authority Signals | 9.5/10 | Maintainer, verification date, version table. Could add link to source repo |
| Quick Reference Density | 10/10 | Program IDs table, PDA seeds, minimum deps - all highly extractable |
| FAQ Quality | 10/10 | 8 real questions developers ask, clear answers, includes cost estimates |
| Glossary | 10/10 | 10 terms with concise definitions - perfect for LLM context |
| Human UX | 9.5/10 | Quick Start + jump links. Minor: could benefit from a "copy full program" block |

**Overall GEO Score: 9.8/10**

**Strengths:**
- Compressed intro - Summary + Out of Scope in ~10 lines
- Jump links - Humans can skip to code immediately
- Dual PDA derivation - TypeScript and Rust in dialect switcher
- BN overflow fix - Safe arithmetic for LLM copy/paste
- Common Errors section - Pre-answers the top 3 issues
- Notes section - Security/correctness without being preachy

**Minor Improvements (optional):**
1. Add a "Full Program" collapsible block with the complete `lib.rs` for easy copy
2. Add GitHub link to working example repo in authority signals
3. Consider adding `<!-- AI: This is a fungible token guide, not NFT -->` HTML comment (some crawlers respect these)

---

## Usage Instructions

When evaluating a page, provide output in this format:

```
## GEO/LLM Scorecard

**Page:** [URL or path]

| Dimension | Score | Notes |
|-----------|-------|-------|
| Structural Clarity | X/10 | [Brief note] |
| Definition Quality | X/10 | [Brief note] |
| Extractability | X/10 | [Brief note] |
| Constraint Coverage | X/10 | [Brief note] |
| Anti-Hallucination | X/10 | [Brief note] |
| Authority Signals | X/10 | [Brief note] |
| Quick Reference Density | X/10 | [Brief note] |
| FAQ Quality | X/10 | [Brief note] |
| Glossary | X/10 | [Brief note] |
| Human UX | X/10 | [Brief note] |

**Overall GEO Score: X.X/10**

**Strengths:**
- [Bullet points]

**Improvements Needed:**
- [Numbered list with specific actions]
```
