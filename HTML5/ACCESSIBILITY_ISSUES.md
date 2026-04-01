# Accessibility Issues intentionally added for testing

This document lists all the accessibility (a11y) issues that have been intentionally added to the application for testing purposes.

## 📄 HTML Structure Issues (index.html)

| Issue | Location | Description |
|-------|----------|-------------|
| ❌ Missing skip link | `<body>` | No skip navigation link for keyboard users |
| ❌ Missing meta description | `<head>` | No `<meta name="description">` for screen readers |
| ❌ Missing main landmark | Content wrapper | Should use `<main>` instead of `<div>` |
| ❌ Div instead of h1 | `.app-title` | Using `<div>` instead of `<h1>` for page title |
| ❌ Toolbar without role | `.toolbar` | Missing `role="toolbar"` and `aria-label` |
| ❌ Emoji-only buttons | Toolbar buttons | No accessible names for icon buttons |
| ❌ Modal without ARIA | `#todo-form-modal` | Missing `role="dialog"`, `aria-modal`, `aria-labelledby` |

## 📋 Kanban Board Issues (src/components/kanban.js)

| Issue | Location | Description |
|-------|----------|-------------|
| ❌ No role on cards | `.kanban-card` | Using `<div>` without `role="article"` or `role="button"` |
| ❌ No aria-label on cards | `.kanban-card` | Screen readers can't understand card content |
| ❌ Drag without keyboard | Card interaction | No keyboard alternative for drag-and-drop |
| ❌ Link with emoji only | Card link | `🔗` without accessible text |
| ❌ Color-only indicators | Priority badges | Priority shown only by color, no text alternative |
| ❌ Color-only status | Overdue dates | Red color without aria-label |
| ❌ No heading hierarchy | Column headers | Using `<div>` instead of `<h2>`-`<h3>` |
| ❌ No aria-live region | Column content | Dynamic updates not announced |
| ❌ Drop zone not accessible | Column drop | No keyboard way to move items |
| ❌ No list semantics | Board container | Missing `role="list"` and `role="listitem"` |

## 📝 Form Issues (src/components/todoForm.js)

| Issue | Location | Description |
|-------|----------|-------------|
| ❌ No role="dialog" | Modal container | Missing dialog semantics |
| ❌ No aria-modal | Modal | Screen readers don't know it's modal |
| ❌ No aria-labelledby | Modal | Title not associated with modal |
| ❌ Labels without for | Form labels | `<label>` not linked to inputs via `for` attribute |
| ❌ No aria-required | Required fields | Missing `aria-required="true"` on title |
| ❌ No aria-describedby | Error messages | Errors not associated with inputs |
| ❌ Alert for errors | Validation | Using `alert()` instead of inline errors |
| ❌ No focus trap | Modal | Focus can escape modal |
| ❌ No focus management | Open/Close | Focus not returned to trigger element |
| ❌ No keyboard close | Modal | Can't close with Escape key |

## 📊 Table Issues (src/components/projectsMaster.js)

| Issue | Location | Description |
|-------|----------|-------------|
| ❌ No table caption | `<table>` | Missing `<caption>` for table purpose |
| ❌ No scope on th | `<th>` elements | Missing `scope="col"` attributes |
| ❌ Div instead of heading | Modal title | Using `<div>` instead of `<h2>` |
| ❌ Icon button only | Close button | `×` without accessible name |
| ❌ Generic button labels | Edit/Delete | "Edit" buttons not differentiated |
| ❌ No aria-label on actions | Action buttons | Missing context for which project |
| ❌ Alert for confirmation | Delete action | Using `confirm()` instead of accessible dialog |

## 🎨 CSS Issues (src/styles.css)

| Issue | Location | Description |
|-------|----------|-------------|
| ❌ Focus outline removed | `*:focus` | Global `outline: none` kills keyboard navigation |
| ❌ No focus visible | Form inputs | No `:focus-visible` styles |
| ❌ Low contrast text | `.text-gray-500` | Gray text may not meet WCAG contrast |

## ♿ WCAG 2.1 Violations Summary

### Level A Violations
- 1.1.1 Non-text Content (emoji-only buttons/links)
- 1.3.1 Info and Relationships (labels not associated)
- 1.3.2 Meaningful Sequence (heading hierarchy)
- 2.1.1 Keyboard (drag-and-drop only)
- 2.4.1 Bypass Blocks (no skip link)
- 2.4.3 Focus Order (no focus management)
- 4.1.2 Name, Role, Value (missing ARIA attributes)

### Level AA Violations
- 1.4.3 Contrast (Minimum) (gray text colors)
- 2.4.7 Focus Visible (outline removed)
- 3.3.1 Error Identification (alerts instead of inline)

### Level AAA Violations
- 1.4.6 Contrast (Enhanced)
- 2.4.8 Location

## 🧪 Testing Tools

Use these tools to detect the issues:

1. **Lighthouse** (Chrome DevTools)
   - Run Accessibility audit
   - Expected score: 40-60

2. **axe DevTools** (Browser extension)
   - Will detect most issues automatically

3. **WAVE** (wave.webaim.org)
   - Enter URL: http://localhost:3000

4. **Keyboard Testing**
   - Try Tab navigation - focus indicators missing
   - Try to move cards without mouse - impossible

5. **Screen Reader Testing**
   - NVDA (Windows) or VoiceOver (Mac)
   - Many elements will be announced incorrectly

## 📝 Notes

These issues are intentionally added for educational and testing purposes. In a production application, all of these should be fixed to ensure accessibility compliance.
