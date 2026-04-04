# Accessibility (A11y) Issues - Todo Kanban Board

## Overview

This document lists the accessibility issues found (and intentionally added) in the Todo Kanban Board application. These issues cover various WCAG 2.1 AA compliance areas and can be used for testing and remediation practice.

---

## Critical Issues (Level A)

### 1. Missing Alt Text for Icons
- **Location**: Sidebar icons, statistics cards, Kanban column headers
- **Issue**: Font Awesome icons used without `aria-hidden="true"` or descriptive labels
- **Impact**: Screen readers announce icon class names instead of meaningful descriptions
- **Example**: `<i class="fas fa-columns"></i>` should be `<i class="fas fa-columns" aria-hidden="true"></i>` with `aria-label` on parent
- **WCAG**: 1.1.1 Non-text Content (A)

### 2. Missing Form Labels
- **Location**: Todo Modal (`#todoModal`)
- **Issue**: Form inputs have `<label>` elements but missing `for` attributes properly linked to inputs
- **Impact**: Screen readers cannot associate labels with form fields
- **Example**: `<label>Title</label><input id="todoTitle">` should use `<label for="todoTitle">Title</label>`
- **WCAG**: 1.3.1 Info and Relationships (A), 4.1.2 Name, Role, Value (A)

### 3. Keyboard Navigation Traps
- **Location**: Kanban cards, modal dialogs
- **Issue**: Drag-and-drop functionality only works with mouse; no keyboard alternative
- **Impact**: Keyboard-only users cannot move todos between columns
- **Solution Needed**: Add arrow key navigation and keyboard shortcuts for moving cards
- **WCAG**: 2.1.1 Keyboard (A), 2.1.2 No Keyboard Trap (A)

### 4. Missing ARIA Roles for Kanban Board
- **Location**: Kanban board structure (`#kanbanBoard`)
- **Issue**: Board columns and cards lack proper ARIA roles (`role="region"`, `role="list"`, `role="listitem"`)
- **Impact**: Screen readers cannot understand the board structure
- **Solution Needed**: Add `role="main"`, `aria-roledescription="Kanban Board"`, proper list semantics
- **WCAG**: 4.1.2 Name, Role, Value (A)

### 5. Focus Management in Modals
- **Location**: All modals (`#todoModal`, `#settingsModal`, `#searchModal`)
- **Issue**: 
  - Focus not trapped inside modal when open
  - Focus not returned to trigger button when modal closes
- **Impact**: Keyboard users can tab to background elements
- **WCAG**: 2.4.3 Focus Order (A)

---

## Serious Issues (Level AA)

### 6. Insufficient Color Contrast
- **Location**: Priority badges, Kanban column headers, secondary text
- **Issue**: Some text-background combinations don't meet 4.5:1 contrast ratio
- **Specific Examples**:
  - Medium priority badge (`#eab308` on `#ca8a04`) - ratio ~2.1:1
  - Column header badges (light text on light background)
  - `.text-muted` class (`#64748b`) on white - borderline at ~4.6:1
- **WCAG**: 1.4.3 Contrast (Minimum) (AA)

### 7. Missing Skip Navigation
- **Location**: Entire application
- **Issue**: No "Skip to main content" link
- **Impact**: Keyboard users must tab through entire sidebar to reach Kanban board
- **Solution Needed**: Add skip link at top of page
- **WCAG**: 2.4.1 Bypass Blocks (AA)

### 8. Missing Live Regions for Dynamic Content
- **Location**: Statistics cards, notification badge, toast notifications
- **Issue**: Numbers update dynamically without announcing to screen readers
- **Impact**: Screen reader users not notified of changes
- **Solution Needed**: Add `aria-live="polite"` to stat containers
- **WCAG**: 4.1.3 Status Messages (AA)

### 9. Empty or Meaningless Link Text
- **Location**: Todo cards with links
- **Issue**: Link text "Link" without context
- **Impact**: Screen reader users don't know what the link goes to
- **Solution Needed**: Use descriptive text like "Link to [todo title]"
- **WCAG**: 2.4.4 Link Purpose (In Context) (A)

### 10. Drag-and-Drop Not Accessible
- **Location**: Kanban columns
- **Issue**: No visual indication that cards can be dragged; no alternative for mouse users
- **Impact**: Users who cannot use mouse cannot reorder items
- **Solution Needed**: Add move buttons or keyboard shortcuts
- **WCAG**: 2.5.7 Dragging Movements (AA - WCAG 2.2)

---

## Moderate Issues (Level A/AA)

### 11. Missing Landmark Roles
- **Location**: Page structure
- **Issue**: Main sections lack proper ARIA landmarks
- **Impact**: Screen readers cannot quickly navigate to sections
- **Solution Needed**: Add `role="navigation"`, `role="main"`, `role="complementary"`
- **WCAG**: 1.3.1 Info and Relationships (A)

### 12. Heading Hierarchy Issues
- **Location**: Page headings
- **Issue**: Heading levels skip (h1 → h5, missing h2, h3, h4)
- **Impact**: Screen reader users cannot understand page structure
- **Solution Needed**: Use sequential heading levels (h1 → h2 → h3)
- **WCAG**: 1.3.1 Info and Relationships (A)

### 13. Focus Indicators Too Subtle
- **Location**: Form inputs, buttons, interactive elements
- **Issue**: Default focus indicators are thin and hard to see
- **Impact**: Keyboard users cannot easily see focused element
- **Solution Needed**: Add thicker, higher-contrast focus outlines (3px minimum)
- **WCAG**: 2.4.7 Focus Visible (AA)

### 14. Missing Error Identification
- **Location**: Todo form validation
- **Issue**: Error messages shown via alerts, not linked to form fields
- **Impact**: Screen readers don't associate errors with specific fields
- **Solution Needed**: Use `aria-describedby` and `aria-invalid`
- **WCAG**: 3.3.1 Error Identification (A)

### 15. No Page Title
- **Location**: HTML `<title>` element
- **Issue**: Page title doesn't change based on content
- **Impact**: Screen reader users cannot identify page when switching tabs
- **Solution Needed**: Update title dynamically (e.g., "Kanban Board - 6 Todos")
- **WCAG**: 2.4.2 Page Titled (A)

---

## Minor Issues

### 16. Missing Language Attribute Updates
- **Location**: Todo cards with user names
- **Issue**: User avatars lack accessible names
- **Impact**: Screen readers announce "?" for unassigned users
- **Solution Needed**: Add `aria-label="Assigned to: [name]"` or `aria-label="Unassigned"`
- **WCAG**: 1.1.1 Non-text Content (A)

### 17. Redundant Input Methods
- **Location**: Search modal, filter dropdown
- **Issue**: Search input lacks `type="search"`, no clear button
- **Impact**: Mobile users don't get optimized keyboard
- **WCAG**: 1.3.5 Identify Input Purpose (AA)

### 18. Animation and Motion
- **Location**: Card hover effects, page transitions, preloader
- **Issue**: Animations cannot be disabled by user preference
- **Impact**: Users with vestibular disorders may experience discomfort
- **Solution Needed**: Respect `prefers-reduced-motion` media query
- **WCAG**: 2.3.3 Animation from Interactions (AAA)

### 19. Table Headers Missing
- **Location**: Statistics section
- **Issue**: Stats displayed as cards but could use table semantics
- **Impact**: Screen readers cannot understand data relationships
- **WCAG**: 1.3.1 Info and Relationships (A)

### 20. Missing Help Text
- **Location**: Form fields, drag-and-drop area
- **Issue**: No instructions for complex interactions
- **Impact**: Users don't know how to use features
- **Solution Needed**: Add `aria-describedby` with help text
- **WCAG**: 3.3.2 Labels or Instructions (A)

---

## Summary

| Severity | Count | Level |
|----------|-------|-------|
| Critical | 5 | A |
| Serious | 5 | AA |
| Moderate | 5 | A/AA |
| Minor | 5 | A/AA/AAA |
| **Total** | **20** | |

---

## Testing Recommendations

1. **Keyboard Testing**: Navigate entire app using only keyboard (Tab, Enter, Arrow keys)
2. **Screen Reader Testing**: Test with NVDA (Windows) or VoiceOver (Mac)
3. **Automated Testing**: Run Lighthouse Accessibility Audit, axe DevTools
4. **Contrast Checking**: Use WebAIM Contrast Checker for all text/background combos
5. **Focus Management**: Verify focus visible and logical throughout user flow

---

## WCAG 2.1 AA Success Criteria Checklist

- [ ] 1.1.1 Non-text Content
- [ ] 1.3.1 Info and Relationships
- [ ] 1.3.5 Identify Input Purpose
- [ ] 1.4.3 Contrast (Minimum)
- [ ] 2.1.1 Keyboard
- [ ] 2.1.2 No Keyboard Trap
- [ ] 2.4.1 Bypass Blocks
- [ ] 2.4.2 Page Titled
- [ ] 2.4.3 Focus Order
- [ ] 2.4.4 Link Purpose
- [ ] 2.4.7 Focus Visible
- [ ] 3.3.1 Error Identification
- [ ] 3.3.2 Labels or Instructions
- [ ] 4.1.2 Name, Role, Value
- [ ] 4.1.3 Status Messages

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Accessibility Checker](https://webaim.org/)
- [axe DevTools](https://www.deque.com/axe/)
- [WAVE Evaluation Tool](https://wave.webaim.org/)
- [Lighthouse Accessibility Audits](https://developers.google.com/web/tools/lighthouse)
