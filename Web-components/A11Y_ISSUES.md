# Accessibility (a11y) Issues

This document summarizes intentional accessibility issues added to the TodoApp for training and testing purposes.

---

## Summary Table

| # | Component | Issue | WCAG Criterion | Severity |
|---|-----------|-------|----------------|----------|
| 1 | Sidebar | Navigation links replaced with non-semantic `<div>` elements | 1.3.1 Info & Relationships | **Critical** |
| 2 | Sidebar | Missing `aria-current="page"` on active nav link | 4.1.2 Name, Role, Value | **Major** |
| 3 | Sidebar | App title changed from `<h1>` to `<div>` (lost heading semantics) | 1.3.1 Info & Relationships | **Critical** |
| 4 | Kanban Board | Cards use `onclick` inline handlers instead of proper button/role | 4.1.2 Name, Role, Value | **Critical** |
| 5 | Kanban Board | Column titles changed from `<h3>` to `<div>` (lost heading structure) | 1.3.1 Info & Relationships | **Major** |
| 6 | Kanban Board | Drag-and-drop has no keyboard alternative | 2.1.1 Keyboard | **Critical** |
| 7 | Kanban Board | Cards lack `role="button"` and `tabindex="0"` | 4.1.2 Name, Role, Value | **Major** |
| 8 | Kanban Board | No `aria-grabbed` / `aria-dropeffect` on drag items | 4.1.2 Name, Role, Value | **Moderate** |
| 9 | Todo Modal | Modal title changed from `<h3>` to `<div>` | 1.3.1 Info & Relationships | **Major** |
| 10 | Todo Modal | No `role="dialog"` or `aria-modal="true"` on modal | 4.1.2 Name, Role, Value | **Critical** |
| 11 | Todo Modal | Missing `aria-labelledby` linking modal to title | 4.1.2 Name, Role, Value | **Major** |
| 12 | Todo Modal | No focus trap — focus can leave modal | 2.4.3 Focus Order | **Critical** |
| 13 | Todo Modal | No focus restoration on close (focus not returned to trigger) | 2.4.3 Focus Order | **Major** |
| 14 | Todo Modal | Close button lacks `aria-label="Close"` | 4.1.2 Name, Role, Value | **Moderate** |
| 15 | Bar Chart | SVG lacks `<title>` and `<desc>` elements | 1.1.1 Non-text Content | **Major** |
| 16 | Bar Chart | SVG has no `role="img"` or `aria-label` | 4.1.2 Name, Role, Value | **Major** |
| 17 | Bar Chart | Bars lack `role="graphics-symbol"` and `aria-label` | 1.1.1 Non-text Content | **Major** |
| 18 | Pie Chart | SVG lacks `<title>` and `<desc>` elements | 1.1.1 Non-text Content | **Major** |
| 19 | Pie Chart | SVG has no `role="img"` or `aria-label` | 4.1.2 Name, Role, Value | **Major** |
| 20 | Pie Chart | Pie slices lack `role="graphics-symbol"` and `aria-label` with data | 1.1.1 Non-text Content | **Major** |
| 21 | Donut Chart | SVG lacks `<title>` and `<desc>` elements | 1.1.1 Non-text Content | **Major** |
| 22 | Donut Chart | SVG has no `role="img"` or `aria-label` | 4.1.2 Name, Role, Value | **Major** |
| 23 | Donut Chart | Slices lack `role="graphics-symbol"` and `aria-label` with data | 1.1.1 Non-text Content | **Major** |
| 24 | Todos Page | Filter `<select>` elements have no associated `<label>` | 1.3.1 Info & Relationships | **Critical** |
| 25 | Todos Page | Table lacks `<caption>` describing its content | 1.3.1 Info & Relationships | **Moderate** |
| 26 | Todos Page | Action buttons lack `aria-label` (e.g. "Edit Todo: {title}") | 4.1.2 Name, Role, Value | **Major** |
| 27 | Projects Page | Modal lacks `role="dialog"` and `aria-modal="true"` | 4.1.2 Name, Role, Value | **Critical** |
| 28 | Projects Page | Modal title uses `<h3>` but no `aria-labelledby` connection | 4.1.2 Name, Role, Value | **Major** |
| 29 | Projects Page | No focus trap in project modal | 2.4.3 Focus Order | **Critical** |
| 30 | Projects Page | Close button lacks `aria-label` | 4.1.2 Name, Role, Value | **Moderate** |

---

## Issues by WCAG Principle

### Perceivable (Principle 1)

| Issue | Description |
|-------|-------------|
| 1.1.1 Non-text Content | Chart SVGs lack text alternatives (`<title>`, `<desc>`, `aria-label`) |
| 1.3.1 Info & Relationships | Heading elements replaced with `<div>` in sidebar title, kanban columns, modal title |
| 1.3.1 Info & Relationships | Navigation structure changed from `<nav>` + `<a>` to `<div>` elements |
| 1.3.1 Info & Relationships | Form `<select>` elements missing associated `<label>` elements |
| 1.3.1 Info & Relationships | Data table lacks `<caption>` |

### Operable (Principle 2)

| Issue | Description |
|-------|-------------|
| 2.1.1 Keyboard | Drag-and-drop cards have no keyboard alternative |
| 2.4.3 Focus Order | Modals have no focus trap — Tab key can move focus behind modal |
| 2.4.3 Focus Order | Focus not restored to trigger element when modal closes |

### Understandable (Principle 3)

_No specific issues in this category._

### Robust (Principle 4)

| Issue | Description |
|-------|-------------|
| 4.1.2 Name, Role, Value | Interactive `<div>` elements lack proper ARIA roles and `tabindex` |
| 4.1.2 Name, Role, Value | Modal elements lack `role="dialog"` and `aria-modal="true"` |
| 4.1.2 Name, Role, Value | Buttons and controls lack descriptive `aria-label` |
| 4.1.2 Name, Role, Value | SVG charts lack `role="img"` and descriptive labels |

---

## Files Modified

| File | Issues Introduced |
|------|-------------------|
| `src/components/sidebar.component.js` | 1, 2, 3 |
| `src/components/kanban-board.component.js` | 4, 5, 6, 7, 8 |
| `src/components/todo-modal.component.js` | 9, 10, 11, 12, 13, 14 |
| `src/components/bar-chart.component.js` | 15, 16, 17 |
| `src/components/pie-chart.component.js` | 18, 19, 20 |
| `src/components/donut-chart.component.js` | 21, 22, 23 |
| `src/pages/todos.page.js` | 24, 25, 26 |
| `src/pages/projects.page.js` | 27, 28, 29, 30 |

---

## Severity Distribution

- **Critical**: 10 issues
- **Major**: 16 issues
- **Moderate**: 4 issues

---

## Recommended Fixes (High-Level)

1. **Restore semantic HTML** — Replace `<div>` navigation items with `<a>`, restore `<h1>`/`<h3>` headings
2. **Add ARIA roles and states** — `role="dialog"`, `aria-modal="true"`, `aria-current="page"`, `role="button"`, `tabindex="0"`
3. **Implement focus management** — Focus traps in modals, focus restoration on close
4. **Add keyboard support** — Keyboard handlers for drag-and-drop card movement
5. **Add form labels** — Associate `<label>` elements with all form controls
6. **Add SVG accessibility** — `<title>`, `<desc>`, `role="img"`, `aria-label` on all chart SVGs
7. **Add descriptive labels** — `aria-label` on icon-only buttons, action buttons with context
