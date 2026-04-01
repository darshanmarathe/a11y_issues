# Accessibility Issues in Angular Todo App

This document lists all intentional accessibility issues that have been added to the Angular Todo application for testing and learning purposes.

---

## Summary

| Issue Category | Count | Severity |
|---------------|-------|----------|
| Missing ARIA Labels | 8 | High |
| Missing Form Associations | 12 | High |
| Keyboard Navigation Issues | 4 | High |
| Color Contrast Issues | 3 | Medium |
| Missing Alt Text | 0 | N/A |
| Focus Management Issues | 3 | High |
| Semantic HTML Issues | 5 | Medium |
| Link Issues | 2 | Medium |

---

## Detailed Issues

### 1. Missing ARIA Labels

#### Issue #1: Icon-only buttons lack accessible names
**Location:** `kanban-board.component.html`, `projects-master.component.html`
```html
<button class="btn-icon" (click)="openEditModal(todo)">
  <i class="bi bi-pencil"></i>
</button>
<button class="btn-icon btn-icon-danger" (click)="deleteTodo(todo)">
  <i class="bi bi-trash"></i>
</button>
```
**Problem:** Buttons with only icons have no accessible name for screen readers.
**WCAG:** 4.1.2 Name, Role, Value (Level A)
**Fix:** Add `aria-label="Edit todo"` or `aria-label="Delete todo"`

#### Issue #2: Close button in modal has no accessible name
**Location:** `todo-form-modal.component.html`, `projects-master.component.html`
```html
<button class="btn-close" (click)="onCancel()">×</button>
```
**Problem:** The "×" character may not be announced meaningfully by screen readers.
**WCAG:** 4.1.2 Name, Role, Value (Level A)
**Fix:** Add `aria-label="Close modal"`

#### Issue #3: Add button lacks context
**Location:** All components
```html
<button class="btn btn-primary" (click)="openAddModal()">
  <i class="bi bi-plus-lg"></i> Add Todo
</button>
```
**Problem:** When there are multiple "Add" buttons, screen reader users cannot distinguish them.
**WCAG:** 2.4.4 Link Purpose (Level A)
**Fix:** Make button text more descriptive, e.g., "Add New Todo"

---

### 2. Missing Form Label Associations

#### Issue #4: Labels not associated with inputs
**Location:** `todo-form-modal.component.html`, `projects-master.component.html`
```html
<div class="form-group">
  <label>Title <span style="color: red">*</span></label>
  <input type="text" class="form-control" [(ngModel)]="formData().title">
</div>
```
**Problem:** Labels are not programmatically associated with their inputs (missing `for` attribute and input `id`).
**WCAG:** 1.3.1 Info and Relationships (Level A), 4.1.2 Name, Role, Value (Level A)
**Fix:** Add `for="title"` to label and `id="title"` to input

#### Issue #5: Missing labels for all form fields
**Location:** `todo-form-modal.component.html`
- Title input - no id/for association
- Description textarea - no id/for association
- Status select - no id/for association
- Priority select - no id/for association
- Date input - no id/for association
- User select - no id/for association
- Link input - no id/for association
- Project checkboxes - no id/for association

**WCAG:** 1.3.1 Info and Relationships (Level A)

#### Issue #6: Checkbox labels not properly structured
**Location:** `kanban-board.component.html`
```html
<label>
  <input type="checkbox" [checked]="todo.isCompleted" (change)="toggleComplete(todo)">
  Done
</label>
```
**Problem:** While technically valid, custom checkbox styling with `.checkmark` span may not be accessible.
**WCAG:** 1.3.1 Info and Relationships (Level A)
**Fix:** Use proper ARIA attributes or native checkbox styling

#### Issue #7: Required field indicators not programmatically defined
**Location:** All form modals
```html
<label>Title <span style="color: red">*</span></label>
```
**Problem:** Required status indicated only by color and visual asterisk, not programmatically.
**WCAG:** 1.3.1 Info and Relationships (Level A), 3.3.2 Labels or Instructions (Level A)
**Fix:** Add `aria-required="true"` and `aria-invalid` when validation fails

---

### 3. Keyboard Navigation Issues

#### Issue #8: Drag and drop not keyboard accessible
**Location:** `kanban-board.component.html`
```html
<div class="kanban-card"
     draggable="true"
     (dragstart)="onDragStart(todo)"
     (dragover)="onDragOver($event)"
     (drop)="onDrop($event, status)">
```
**Problem:** Drag and drop functionality has no keyboard equivalent.
**WCAG:** 2.1.1 Keyboard (Level A), 2.5.1 Pointer Gestures (Level A)
**Fix:** Provide keyboard controls (e.g., arrow keys + Enter/Space) to move cards

#### Issue #9: Modal focus not managed
**Location:** All modals
**Problem:** 
- Focus not trapped inside modal when open
- Focus not returned to trigger button when modal closes
- No initial focus set on modal content
**WCAG:** 2.4.3 Focus Order (Level A), 3.2.1 On Focus (Level A)
**Fix:** Implement focus trap and focus management

#### Issue #10: No skip links
**Location:** `index.html`, app root
**Problem:** No skip navigation link for keyboard users to bypass repetitive content.
**WCAG:** 2.4.1 Bypass Blocks (Level A)
**Fix:** Add skip link at top of page

---

### 4. Color Contrast Issues

#### Issue #11: Low contrast required field indicator
**Location:** `todo-form-modal.component.html`, `projects-master.component.html`
```html
<span style="color: red">*</span>
```
**Problem:** Red asterisk may not have sufficient contrast ratio (4.5:1) against background.
**WCAG:** 1.4.3 Contrast (Minimum) (Level AA)
**Fix:** Use a darker red or additional indicator

#### Issue #12: Low contrast helper text
**Location:** `todo-form-modal.component.html`
```html
<div style="color: #999; font-size: 12px;">
  Fields marked with * are required
</div>
```
**Problem:** #999 gray on white background has contrast ratio of ~2.8:1 (fails 4.5:1 requirement).
**WCAG:** 1.4.3 Contrast (Minimum) (Level AA)
**Fix:** Use darker gray (#767676 or darker)

#### Issue #13: Color-only status indication
**Location:** `kanban-board.component.html`
```html
<span class="status-dot" [style.background-color]="statusConfig[status].color"></span>
<span class="priority-badge" [style.background-color]="priorityColors[todo.priority]">
```
**Problem:** Status and priority conveyed only by color.
**WCAG:** 1.4.1 Use of Color (Level A)
**Fix:** Add text labels or patterns in addition to color

---

### 5. Semantic HTML Issues

#### Issue #14: Missing landmark regions
**Location:** All components
**Problem:** No `<main>`, `<nav>`, `<header>`, `<footer>` landmarks used.
**WCAG:** 1.3.1 Info and Relationships (Level A)
**Fix:** Wrap content in appropriate landmark elements

#### Issue #15: Generic div used instead of semantic elements
**Location:** `kanban-board.component.html`
```html
<div>
  <div class="kanban-header">
```
**Problem:** Container uses `<div>` instead of semantic elements.
**WCAG:** 1.3.1 Info and Relationships (Level A)
**Fix:** Use `<main>`, `<section>`, `<article>` where appropriate

#### Issue #16: Heading hierarchy may be inconsistent
**Location:** All components
**Problem:** Heading levels may skip (h2 to h4) in card content.
**WCAG:** 1.3.1 Info and Relationships (Level A)
**Fix:** Ensure proper heading hierarchy

---

### 6. Link Issues

#### Issue #17: External links missing indicators
**Location:** `kanban-board.component.html`
```html
<a [href]="todo.link" target="_blank">
  <i class="bi bi-link-45deg"></i> Link
</a>
```
**Problem:** 
- Opens in new tab without warning
- Missing `rel="noopener noreferrer"` (security issue)
**WCAG:** 2.4.4 Link Purpose (Level A), 3.2.5 Change on Request (Level AAA)
**Fix:** Add visual indicator and `rel="noopener noreferrer"`

#### Issue #18: Link text not descriptive
**Location:** `kanban-board.component.html`
```html
<a [href]="todo.link" target="_blank">Link</a>
```
**Problem:** "Link" is not descriptive out of context.
**WCAG:** 2.4.4 Link Purpose (Level A)
**Fix:** Use descriptive text like "View attached resource"

---

### 7. Document Issues

#### Issue #19: Missing language attribute
**Location:** `index.html`
```html
<html>
```
**Problem:** No `lang` attribute on HTML element.
**WCAG:** 3.1.1 Language of Page (Level A)
**Fix:** Add `<html lang="en">`

#### Issue #20: Missing page title context
**Location:** `index.html`
**Problem:** Title "AngularTodoApp" doesn't indicate current page context.
**WCAG:** 2.4.2 Page Titled (Level A)
**Fix:** Update title dynamically based on route

---

### 8. Dynamic Content Issues

#### Issue #21: No live regions for dynamic updates
**Location:** All components
**Problem:** When todos/projects are added, updated, or deleted, screen reader users are not notified.
**WCAG:** 4.1.3 Status Messages (Level AA)
**Fix:** Add `aria-live="polite"` regions for announcements

#### Issue #22: No error messaging
**Location:** Form modals
**Problem:** Form validation errors not announced to screen readers.
**WCAG:** 3.3.1 Error Identification (Level A)
**Fix:** Add `aria-describedby` with error messages

---

## Testing Recommendations

### Automated Tools
1. **axe DevTools** - Browser extension for accessibility testing
2. **WAVE** - Web accessibility evaluation tool
3. **Lighthouse** - Built into Chrome DevTools
4. **Angular ESLint** - With accessibility rules

### Manual Testing
1. **Keyboard Navigation** - Test all functionality with Tab, Enter, Space, Escape
2. **Screen Reader Testing** - NVDA (Windows), JAWS (Windows), VoiceOver (Mac)
3. **Color Contrast** - Use contrast analyzer tools
4. **Focus Indicators** - Verify visible focus on all interactive elements

### Users to Test With
- Screen reader users
- Keyboard-only users
- Users with low vision
- Users with motor impairments

---

## Remediation Priority

### Critical (Fix Immediately)
1. Missing ARIA labels on icon buttons
2. Form label associations
3. Keyboard accessibility for drag-and-drop
4. Focus management in modals

### High (Fix Soon)
1. Color contrast issues
2. Skip links
3. External link indicators
4. Language attribute

### Medium (Plan to Fix)
1. Semantic HTML improvements
2. Live regions for dynamic content
3. Error messaging
4. Heading hierarchy

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Angular Accessibility Guide](https://angular.io/guide/accessibility)
- [WebAIM Checklist](https://webaim.org/standards/wcag/checklist)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
