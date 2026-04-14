# Research Page — Design System

> Agent reference file. Use this to stay consistent when adding new challenges to the `/research` page.
> Styles are defined in `research.css` — imported in `page.tsx`.

---

## File Structure

```
src/app/(public)/(with-back-button)/research/
├── page.tsx          ← Page component (all challenges rendered here)
├── research.css      ← Custom CSS classes for the research page
└── DESIGN_SYSTEM.md  ← This file
```

---

## Page Layout

```
┌─────────────────────────────────────────────────┐
│  Hero (gradient bg, title, subtitle)            │
├─────────────────────────────────────────────────┤
│  Table of Contents (floating card, -mt-8)       │
├─────────────────────────────────────────────────┤
│  Challenge N (article)                          │
│  ├── Challenge Header (number badge + title)    │
│  ├── Section: Challenge (red label)             │
│  ├── Section: Solution (green label)            │
│  ├── Section: Key Concepts (blue label)         │
│  ├── Section: Design Decisions (neutral label)  │
│  └── Section: Outcome (primary label)           │
├─────────────────────────────────────────────────┤
│  Challenge N+1 ...                              │
└─────────────────────────────────────────────────┘
```

---

## Adding a New Challenge

### 1. Add to Table of Contents

```tsx
<ol className="flex flex-wrap gap-3 text-sm font-medium text-[#2C2C2C]">
  <li>
    <a href="#challenge-1">1. MongoDB Transaction Integrity</a>
  </li>
  <li>
    <a href="#challenge-2">2. Your New Challenge Title</a>
  </li>
</ol>
```

### 2. Add Challenge Article

```tsx
<article id="challenge-N" className="max-w-5xl mx-auto px-6 lg:px-0 py-16">
  {/* Challenge Header */}
  <div className="flex items-center gap-4 mb-10">
    <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#853853] text-white text-lg font-extrabold shadow-md">
      N
    </span>
    <div>
      <h2 className="text-2xl lg:text-3xl font-bold text-[#2C2C2C]">
        Challenge Title
      </h2>
      <p className="text-sm text-[#2C2C2C]/60 mt-1">
        Tag &middot; Tag &middot; Tag
      </p>
    </div>
  </div>

  {/* Sections go here */}
</article>
```

### 3. Use the Standard Sections

Each challenge follows the same section pattern. Not all sections are required — use what fits.

---

## Section Labels

Every section starts with a label pill. Use `.section-label` as the base class.

| Variant             | Class modifier           | Color   | Usage                |
| ------------------- | ------------------------ | ------- | -------------------- |
| Challenge (default) | `.section-label`         | Red     | Problem description  |
| Solution            | `.section-label-success` | Green   | Fix / approach       |
| Key Concepts        | `.section-label-info`    | Blue    | Learnings / theory   |
| Design Decisions    | `.section-label-neutral` | Gray    | Architecture choices |
| Outcome             | `.section-label-outcome` | Primary | Results / metrics    |

```tsx
<section className="research-section mb-14">
  <div className="section-label section-label-success">
    <span className="material-symbols-outlined text-base">lightbulb</span>
    Solution
  </div>
  <div className="bg-white rounded-2xl shadow-sm p-8">{/* Content */}</div>
</section>
```

### Material Symbols used per section

| Section          | Icon             |
| ---------------- | ---------------- |
| Challenge        | `report_problem` |
| Solution         | `lightbulb`      |
| Key Concepts     | `school`         |
| Design Decisions | `architecture`   |
| Outcome          | `emoji_events`   |

---

## Problem Cards

A grid of problem cards for listing multiple issues.

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
  <div className="problem-card">
    <div className="problem-number">P1</div>
    <h4 className="font-bold text-[#2C2C2C] mb-2">Title</h4>
    <p className="text-sm text-[#2C2C2C]/70">
      Description with <code>inline code</code>.
    </p>
  </div>
</div>
```

---

## Code Blocks

Dark-themed code snippets with a header showing file name and before/after tag. Uses `dangerouslySetInnerHTML` for syntax highlighting with `<span>` token classes.

```tsx
<div className="code-block-wrapper">
  <div className="code-block-header">
    <span className="code-block-tag code-block-tag-before">Before</span>
    filename.ts
  </div>
  <pre
    className="code-block"
    dangerouslySetInnerHTML={{
      __html: `<span class="tk-kw">const</span> x = <span class="tk-str">"hello"</span>;`,
    }}
  />
</div>
```

| Tag class                | Color       | Usage         |
| ------------------------ | ----------- | ------------- |
| `.code-block-tag-before` | Light red   | Original code |
| `.code-block-tag-after`  | Light green | Updated code  |

### Syntax Token Classes (Material Palenight)

| Class     | Color     | Usage                                         |
| --------- | --------- | --------------------------------------------- |
| `.tk-kw`  | `#c792ea` | Keywords: `async`, `function`, `const`, `if`… |
| `.tk-fn`  | `#82aaff` | Function/method names when called             |
| `.tk-str` | `#c3e88d` | String literals                               |
| `.tk-cm`  | `#546e7a` | Comments (also italic)                        |
| `.tk-ty`  | `#ffcb6b` | Type annotations: `Promise`, `string`, etc.   |
| `.tk-ct`  | `#ff5370` | Constants: `null`, `true`, `false`, numbers   |

> **Important**: Use `class` (not `className`) inside `dangerouslySetInnerHTML` HTML strings. Escape `<` and `>` in code content as `&lt;` and `&gt;`.

---

## Flow Diagrams

Dark-themed vertical flow diagrams showing operation pipelines.

### Container variants

| Class                        | Background | Usage                    |
| ---------------------------- | ---------- | ------------------------ |
| `.diagram-container`         | `#1e1b2e`  | Default / "before" state |
| `.diagram-container-success` | `#0f291a`  | "After" / fixed state    |
| `.diagram-container-neutral` | `#1a1a2e`  | Informational diagrams   |

### Node variants

| Class                   | Border color | Usage                     |
| ----------------------- | ------------ | ------------------------- |
| `.diagram-node-start`   | White/20     | Entry point of the flow   |
| `.diagram-node-danger`  | Red/40       | Broken / problematic step |
| `.diagram-node-warning` | Amber/40     | Partially broken step     |
| `.diagram-node-success` | Green/40     | Correctly wired step      |
| `.diagram-node-commit`  | Green/60     | Final commit step         |

### Badge variants

| Class                    | Color       | Usage                         |
| ------------------------ | ----------- | ----------------------------- |
| `.diagram-badge-danger`  | Light red   | Error / missing functionality |
| `.diagram-badge-warning` | Light amber | Partial issue                 |
| `.diagram-badge-success` | Light green | Correct behavior              |

### Template

```tsx
<div className="diagram-container">
  <div className="diagram-flow">
    <div className="diagram-node diagram-node-start">Entry label</div>
    <div className="diagram-arrow">↓</div>
    <div className="diagram-node diagram-node-success">
      <div className="diagram-node-label">READ</div>
      functionName()
      <span className="diagram-badge-success">Explanation</span>
    </div>
    <div className="diagram-arrow">↓</div>
    <div className="diagram-node diagram-node-commit">COMMIT — description</div>
  </div>
</div>
```

---

## Snapshot Timeline

Dark-themed horizontal timeline showing document versions over time.

```tsx
<div className="diagram-container diagram-container-neutral">
  <div className="snapshot-timeline">
    <div className="timeline-row">
      <span className="timeline-label">T=-1</span>
      <div className="timeline-bar timeline-bar-past">Past version</div>
    </div>
    <div className="timeline-row timeline-row-active">
      <span className="timeline-label">T=0</span>
      <div className="timeline-bar timeline-bar-active">Snapshot here</div>
    </div>
    <div className="timeline-row">
      <span className="timeline-label">T=+1</span>
      <div className="timeline-bar timeline-bar-future">Invisible to tx</div>
    </div>
  </div>
</div>
```

| Bar class              | Style        | Usage                          |
| ---------------------- | ------------ | ------------------------------ |
| `.timeline-bar-past`   | Dim, solid   | Previous versions              |
| `.timeline-bar-active` | Green, solid | Current snapshot (highlighted) |
| `.timeline-bar-future` | Red, dashed  | Changes invisible to tx        |

---

## Scenario Cards

Side-by-side comparison cards for contrasting outcomes (e.g., failure vs success).

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="scenario-card scenario-card-danger">
    <div className="scenario-header">
      <span className="scenario-tag scenario-tag-danger">Case 1</span>
      <h4 className="font-bold text-[#2C2C2C]">Failure Scenario</h4>
    </div>
    <div className="scenario-timeline">
      <div className="scenario-step">T=0 → Normal step</div>
      <div className="scenario-step scenario-step-danger">T=1 → Problem</div>
    </div>
    <div className="scenario-outcome scenario-outcome-danger">
      <span className="material-symbols-outlined text-base">error</span>
      <span>Bad outcome description</span>
    </div>
  </div>
  <!-- Success card with scenario-card-success, scenario-tag-success, etc. -->
</div>
```

### Step variants

| Class                    | Background  | Usage              |
| ------------------------ | ----------- | ------------------ |
| `.scenario-step`         | Gray        | Neutral step       |
| `.scenario-step-danger`  | Light red   | Problem step       |
| `.scenario-step-info`    | Light blue  | Informational step |
| `.scenario-step-success` | Light green | Correct step       |

---

## Solution Steps

Numbered steps with a green circle badge.

```tsx
<div className="space-y-6">
  <div className="solution-step">
    <div className="solution-step-number">1</div>
    <div>
      <h4 className="font-bold text-[#2C2C2C] mb-1">Step title</h4>
      <p className="text-sm text-[#2C2C2C]/70">Description.</p>
    </div>
  </div>
</div>
```

---

## Concept Cards

Side-by-side concept comparison cards (e.g., reads vs writes).

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="concept-card concept-card-read">
    <div className="concept-card-header">
      <span className="material-symbols-outlined">visibility</span>
      <h4 className="font-bold">Concept A</h4>
    </div>
    <p className="text-sm text-[#2C2C2C]/70 mb-3">Description.</p>
    <div className="concept-code">code snippet</div>
  </div>
</div>
```

| Card variant          | Border color | Usage            |
| --------------------- | ------------ | ---------------- |
| `.concept-card-read`  | Blue/15      | Read operations  |
| `.concept-card-write` | Primary/15   | Write operations |

---

## Decision Cards

For listing design decisions with accept/reject icons.

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
  <div className="decision-card">
    <div className="decision-icon decision-icon-no">
      <span className="material-symbols-outlined">close</span>
    </div>
    <div>
      <h4 className="font-bold text-[#2C2C2C] text-sm mb-1">Rule</h4>
      <p className="text-xs text-[#2C2C2C]/60">Explanation.</p>
    </div>
  </div>
</div>
```

---

## Decision Tree

For visualizing decision logic with indented branches.

```tsx
<div className="decision-tree">
  <div className="tree-node">
    <span className="tree-question">Root question?</span>
    <div className="tree-branches">
      <div className="tree-branch">
        <span className="tree-label">Yes</span>
        <span className="tree-answer">Answer for yes.</span>
      </div>
      <div className="tree-branch">
        <span className="tree-label">No</span>
        <span className="tree-question-sub">Follow-up question?</span>
        <div className="tree-sub-branches">
          <div className="tree-branch">
            <span className="tree-label">Yes</span>
            <span className="tree-answer">Answer.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## Outcome Stats

Metric cards for the outcome section.

```tsx
<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
  <div className="outcome-stat">
    <div className="outcome-stat-value text-green-600">100%</div>
    <div className="outcome-stat-label">Metric description</div>
  </div>
</div>
```

---

## Outcome Items

Checkmark list for summarizing results.

```tsx
<div className="outcome-item">
  <span className="material-symbols-outlined text-green-600 text-xl">
    check_circle
  </span>
  <p className="text-sm text-[#2C2C2C]">
    <strong>Bold lead</strong> — rest of the description with{" "}
    <code>inline code</code>.
  </p>
</div>
```

---

## Inline Code

All `<code>` inside `.research-section` is automatically styled:

- Background: `rgba(133, 56, 83, 0.08)` (primary tint)
- Text color: `#853853`
- Font: monospace
- Padding: `0.125rem 0.375rem`
- Border-radius: `0.25rem`

No extra classes needed — just use `<code>` tags.

---

## Responsive Behavior

- Diagrams scroll horizontally on small screens (`overflow-x: auto`)
- Flow diagram nodes shrink font size on mobile
- Timeline rows stack vertically on `<640px`
- Cards go single-column on mobile via `grid-cols-1 md:grid-cols-*`
