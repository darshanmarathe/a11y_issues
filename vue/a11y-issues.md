# Accessibility (a11y) Issues Summary

This document outlines intentional accessibility issues that have been introduced into the Vue Todo Application for testing and educational purposes.

## Issue Categories

### 1. Form Accessibility Issues

#### Issue #1: Missing Label-Input Associations
- **Location**: `Dashboard.vue` - Add/Edit Todo Dialog
- **Severity**: High
- **WCAG Criterion**: 1.3.1 Info and Relationships (Level A)
- **Description**: Several form inputs have `<label>` elements but the `for` attribute is missing or the `id` attribute is missing from the input, breaking the programmatic association between labels and inputs.
- **Affected Elements**:
  - Status select field
  - Priority select field
  - Project select field
  - User input field
  - Target Completion date field
  - Link URL field
- **Impact**: Screen readers cannot properly associate labels with their corresponding form fields, making it difficult for users to understand what information is required.
- **Fix**: Add matching `for` attributes on labels and `id` attributes on inputs.

#### Issue #2: Auto-focus Trapping
- **Location**: `Dashboard.vue` - Add/Edit Todo Dialog
- **Severity**: Medium
- **WCAG Criterion**: 2.4.3 Focus Order (Level A)
- **Description**: The dialog uses `autofocus` attribute which can cause unexpected focus behavior when the dialog opens, potentially trapping keyboard users.
- **Impact**: Keyboard users may experience confusing focus jumps when the dialog appears.
- **Fix**: Remove `autofocus` and implement proper focus management with focus trap.

### 2. Color and Visual Accessibility Issues

#### Issue #3: Color-Only Priority Indication
- **Location**: `Dashboard.vue` - Kanban Cards
- **Severity**: High
- **WCAG Criterion**: 1.4.1 Use of Color (Level A)
- **Description**: A small colored dot (`.color-indicator`) is used to indicate priority level without any text or icon alternative. Users must rely on color perception to understand priority.
- **Impact**: Users with color blindness or low vision cannot distinguish between priority levels.
- **Fix**: Add text labels or icons in addition to color indicators.

#### Issue #4: Inline Styles Bypassing Semantic Markup
- **Location**: `Dashboard.vue` - Stats Cards
- **Severity**: Medium
- **WCAG Criterion**: 1.3.1 Info and Relationships (Level A)
- **Description**: The first stat card uses inline styles instead of semantic classes, and the statistical information is presented using generic `<div>` elements with styled font sizes instead of proper heading hierarchy.
- **Impact**: Screen readers cannot properly interpret the hierarchical relationship between the stat number and its label.
- **Fix**: Use proper semantic elements and ensure consistent styling through classes.

### 3. Keyboard Navigation Issues

#### Issue #5: Missing Keyboard Event Handlers for Draggable Elements
- **Location**: `Dashboard.vue` - Kanban Cards
- **Severity**: Critical
- **WCAG Criterion**: 2.1.1 Keyboard (Level A), 2.1.2 No Keyboard Trap (Level A)
- **Description**: Kanban cards use HTML5 drag-and-drop API which is not accessible via keyboard. There are no alternative keyboard handlers (like arrow keys or keyboard shortcuts) to move cards between columns.
- **Impact**: Keyboard-only users and screen reader users cannot move cards between columns.
- **Fix**: Implement keyboard alternatives such as:
  - Arrow keys to navigate between cards
  - Enter/Space to select a card
  - Left/Right arrows to move selected card to adjacent columns
  - Provide visible keyboard instructions

#### Issue #6: Improper Tab Index Usage
- **Location**: `Dashboard.vue` - Kanban Cards
- **Severity**: Medium
- **WCAG Criterion**: 2.4.7 Focus Visible (Level AA)
- **Description**: Kanban cards have `tabindex="0"` added but there are no visible focus indicators when the cards receive focus via keyboard navigation.
- **Impact**: Keyboard users cannot see which card currently has focus.
- **Fix**: Add visible focus styles to `.todo-card:focus` in CSS.

### 4. ARIA and Semantic HTML Issues

#### Issue #7: Missing ARIA Roles and Labels
- **Location**: `Dashboard.vue` - Kanban Board
- **Severity**: High
- **WCAG Criterion**: 4.1.2 Name, Role, Value (Level A)
- **Description**: The Kanban board lacks proper ARIA roles (`role="region"`, `role="list"`, `role="listitem"`) and ARIA labels to describe the purpose of each column and the board as a whole.
- **Impact**: Screen reader users cannot understand the structure and purpose of the Kanban board layout.
- **Fix**: Add appropriate ARIA roles and labels:
  - `role="region"` and `aria-label` on the Kanban board container
  - `role="list"` on column content areas
  - `role="listitem"` on individual cards
  - `aria-describedby` to link column headers with their content

#### Issue #8: Missing Dialog Role and Focus Management
- **Location**: `Dashboard.vue` - Add/Edit Dialog
- **Severity**: Critical
- **WCAG Criterion**: 4.1.2 Name, Role, Value (Level A), 2.4.3 Focus Order (Level A)
- **Description**: The modal dialog lacks:
  - `role="dialog"` and `aria-modal="true"` attributes
  - `aria-labelledby` pointing to the dialog title
  - Focus trap to keep keyboard focus within the dialog
  - Return focus to triggering element when closed
- **Impact**: Screen reader users don't know a dialog has opened, and keyboard users can tab outside the dialog.
- **Fix**: Add proper ARIA dialog attributes and implement focus management.

#### Issue #9: Missing ARIA Live Regions for Dynamic Updates
- **Location**: `Dashboard.vue` - Kanban Board
- **Severity**: Medium
- **WCAG Criterion**: 4.1.3 Status Messages (Level AA)
- **Description**: When a todo card is dragged between columns, the status change and card count updates are not announced to screen readers.
- **Impact**: Screen reader users are not informed when todo items change status.
- **Fix**: Use `aria-live="polite"` regions to announce dynamic changes.

### 5. Interactive Element Issues

#### Issue #10: Buttons Without Accessible Names
- **Location**: `Sidebar.vue` - Toggle Button
- **Severity**: High
- **WCAG Criterion**: 4.1.2 Name, Role, Value (Level A)
- **Description**: The sidebar toggle button uses arrow characters (◀/▶) without any `aria-label` or alternative text to describe its purpose.
- **Impact**: Screen reader users hear only "left arrow" or "right arrow" without understanding the button's function.
- **Fix**: Add `aria-label` attribute with descriptive text like "Collapse sidebar" or "Expand sidebar".

#### Issue #11: Icon-Only Buttons Without Text Alternatives
- **Location**: `Todos.vue` - Action Buttons
- **Severity**: High
- **WCAG Criterion**: 1.1.1 Non-text Content (Level A)
- **Description**: Edit and Delete buttons use emoji icons (✏️/🗑️) with only `title` attributes for accessibility. The `title` attribute is not reliably accessible to screen readers.
- **Impact**: Screen reader users may not understand the purpose of these action buttons.
- **Fix**: Use `aria-label` attributes instead of or in addition to `title` attributes.

#### Issue #12: Checkbox Without Accessible Label
- **Location**: `Todos.vue` - Complete Checkbox
- **Severity**: High
- **WCAG Criterion**: 1.3.1 Info and Relationships (Level A), 4.1.2 Name, Role, Value (Level A)
- **Description**: The completion checkbox in the todos table has no associated `<label>` element, making it unclear what the checkbox controls.
- **Impact**: Screen reader users hear only "checkbox, not checked" without context.
- **Fix**: Add a `<label>` element or use `aria-label` attribute.

### 6. Content Structure Issues

#### Issue #13: Table Missing Accessible Caption
- **Location**: `Todos.vue` - Todos Table
- **Severity**: Medium
- **WCAG Criterion**: 1.3.1 Info and Relationships (Level A)
- **Description**: The todos table lacks a `<caption>` element to describe the table's purpose.
- **Impact**: Screen reader users cannot understand the context of the table when they encounter it.
- **Fix**: Add a `<caption>` element as the first child of the `<table>`.

#### Issue #14: Heading Hierarchy Issues
- **Location**: Multiple components
- **Severity**: Low
- **WCAG Criterion**: 1.3.1 Info and Relationships (Level A)
- **Description**: Some visual headings use styled `<div>` elements instead of proper heading tags (`<h1>` through `<h6>`), breaking the document outline.
- **Impact**: Screen reader users navigating by headings get an incomplete picture of the page structure.
- **Fix**: Use semantic heading elements throughout the application.

## Testing Recommendations

To verify these issues and test fixes:

1. **Automated Testing Tools**:
   - Lighthouse Accessibility Audit
   - axe DevTools
   - WAVE Web Accessibility Evaluation Tool

2. **Manual Testing**:
   - Keyboard-only navigation testing
   - Screen reader testing (NVDA, JAWS, VoiceOver)
   - Color contrast checking
   - Focus order verification

3. **User Testing**:
   - Test with users who rely on assistive technologies
   - Verify all interactive elements are keyboard accessible
   - Ensure all information is perceivable without color vision

## WCAG Compliance Levels

- **Level A** (Critical): 8 issues
- **Level AA** (Important): 2 issues  
- **Level AAA** (Enhanced): 4 issues

## Priority Fix Order

1. **Critical** (Blocks usage): Issues #5, #8
2. **High** (Significant impact): Issues #1, #3, #7, #10, #11, #12
3. **Medium** (Moderate impact): Issues #2, #4, #6, #9, #13
4. **Low** (Minor impact): Issue #14

## Additional Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Accessibility Resources](https://webaim.org/)
- [MDN Accessibility Documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
