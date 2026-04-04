# Accessibility (a11y) Issues - Todo App

## Overview
This document lists accessibility issues found in the Todo App that need to be addressed for WCAG 2.1 AA compliance.

---

## Critical Issues (Level A/AA)

### 1. Kanban Cards - Missing Keyboard Accessibility
**Location:** `Pages/Index.cshtml` - `createTodoCard()` function  
**Issue:** Kanban cards use `div` elements with click handlers but are not keyboard accessible.  
**WCAG:** 2.1.1 Keyboard (Level A)  
**Impact:** Screen reader and keyboard-only users cannot interact with todo cards.

```javascript
// CURRENT - Only mouse click works
$('.kanban-card').on('click', function() {
    const todoId = $(this).data('id');
    openEditModal(todoId);
});
```

**Fix needed:**
```html
<!-- Add tabindex, role, and keyup handler -->
<div class="kanban-card" data-id="${todo.id}" tabindex="0" role="button" aria-label="Edit todo: ${todo.title}" onkeydown="if(event.key==='Enter'||event.key===' '){this.click()}">
```

---

### 2. Missing ARIA Labels on Icon-Only Buttons
**Location:** `Pages/Index.cshtml`, `Pages/Todos.cshtml`, `Pages/Projects.cshtml`  
**Issue:** Buttons with only icons lack `aria-label` attributes.  
**WCAG:** 4.1.2 Name, Role, Value (Level A)  

**Examples:**
```html
<!-- Issue - No label for screen readers -->
<button class="btn btn-sm btn-info" onclick="openEditModal(${todo.id})">
    <i class="fas fa-edit"></i>
</button>

<!-- Fix - Add aria-label -->
<button class="btn btn-sm btn-info" onclick="openEditModal(${todo.id})" aria-label="Edit todo ${todo.title}">
    <i class="fas fa-edit" aria-hidden="true"></i>
</button>
```

---

### 3. Missing `aria-hidden` on Decorative Icons
**Location:** All pages with `<i class="fas ...">` icons  
**Issue:** Font Awesome icons are announced by screen readers as empty content.  
**WCAG:** 4.1.2 Name, Role, Value (Level A)  

**Fix:** Add `aria-hidden="true"` to all decorative icons:
```html
<i class="fas fa-folder" aria-hidden="true"></i>
<i class="fas fa-user" aria-hidden="true"></i>
<i class="fas fa-calendar-alt" aria-hidden="true"></i>
```

---

### 4. Missing Live Region for Dynamic Content Updates
**Location:** `Pages/Index.cshtml` - Kanban board, stat cards  
**Issue:** When todos are added/updated, screen readers are not notified of changes.  
**WCAG:** 4.1.3 Status Messages (Level AA)  

**Fix needed:** Add `aria-live` regions:
```html
<!-- Add to stat cards -->
<div class="stat-value" id="stat-total" aria-live="polite">0</div>

<!-- Add to kanban columns -->
<div class="kanban-cards" id="cards-backlog" aria-live="polite" aria-atomic="true"></div>
```

---

### 5. Modal Focus Management
**Location:** All pages with modals  
**Issue:** Focus is not managed properly when modals open/close.  
**WCAG:** 2.4.3 Focus Order (Level A)  

**Fix needed:**
```javascript
function openAddModal() {
    // Save current focus
    window.lastFocusedElement = document.activeElement;
    
    $('#modalTitle').html('<i class="fas fa-plus-circle" aria-hidden="true"></i> Add Todo');
    todoModal.show();
    
    // Set focus to first input after modal opens
    $('#todoModal').on('shown.bs.modal', function () {
        $('#title').focus();
    });
}

function saveTodo() {
    // ... save logic ...
    todoModal.hide();
    
    // Restore focus
    if (window.lastFocusedElement) {
        window.lastFocusedElement.focus();
    }
}
```

---

## Important Issues (Level AA)

### 6. Missing Skip Navigation Link
**Location:** `Pages/Shared/_AdminLTE.cshtml`  
**Issue:** No skip link to bypass sidebar navigation.  
**WCAG:** 2.4.1 Bypass Blocks (Level A)  

**Fix:** Add at the top of body:
```html
<body class="hold-transition sidebar-mini layout-fixed">
    <a class="sr-only sr-only-focusable" href="#main-content">Skip to main content</a>
    ...
    <div id="main-content">
        @RenderBody()
    </div>
</body>
```

---

### 7. Color Contrast Issues
**Location:** `Pages/Shared/_AdminLTE.cshtml` - Custom styles  
**Issue:** Some color combinations may not meet 4.5:1 contrast ratio.  
**WCAG:** 1.4.3 Contrast (Minimum) (Level AA)  

**Check these:**
- `.priority-medium` (yellow background with black text) - May need darker yellow
- Sidebar links `rgba(255,255,255,0.85)` on gradient background
- Status badge colors on light backgrounds

---

### 8. Missing Table Headers Association
**Location:** `Pages/Todos.cshtml`, `Pages/Projects.cshtml`  
**Issue:** Table data cells are not associated with their headers.  
**WCAG:** 1.3.1 Info and Relationships (Level A)  

**Current:** Uses `<th>` in `<thead>` but lacks `scope` attribute.  
**Fix:**
```html
<thead>
    <tr>
        <th scope="col">ID</th>
        <th scope="col">Title</th>
        <th scope="col">Description</th>
        ...
    </tr>
</thead>
```

---

### 9. Missing Form Field Error Feedback
**Location:** All modals with forms  
**Issue:** No `aria-describedby` or `aria-invalid` on form fields for error states.  
**WCAG:** 3.3.1 Error Identification (Level A)  

**Fix needed:**
```html
<input type="text" class="form-control" id="title" required 
       aria-describedby="title-error" aria-invalid="false" />
<div id="title-error" class="invalid-feedback" role="alert"></div>
```

---

### 10. Search Input Missing Label
**Location:** `Pages/Todos.cshtml`, `Pages/Projects.cshtml`  
**Issue:** Search box has placeholder but no associated `<label>`.  
**WCAG:** 4.1.2 Name, Role, Value (Level A)  

**Fix:**
```html
<label for="searchInput" class="sr-only">Search todos</label>
<input type="text" class="form-control" id="searchInput" 
       placeholder="Search todos..." aria-label="Search todos" />
```

---

## Moderate Issues

### 11. Missing `lang` Attribute Consistency
**Location:** `Pages/Shared/_AdminLTE.cshtml`  
**Issue:** HTML has `lang="en"` but content may have mixed languages.  
**WCAG:** 3.1.1 Language of Page (Level A)  

---

### 12. Missing Focus Visible Indicators
**Location:** All pages  
**Issue:** Custom styled elements may not show visible focus indicators.  
**WCAG:** 2.4.7 Focus Visible (Level AA)  

**Fix:** Add to CSS:
```css
*:focus {
    outline: 3px solid #005fcc;
    outline-offset: 2px;
}

*:focus:not(:focus-visible) {
    outline: none;
}

*:focus-visible {
    outline: 3px solid #005fcc;
    outline-offset: 2px;
}
```

---

### 13. Priority Badge - Text Contrast
**Location:** `Pages/Shared/_AdminLTE.cshtml`  
**Issue:** Medium priority uses yellow with black text - verify 4.5:1 ratio.  
**WCAG:** 1.4.3 Contrast (Minimum) (Level AA)  

---

### 14. Missing `aria-current` for Active Navigation
**Location:** `Pages/Shared/_AdminLTE.cshtml`  
**Issue:** Active menu item should use `aria-current="page"`.  
**WCAG:** 1.3.1 Info and Relationships (Level A)  

**Fix:**
```javascript
$('.nav-sidebar .nav-link').removeClass('active').removeAttr('aria-current');
$('.nav-sidebar a[href="/"]').addClass('active').attr('aria-current', 'page');
```

---

### 15. Dynamic Content - No Loading Indication
**Location:** All pages loading data via AJAX  
**Issue:** No `aria-busy` or loading spinners announced to screen readers.  
**WCAG:** 4.1.3 Status Messages (Level AA)  

---

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| Critical | 5 | Keyboard access, ARIA labels, focus management |
| Important | 5 | Skip nav, contrast, table headers, form errors |
| Moderate | 5 | Focus indicators, nav state, loading states |

**Total Issues:** 15

---

## Recommended Fix Priority Order

1. **Keyboard Accessibility** - Kanban cards (#1)
2. **ARIA Labels** - Icon buttons (#2, #3)
3. **Live Regions** - Dynamic updates (#4)
4. **Focus Management** - Modal dialogs (#5)
5. **Skip Navigation** - Page structure (#6)
6. **Form Accessibility** - Labels and errors (#9, #10)
7. **Table Headers** - Data tables (#8)
8. **Focus Indicators** - CSS styles (#12)
