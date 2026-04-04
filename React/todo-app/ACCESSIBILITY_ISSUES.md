# Accessibility Issues Summary

This document lists all the **intentionally introduced accessibility issues** in the Todo App for testing and educational purposes.

---

## 🔴 Critical Issues

### 1. Global Focus Outline Removed
- **File:** `src/index.css`
- **Issue:** `outline: none !important;` applied globally to all elements
- **Impact:** Keyboard users cannot see which element has focus
- **WCAG Violation:** [2.4.7 Focus Visible (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible)
- **Severity:** 🔴 Critical

### 2. Form Labels Removed
- **Files:** `src/components/TodoList.tsx`, `src/components/Dashboard.tsx`
- **Issue:** All `<label htmlFor="...">` replaced with `<span>` elements, `htmlFor` and `id` associations removed
- **Impact:** Screen reader users cannot associate form inputs with their labels
- **WCAG Violation:** [1.3.1 Info and Relationships (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships), [4.1.2 Name, Role, Value (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value)
- **Severity:** 🔴 Critical

---

## 🟠 Major Issues

### 3. Poor Color Contrast
- **File:** `src/index.css`
- **Issue:** 
  - Sidebar nav items: `rgba(255, 255, 255, 0.35)` on purple gradient (contrast ratio ~2.5:1, needs 4.5:1)
  - Edit button: `#a0aec0` on light gray, hover uses `#e2e8f0` on `#d4d8e0` (contrast ratio < 1.5:1)
  - DataTable headers: `#d4d8e0` text on purple gradient
- **Impact:** Users with low vision or color blindness cannot read text
- **WCAG Violation:** [1.4.3 Contrast (Minimum) (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
- **Severity:** 🟠 Major

### 4. Keyboard Navigation Broken
- **Files:** `src/components/Sidebar.tsx`, `src/components/Dashboard.tsx`, `src/components/KanbanBoard.tsx`
- **Issue:**
  - `tabIndex={-1}` added to draggable Kanban cards (removed from tab order)
  - `tabIndex={-1}` added to sidebar nav container
  - Edit buttons only visible on hover (`opacity-0 group-hover:opacity-100`), keyboard-only users cannot access them
- **Impact:** Keyboard-only and screen reader users cannot navigate or interact with cards
- **WCAG Violation:** [2.1.1 Keyboard (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/keyboard), [2.4.3 Focus Order (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/focus-order)
- **Severity:** 🟠 Major

### 5. Missing Alt Text on Images
- **Files:** `src/components/TodoList.tsx`, `src/components/Dashboard.tsx`, `src/components/KanbanBoard.tsx`, `src/components/Sidebar.tsx`
- **Issue:** All `<img>` tags have `alt` attribute removed
- **Impact:** Screen reader users receive no information about images
- **WCAG Violation:** [1.1.1 Non-text Content (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content)
- **Severity:** 🟠 Major

### 6. Semantic Heading Structure Removed
- **Files:** `src/components/TodoList.tsx`, `src/components/KanbanBoard.tsx`, `src/components/ProjectsMaster.tsx`, `src/components/Dashboard.tsx`
- **Issue:** All `<h1>` and `<h2>` elements replaced with `<div>` elements
- **Impact:** Screen reader users cannot navigate page structure using headings
- **WCAG Violation:** [1.3.1 Info and Relationships (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships), [2.4.6 Headings and Labels (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels)
- **Severity:** 🟠 Major

---

## 🟡 Moderate Issues

### 7. Improper Focus Management
- **File:** `src/components/TodoList.tsx`
- **Issue:** After saving a todo, focus is sent to `document.body` instead of remaining on a meaningful element or the save button
- **Impact:** Keyboard users lose their place and must re-navigate from the top
- **WCAG Violation:** [2.4.3 Focus Order (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/focus-order)
- **Severity:** 🟡 Moderate

### 8. Drag-and-Drop Not Keyboard Accessible
- **Files:** `src/components/Dashboard.tsx`, `src/components/KanbanBoard.tsx`
- **Issue:** Kanban columns use HTML5 native drag-and-drop (`draggable`, `onDragStart`, `onDrop`) with no keyboard alternative
- **Impact:** Keyboard-only users cannot move tasks between columns
- **WCAG Violation:** [2.1.1 Keyboard (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/keyboard), [2.5.1 Pointer Gestures (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures)
- **Severity:** 🟡 Moderate

### 9. Auto-Refreshing Content Without Warning
- **File:** `src/components/TodoList.tsx`
- **Issue:** `setInterval` fetches todos every 5 seconds and auto-scrolls to top without user action or `aria-live` announcement
- **Impact:** Screen reader users get interrupted during reading; focus may jump unexpectedly
- **WCAG Violation:** [4.1.3 Status Messages (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)
- **Severity:** 🟡 Moderate

### 10. Color-Only Indicators for Status/Priority
- **File:** `src/components/TodoList.tsx`
- **Issue:** Status and priority columns in DataTable display only colored shapes (`border-round`, `border-circle`) with no text content
- **Impact:** Users with color blindness or screen readers cannot distinguish status/priority
- **WCAG Violation:** [1.4.1 Use of Color (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color)
- **Severity:** 🟡 Moderate

---

## 📋 Quick Reference Table

| # | Issue | Type | Severity | File(s) |
|---|-------|------|----------|---------|
| 1 | Global focus outline removed | Visual/Focus | 🔴 Critical | `index.css` |
| 2 | Form labels removed | Form/Aria | 🔴 Critical | `TodoList.tsx`, `Dashboard.tsx` |
| 3 | Poor color contrast | Visual/Color | 🟠 Major | `index.css` |
| 4 | Keyboard navigation broken | Keyboard | 🟠 Major | `Sidebar.tsx`, `Dashboard.tsx`, `KanbanBoard.tsx` |
| 5 | Missing alt text on images | Images | 🟠 Major | All components |
| 6 | Semantic headings removed | Structure | 🟠 Major | All page components |
| 7 | Improper focus management | Focus | 🟡 Moderate | `TodoList.tsx` |
| 8 | Drag-and-drop not keyboard accessible | Keyboard | 🟡 Moderate | `Dashboard.tsx`, `KanbanBoard.tsx` |
| 9 | Auto-refresh without warning | Dynamic Content | 🟡 Moderate | `TodoList.tsx` |
| 10 | Color-only status/priority indicators | Color | 🟡 Moderate | `TodoList.tsx` |

---

## 🛠️ How to Fix

### Issue 1: Restore focus outlines
```css
/* Remove this from index.css */
* {
  outline: none !important;
}

/* Replace with focus-visible for visible outlines */
*:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}
```

### Issue 2: Restore form labels
```tsx
// Change this:
<span className="font-semibold block mb-2">Title *</span>
<InputText value={formData.title} onChange={...} />

// Back to:
<label htmlFor="title" className="font-semibold block mb-2">Title *</label>
<InputText id="title" value={formData.title} onChange={...} />
```

### Issue 3: Improve contrast
```css
.nav-item {
  color: rgba(255, 255, 255, 0.85); /* Was 0.35 */
}

.edit-btn:hover {
  color: #ffffff !important; /* Not #e2e8f0 */
}
```

### Issue 4: Enable keyboard navigation
```tsx
// Remove tabIndex={-1} from draggable items
<div draggable onDragStart={...}>

// Make edit buttons accessible
<button onClick={...} aria-label="Edit todo">
  <i className="pi pi-pencil" />
</button>
```

### Issue 5: Add alt text
```tsx
<img src={user.avatar} alt={user.name} className="w-1rem h-1rem border-circle" />
<img src="https://i.pravatar.cc/150?u=1" alt="John Doe avatar" />
```

### Issue 6: Restore semantic headings
```tsx
// Change this:
<div className="text-3xl font-bold">Dashboard</div>

// Back to:
<h1 className="text-3xl font-bold">Dashboard</h1>
```

### Issue 7: Proper focus management
```tsx
// Focus a meaningful element after save
const saveButton = document.querySelector('.save-button');
saveButton?.focus();
```

### Issue 8: Add keyboard alternative to drag-and-drop
```tsx
// Add dropdown or buttons to change status
<Dropdown 
  value={todo.status} 
  options={statusOptions} 
  onChange={(e) => updateStatus(todo.id, e.value)}
  aria-label={`Change status for ${todo.title}`}
/>
```

### Issue 9: Add aria-live for auto-refresh
```tsx
<div aria-live="polite" aria-atomic="true">
  {todos.length} tasks loaded
</div>
```

### Issue 10: Add text to color indicators
```tsx
<Tag value={rowData.status} severity={statusColorMap[rowData.status]} />
// Instead of just colored spans
```

---

## 📚 WCAG Guidelines Referenced

- **Level A:** 1.1.1, 1.3.1, 2.1.1, 2.4.3, 2.5.1, 4.1.2
- **Level AA:** 1.4.1, 1.4.3, 2.4.6, 2.4.7, 4.1.3

---

## 🎯 Testing Tools

To identify these issues, use:
- **axe DevTools** (browser extension)
- **Lighthouse** (Chrome DevTools)
- **WAVE** (Web Accessibility Evaluation Tool)
- **Keyboard-only navigation testing**
- **Screen readers:** NVDA (Windows), JAWS, VoiceOver (Mac)
