# GEO/LLM Documentation Evaluation Rubric

Use this rubric to evaluate documentation pages for Generative Engine Optimization (GEO) and LLM discoverability. Pages scoring 90%+ of their applicable points are considered reference-grade content that LLMs will treat as canonical sources.

---

## Quick Reference

**Jump to:** [Page Types](#context-dependent-page-types) · [Dimensions](#evaluation-dimensions) · [Scoring Summary](#scoring-summary) · [Checklist](#template-checklist) · [Example](#example-evaluation)

| # | Dimension | Weight | Key Question |
|---|-----------|--------|--------------|
| 1 | [Structure & Context Graphs](#1-structure--context-graphs) | High | Are headers pronoun-free, and are internal links present for context? |
| 2 | [Answer Directness (BLUF)](#2-answer-directness-bluf) | High | Does the first sentence of every section directly answer the intent? |
| 3 | [Extractability](#3-extractability) | High | Are code blocks titled, tables used for data, and diagrams described? |
| 4 | [Constraint Clarity](#4-constraint-clarity) | Medium-High | Are caveats integrated naturally via callouts without breaking flow? |
| 5 | [Anti-Hallucination](#5-anti-hallucination) | High | Does terminology align with llms.txt? Are versions explicit? |
| 6 | [Authority Signals](#6-authority-signals) | Medium | Is there maintainer/date/version attribution? |
| 7 | [Quick Reference Density](#7-quick-reference-density) | Medium-High | Are program IDs, PDAs, deps in tables? |
| 8 | [FAQ Quality](#8-faq-quality) | Context-Dep. | Are there real questions targeting costs/comparisons without fluff? |
| 9 | [Glossary](#9-glossary) | Context-Dep. | Are specific, domain-relevant terms defined in a table? |
| 10 | [Human UX](#10-human-ux) | Context-Dep. | Is there a Quick Start + jump links + callouts where applicable? |

---

## Context-Dependent Page Types

Not all documentation pages serve the same user intent. Do not force content just to satisfy the rubric — LLMs penalise high noise-to-signal ratios. Identify the page type first, then mark inapplicable dimensions as N/A.

| Page Type | Primary Intent | Crucial Dimensions | Exempt / Optional (N/A) |
|-----------|---------------|--------------------|-------------------------|
| **Tutorial / Guide** | "Show me how to build X end-to-end." | Human UX, Structure, Extractability | Quick Reference Density (can be lighter) |
| **Concept / Architecture** | "Explain how X works conceptually." | Answer Directness, Glossary, FAQ Quality | Human UX (Quick Start), Extractability (less code expected) |
| **Reference (API/CLI/SDK)** | "What are the exact parameters for X?" | Extractability, Constraint Clarity, Anti-Hallucination, Quick Reference | FAQ Quality, Glossary, Human UX |
| **Overview / Index** | "Give me the lay of the land for product X." | Structure, Answer Directness, Authority Signals | Extractability (no code), Human UX (Quick Start replaced by quick-links) |

If a dimension is N/A for the page type, exclude it from scoring and calculate the final score as a percentage of remaining applicable points.

---

## Evaluation Dimensions

### 1. Structure & Context Graphs (Weight: High)

**What to look for:**
- Clear H2/H3 hierarchy with logical progression
- Predictable document flow (intro → setup → implementation → errors → reference)
- Sections that can be parsed independently; no deeply nested structures (H4+ should be rare)
- **RAG Disambiguation**: subheadings must be context-independent — avoid pronouns and shorthand that only make sense in sequence (e.g., use `### Passing the PDA to the Client`, not `### Passing It`). LLMs retrieve chunks in isolation; a header that requires the previous section to make sense produces broken extractions
- **Internal Knowledge Graphing**: link the first mention of key concepts to their canonical pages (e.g., first mention of "ATA" links to the ATA concept page). This helps LLMs map entity relationships across the documentation graph, not just within a single page

**Scoring:**
- **10/10**: Clear hierarchy, 100% context-independent headers, excellent internal knowledge links
- **8-9/10**: Good structure, but 1-2 headers use pronouns or obvious internal links are missing
- **6-7/10**: Structure exists but flow is unclear; sparse internal linking
- **<6/10**: Disorganised, vague or pronoun-dependent headers, no internal context links

**Example structure (10/10):**
```
## Summary
## Quick Start
## Prerequisites
## [Specific, Noun-Based Content Sections]
## Common Errors
## Notes
## Quick Reference
## FAQ
## Glossary
```

---

### 2. Answer Directness (BLUF) (Weight: High)

**What to look for:**
- **Bottom Line Up Front**: the very first sentence beneath any H2 or H3 must be a direct, declarative answer to the assumed question of that section — LLMs extract opening sentences preferentially, so burying the answer wastes the highest-value slot on the page
- Summary section that answers "what does this do?" with a prose sentence followed by 3-4 bullet points
- No rhetorical warm-up sentences before the actual answer

**Scoring:**
- **10/10**: Every section opens with a declarative answer; strong Summary block (prose + bullets)
- **8-9/10**: Summary is strong, but some H2s start with preamble or rhetorical context
- **6-7/10**: Answers exist but are buried two or more sentences deep
- **<6/10**: Ambiguous openings; fails to define the core concept up front

**Required Summary format:**
```markdown
## Summary

[1-2 sentence declarative summary of what this page accomplishes]

- [Bullet 1: Core action or capability]
- [Bullet 2: Key technology or instruction used]
- [Bullet 3: Version or compatibility note]
- [Bullet 4: Key constraint or limitation]
```

**BLUF example:**

✅ Good — declarative answer is the first sentence:
```markdown
## Transfer a Compressed NFT

The `transferV2` instruction moves ownership from one wallet to another...
```

❌ Poor — answer is buried behind context-setting:
```markdown
## Transfer a Compressed NFT

When working with compressed NFTs on Bubblegum V2, there are several things
to consider. The system uses a leaf-based model which means...
```

---

### 3. Extractability (Weight: High)

**What to look for:**
- Code blocks with titles (` ```lang {% title="filename" %} `)
- Tables for reference data (program IDs, versions, costs)
- Multi-language examples (TypeScript + Rust) via dialect-switcher
- Copy-paste-ready, self-contained snippets
- **Semantic Diagramming**: architecture diagrams must have highly descriptive `alt` text or a `<figcaption>` element — a diagram with no text description is invisible to any LLM or AI system

**Scoring:**
- **10/10**: All code titled, tables for data, multi-language support, all diagrams described
- **8-9/10**: Most code titled, some tables, minor diagram accessibility gaps
- **6-7/10**: Code exists but poorly labelled, diagrams have no descriptions
- **<6/10**: Inline code only, naked diagrams, no structural extractability

**Example (10/10):**
```markdown
| Program | Address |
|---------|---------|
| MPL-Bubblegum | `BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY` |

{% dialect-switcher title="Mint a Compressed NFT" %}
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

### 4. Constraint Clarity (Weight: Medium-High)

**What to look for:**
- Caveats, boundaries, and unsupported features are clearly stated
- Key constraints are placed inline where they are relevant using semantic callouts — not aggregated into a separate section readers have to seek out
- A Notes section consolidates any remaining caveats at the end of the page
- Version constraints and compatibility notes stated in context

> **Note on "Out of Scope" sections:** Dedicated `## Out of Scope` headings are no longer recommended. They disrupt page flow, front-load negative information, and pull readers away from the page's purpose. Use inline callouts and a Notes section instead.

**Scoring:**
- **10/10**: Boundaries perfectly defined via inline callouts and a consolidated Notes section — zero friction for human readers
- **8-9/10**: Constraints exist but are slightly disruptive or buried in plain prose
- **6-7/10**: Implicit constraints only — reader has to infer what isn't supported
- **<6/10**: Fails to warn users of limitations or anti-patterns

**Required elements:**
```markdown
{% callout type="note" %}
This only applies to private trees. Public trees allow anyone to mint
without the tree delegate's signature.
{% /callout %}

## Notes
- [Important caveat or boundary condition]
- [Version constraint or compatibility note]
- [Security or correctness consideration]
```

---

### 5. Anti-Hallucination (Weight: High)

**What to look for:**
- **llms.txt Alignment**: terminology must strictly match the canonical definitions in `/public/llms.txt`. Contradictions between a page and `llms.txt` are anti-hallucination failures — LLMs will produce conflicting answers depending on which source they retrieve
- Explicit version numbers with "tested with" statements
- Specific error messages paired with exact solutions
- Disambiguation from similar concepts (e.g., "Bubblegum V2, not Bubblegum V1", "SPL Token, not Token-2022")
- No ambiguous language ("might work", "should be fine")

**Scoring:**
- **10/10**: Perfect llms.txt alignment, explicit versions, exact errors documented, proactive disambiguation
- **9/10**: Minor ambiguity in one non-critical area
- **7-8/10**: Terminology drifts slightly from canonical definitions; some versions missing
- **<7/10**: Vague or contradicts llms.txt — will cause LLM hallucination

**Example (10/10):**
```markdown
| Tool | Version |
|------|---------|
| mpl-bubblegum | 5.x |
| @metaplex-foundation/umi | 1.x |

*Applies to Bubblegum V2 (MPL-Bubblegum). Not compatible with Bubblegum V1 trees.*
```

**llms.txt alignment check — verify before publishing:**
- Product names and status labels match (Core = recommended, Token Metadata = legacy)
- Key distinctions in `llms.txt` "Important Distinctions" section are not contradicted
- Version or feature claims do not conflict with the site-level canonical definitions

---

### 6. Authority Signals (Weight: Medium)

**What to look for:**
- Maintainer/organisation attribution
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
*Maintained by Metaplex Foundation · Last verified February 2026 · Applies to MPL-Bubblegum 5.x*
```

**To reach 10/10, add:**
```markdown
[View source on GitHub](https://github.com/metaplex-foundation/mpl-bubblegum)
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

| Item | Value |
|------|-------|
| Program | `BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY` |
| JS SDK | `@metaplex-foundation/mpl-bubblegum` |
| Source | [GitHub](https://github.com/metaplex-foundation/mpl-bubblegum) |
```

---

### 8. FAQ Quality (Weight: Context-Dependent)

**What to look for:**
- Real questions developers actually ask — no quotas, no filler
- Clear, direct answers without marketing language
- Cost/pricing/compute information where relevant
- Comparison questions ("What's the difference between X and Y?")
- *Exemption*: Pure API/CLI reference pages typically do not need a FAQ

**Scoring:**
- **10/10**: Strictly targets high-value queries (costs, comparisons, edge cases) — zero content that repeats the main text
- **8-9/10**: Good questions, but a few border on generic or restate the content
- **6-7/10**: Generic FAQ that adds no value ("What is Solana?")
- **<6/10**: Useless questions or formatting that breaks FAQPage schema
- **N/A**: Not applicable for this page type

**Example questions (10/10):**
- What's the difference between Bubblegum V1 and V2?
- How much does it cost to mint 1 million cNFTs?
- Can I use a V1 tree with V2 instructions?
- Why do I need a DAS API-compatible RPC?

---

### 9. Glossary (Weight: Context-Dependent)

**What to look for:**
- Table format (not prose definitions)
- Only terms strictly relevant to this page's context — no generic padding
- Concise definitions (one sentence each)
- Domain-specific terms and expanded acronyms (ATA, PDA, DAS, etc.)
- *Exemption*: Task-based tutorials and parameter-heavy reference pages rarely need a standalone glossary

**Scoring:**
- **10/10**: Table format, concise, strictly relevant — no filler terms that dilute signal density
- **8-9/10**: Good glossary, but includes overly generic terms
- **6-7/10**: Glossary exists but is formatted as prose or incomplete
- **<6/10**: Exists but poorly executed
- **N/A**: Not applicable for this page type

---

### 10. Human UX (Weight: Context-Dependent)

**What to look for:**
- Quick Start section with numbered steps
- Jump links to key sections
- "What You'll Build" callout at top
- Expected output examples
- Copy-paste-ready complete examples
- *Exemption*: Concept/architecture pages — no Quick Start expected

**Scoring:**
- **10/10**: Quick Start + jump links + callouts + full copy-paste examples
- **9/10**: Missing one element
- **7-8/10**: Basic UX, no quick start
- **<7/10**: Wall of text, poor navigation
- **N/A**: Not applicable for this page type

---

## Scoring Summary

Because page types vary, not all dimensions apply to every page. Score only applicable dimensions.

```
Overall GEO Score = (Sum of applicable scores / Total applicable points) × 100%
```

**Worked example:** A Reference page marks FAQ, Glossary, and Human UX as N/A. The remaining 7 dimensions are worth 70 points. The page scores 68/70. Final score: **97%**.

**Score Interpretation:**
- **95-100%**: Reference-grade, canonical source for LLMs
- **90-94%**: Excellent, minor improvements possible
- **80-89%**: Good, will be cited but may not be treated as the primary authority
- **70-79%**: Adequate, may cause partial hallucinations or fail complex query retrieval
- **<70%**: Needs significant structural and contextual work

---

## Template Checklist

### Required (All Pages)
- [ ] Frontmatter: title, metaTitle, description, keywords, about, proficiencyLevel
- [ ] Summary block: 1-2 declarative sentences + 3-4 bullet points (the page-level BLUF)
- [ ] Context-independent H2/H3 headers — no pronouns or shorthand requiring prior context
- [ ] First sentence under every H2 is a direct declarative answer (BLUF)
- [ ] Internal links to core concept pages on first mention of key terms
- [ ] Notes section consolidating caveats and compatibility notes
- [ ] Terminology verified against `/public/llms.txt`
- [ ] Authority signals: maintainer, last verified date, version range

### Conditional (By Page Type)
- [ ] "What You'll Build" callout — Tutorial pages
- [ ] Quick Start with numbered steps + jump links — Tutorial pages
- [ ] Prerequisites — Tutorial/Guide pages
- [ ] Tested Configuration table — Tutorial/Guide pages
- [ ] Common Errors section — Tutorial/Guide pages
- [ ] Quick Reference table — Reference/How-To/Overview pages
- [ ] FAQ (real queries only, zero filler) — Tutorial/Concept pages
- [ ] Glossary table (strictly relevant terms only) — Concept/Overview pages

### Content & Formatting
- [ ] All code blocks have `title="filename"` attribute
- [ ] Long code blocks use `showLineNumbers=true`
- [ ] Multi-language examples use dialect-switcher
- [ ] Expected output shown for commands
- [ ] Program IDs, dependencies, and costs are in tables
- [ ] Architecture diagrams have descriptive alt text or figcaption
- [ ] Inline callouts used for important constraints (not a separate Out of Scope section)

### Authority & Structured Data
- [ ] Last verified date in page body
- [ ] Link to source repository
- [ ] `faqs` frontmatter field mirrors FAQ section content
- [ ] `howToSteps` / `howToTools` present on tutorial pages
- [ ] `programmingLanguage` field set if page contains code

---

## Example Evaluation

**Page:** `/tokens/anchor/create-token`
**Page Type:** Tutorial / Guide
**Exemptions:** None

| Dimension | Score | Notes |
|-----------|-------|-------|
| Structure & Context Graphs | 10/10 | Clear hierarchy, all H3s use explicit nouns — perfect for RAG chunking; internal links to ATA and PDA concept pages present |
| Answer Directness (BLUF) | 10/10 | Strong Summary block; first sentence under every H2 is the direct answer |
| Extractability | 10/10 | Code blocks titled, TS/Rust dialect-switcher used, architecture diagram has full semantic alt text |
| Constraint Clarity | 10/10 | Constraints integrated via warning callouts and a Notes section — zero friction for human readers |
| Anti-Hallucination | 9.5/10 | Exact llms.txt alignment, explicit versions. Minor: could add "not Token-2022" disambiguation near the program ID |
| Authority Signals | 9.5/10 | Maintainer and verification date present. Missing source repo link |
| Quick Reference Density | 10/10 | Program IDs and minimum deps in extractable tables |
| FAQ Quality | 10/10 | 8 real developer questions, clear answers, includes cost estimates |
| Glossary | 10/10 | 10 domain-specific terms in table format, strictly relevant |
| Human UX | 9.5/10 | Quick Start + jump links present. Could benefit from a "copy full program" collapsible block |

**Overall GEO Score: 98.5%** *(98.5/100 applicable points)*

**Strengths:**
- BLUF formatting — LLMs can extract a correct answer from any isolated chunk
- RAG-safe headers — every H3 uses explicit nouns, no pronoun shorthand
- Dual-language PDA derivation — TypeScript and Rust in dialect-switcher
- Natural constraints — warnings are in semantic callouts, keeping flow smooth
- Common Errors section — pre-answers the top 3 developer issues

**Improvements Needed:**
1. Add a collapsible "Full Program" block with the complete `lib.rs` for easy copy
2. Add GitHub source repo link to Authority Signals
3. Add "not Token-2022" disambiguation near the program ID table

---

## JSON-LD Structured Data Specification

In addition to content quality, pages must include proper JSON-LD structured data in their frontmatter. This metadata is automatically converted to schema.org JSON-LD in the `<head>` section.

### Required Frontmatter Fields

```yaml
---
title: Page Title
metaTitle: Page Title | Product Name
description: Clear description of what this page covers
created: 'MM-DD-YYYY'
updated: 'MM-DD-YYYY'
keywords:
  - primary keyword
  - secondary keyword
about:
  - Main topic
  - Technology used
proficiencyLevel: Beginner | Intermediate | Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---
```

### Optional Fields (Context-Dependent)

**For How-To/Tutorial pages:**
```yaml
howToSteps:
  - Step 1 description
  - Step 2 description
howToTools:
  - Tool 1
```

**For pages with FAQ sections:**
```yaml
faqs:
  - q: Question?
    a: Answer.
```

### JSON-LD Schemas Generated

| Schema Type | When Generated | Key Fields |
|-------------|----------------|------------|
| **TechArticle** | All pages | @id, headline, keywords, about, proficiencyLevel, programmingLanguage, author, publisher, audience |
| **HowTo** | Pages with `howToSteps` | name, step[], tool[] |
| **FAQPage** | Pages with `faqs` | mainEntity[] with Question/Answer pairs |

### Best Practices

1. **Keywords as arrays**: Use YAML arrays, not comma-separated strings
2. **Proficiency levels**: Use exactly `Beginner`, `Intermediate`, or `Advanced`
3. **Programming languages**: Use standard names (`JavaScript`, `TypeScript`, `Rust`)
4. **FAQ quality**: Only include real questions — mirror the FAQ content section exactly
5. **HowTo steps**: One sentence each, 3-5 steps ideal
6. **Index pages**: May omit `programmingLanguage` if they contain no code

### Validation

1. Build the site: `pnpm build`
2. Check page HTML source for `<script type="application/ld+json">`
3. Use [Google's Rich Results Test](https://search.google.com/test/rich-results) to validate
4. Use [Schema.org Validator](https://validator.schema.org/) for detailed checks

---

## Usage Instructions

When evaluating a page, provide output in this format:

```
## GEO/LLM Scorecard

**Page:** [URL or path]
**Page Type:** [Tutorial / Concept / Reference / Overview]
**Exemptions:** [List any N/A dimensions and why]

| Dimension | Score | Notes |
|-----------|-------|-------|
| Structure & Context Graphs | X/10 | [Brief note] |
| Answer Directness (BLUF) | X/10 | [Brief note] |
| Extractability | X/10 or N/A | [Brief note] |
| Constraint Clarity | X/10 | [Brief note] |
| Anti-Hallucination | X/10 | [Brief note] |
| Authority Signals | X/10 | [Brief note] |
| Quick Reference Density | X/10 or N/A | [Brief note] |
| FAQ Quality | X/10 or N/A | [Brief note] |
| Glossary | X/10 or N/A | [Brief note] |
| Human UX | X/10 or N/A | [Brief note] |

**Overall GEO Score: X%** (X/Y applicable points)

**Strengths:**
- [Bullet points]

**Improvements Needed:**
- [Numbered list with specific actions]
```
