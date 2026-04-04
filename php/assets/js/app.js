// Todo Kanban Application
let allTodos = [];
let currentFilter = null;

$(document).ready(function() {
    // Hide preloader after page loads
    setTimeout(() => {
        $('.preloader').fadeOut();
    }, 500);
    
    // Initialize jqxWidgets
    initializeJqxWidgets();
    
    // Set current date
    $('#currentDate').text(new Date().toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric'
    }));
    
    // Load initial data
    loadProjects();
    loadUsers();
    loadTodos();
    
    // Event Listeners
    $('#saveBtn').click(saveTodo);
    $('#deleteBtn').click(deleteTodo);
    $('#refreshBtn').click(function(e) {
        e.preventDefault();
        $(this).find('i').addClass('fa-spin');
        loadTodos();
        setTimeout(() => {
            $('#refreshBtn i').removeClass('fa-spin');
        }, 1000);
    });
    
    $('.add-todo-btn').click(function() {
        const status = $(this).data('status');
        openTodoModal(null, status);
    });
    
    // Search functionality
    $('#searchInput').on('input', function() {
        searchTodos($(this).val());
    });
    
    // Settings
    $('#compactMode').change(function() {
        $('body').toggleClass('compact-mode', this.checked);
    });
    
    // Initialize drag and drop
    initDragAndDrop();
});

// Initialize jqxWidgets controls
function initializeJqxWidgets() {
    try {
        // Initialize jqxDateTimeInput for target date if available
        if ($.fn.jqxDateTimeInput) {
            $('#todoTargetDate').jqxDateTimeInput({
                width: '100%',
                height: 38,
                formatString: 'yyyy-MM-dd',
                theme: 'material'
            });
        }
    } catch(e) {
        console.log('jqxWidgets not fully loaded, using native date picker');
    }
}

// Load all todos
function loadTodos() {
    $.ajax({
        url: 'api/index.php',
        data: { resource: 'todos' },
        dataType: 'json',
        method: 'GET'
    }).done(function(response) {
        if (response && response.error) {
            showError('API Error: ' + response.error);
            return;
        }
        
        allTodos = response || [];
        applyFilters();
        updateStatistics(allTodos);
        updateNotifications(allTodos);
    }).fail(function(xhr, status, error) {
        let errorMsg = 'Failed to load todos';
        
        if (xhr.status === 500) {
            try {
                const resp = JSON.parse(xhr.responseText);
                errorMsg = 'Server Error: ' + (resp.error || resp.message || 'Unknown error');
                if (resp.file) errorMsg += '\nFile: ' + resp.file;
                if (resp.line) errorMsg += '\nLine: ' + resp.line;
            } catch(e) {
                errorMsg = 'Server Error (500): ' + (xhr.responseText || 'Internal Server Error');
            }
        } else if (xhr.status === 0) {
            errorMsg = 'Cannot connect to server. Make sure PHP server is running.\n\nRun run.bat to start the server.';
        } else {
            errorMsg += ': ' + error + ' (Status: ' + xhr.status + ')';
        }
        
        showError(errorMsg);
    });
}

// Apply current filter
function applyFilters() {
    let filtered = allTodos;
    
    if (currentFilter === 'Urgent') {
        filtered = allTodos.filter(t => t.priority === 'Urgent');
    } else if (currentFilter === 'High') {
        filtered = allTodos.filter(t => t.priority === 'High');
    } else if (currentFilter === 'Completed') {
        filtered = allTodos.filter(t => t.isCompleted == 1);
    }
    
    renderKanbanBoard(filtered);
}

// Filter by priority
function filterByPriority(priority) {
    currentFilter = priority;
    applyFilters();
    showSuccess(`Showing ${priority} priority todos`);
}

// Filter by completed
function filterByCompleted() {
    currentFilter = 'Completed';
    applyFilters();
    showSuccess('Showing completed todos');
}

// Clear filters
function clearFilters() {
    currentFilter = null;
    applyFilters();
    showSuccess('Showing all todos');
}

// Render Kanban board with todos
function renderKanbanBoard(todos) {
    // Clear all columns
    $('.kanban-body').empty();
    
    // Group todos by status
    const statusMap = {
        'Backlog': [],
        'Linedup': [],
        'Wip': [],
        'Done': [],
        'Stuck': []
    };
    
    todos.forEach(function(todo) {
        if (statusMap[todo.status]) {
            statusMap[todo.status].push(todo);
        }
    });
    
    // Render todos in each column
    for (const [status, items] of Object.entries(statusMap)) {
        const columnBody = $(`.kanban-body[data-status="${status}"]`);
        
        if (items.length === 0) {
            columnBody.html(`
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No todos</p>
                </div>
            `);
        } else {
            items.forEach(function(todo) {
                const card = createTodoCard(todo);
                columnBody.append(card);
            });
        }
        
        // Update badge count
        $(`#badge-${status}`).text(items.length);
    }
}

// Create a todo card
function createTodoCard(todo) {
    const isCompleted = todo.isCompleted == 1;
    const priorityClass = `priority-${todo.priority.toLowerCase()}`;
    const initials = todo.user_name ? getInitials(todo.user_name) : '?';
    const isOverdue = isTargetDateOverdue(todo.target_completion_date) && !isCompleted;
    
    const card = $(`
        <div class="kanban-card ${isCompleted ? 'completed' : ''}" 
             data-id="${todo.id}" 
             draggable="true">
            <div class="card-title">${escapeHtml(todo.title)}</div>
            ${todo.description ? `<div class="card-description">${escapeHtml(todo.description)}</div>` : ''}
            <div class="card-meta">
                <span class="priority-badge ${priorityClass}">${todo.priority}</span>
                ${todo.project_name ? `<span class="project-badge">${escapeHtml(todo.project_name)}</span>` : ''}
            </div>
            <div class="card-meta" style="margin-top: 8px;">
                ${todo.user_name ? `<span class="user-avatar" title="${escapeHtml(todo.user_name)}">${initials}</span>` : ''}
                ${todo.target_completion_date ? `
                    <span class="target-date-badge ${isOverdue ? 'overdue' : ''}">
                        <i class="far fa-calendar"></i> ${formatDate(todo.target_completion_date)}
                    </span>
                ` : ''}
                ${todo.link ? `<a href="${escapeHtml(todo.link)}" target="_blank" class="link-badge"><i class="fas fa-link"></i> Link</a>` : ''}
            </div>
            <div class="card-actions">
                <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${todo.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${todo.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `);
    
    // Add event listeners
    card.find('.edit-btn').click(function(e) {
        e.stopPropagation();
        openTodoModal(todo.id);
    });
    
    card.find('.delete-btn').click(function(e) {
        e.stopPropagation();
        deleteTodoById(todo.id);
    });
    
    card.click(function() {
        openTodoModal(todo.id);
    });
    
    // Drag events
    card.on('dragstart', handleDragStart);
    card.on('dragend', handleDragEnd);
    
    return card;
}

// Update statistics
function updateStatistics(todos) {
    const stats = {
        total: todos.length,
        Backlog: 0,
        Linedup: 0,
        Wip: 0,
        Done: 0,
        Stuck: 0
    };
    
    todos.forEach(function(todo) {
        if (stats[todo.status] !== undefined) {
            stats[todo.status]++;
        }
    });
    
    // Animate numbers
    animateNumber('#totalTodos', stats.total);
    animateNumber('#backlogCount', stats.Backlog);
    animateNumber('#linedupCount', stats.Linedup);
    animateNumber('#wipCount', stats.Wip);
    animateNumber('#doneCount', stats.Done);
    animateNumber('#stuckCount', stats.Stuck);
}

// Animate number change
function animateNumber(selector, value) {
    const element = $(selector);
    const currentValue = parseInt(element.text()) || 0;
    
    if (currentValue !== value) {
        element.text(value);
        element.closest('.stat-card').addClass('shadow');
        setTimeout(() => {
            element.closest('.stat-card').removeClass('shadow');
        }, 300);
    }
}

// Update notifications
function updateNotifications(todos) {
    const overdueCount = todos.filter(t => 
        isTargetDateOverdue(t.target_completion_date) && t.isCompleted != 1
    ).length;
    
    $('#notificationBadge').text(overdueCount);
    if (overdueCount > 0) {
        $('#overdueNotif').html(`<strong>${overdueCount}</strong> overdue todo${overdueCount > 1 ? 's' : ''}`);
    } else {
        $('#overdueNotif').text('No overdue todos');
    }
}

// Load projects
function loadProjects() {
    $.ajax({
        url: 'api/index.php',
        data: { resource: 'projects' },
        dataType: 'json'
    }).done(function(response) {
        if (response.error) return;
        
        const select = $('#todoProject');
        select.empty().append('<option value="">Select Project</option>');
        
        response.forEach(function(project) {
            select.append(`<option value="${project.id}">${escapeHtml(project.name)}</option>`);
        });
    });
}

// Load users
function loadUsers() {
    $.ajax({
        url: 'api/index.php',
        data: { resource: 'users' },
        dataType: 'json'
    }).done(function(response) {
        if (response.error) return;
        
        const select = $('#todoUser');
        select.empty().append('<option value="">Select User</option>');
        
        response.forEach(function(user) {
            select.append(`<option value="${user.id}">${escapeHtml(user.name)}</option>`);
        });
    });
}

// Open modal for new/edit todo
function openTodoModal(todoId = null, defaultStatus = 'Backlog') {
    if (todoId) {
        // Edit mode
        $('#modalTitle').html('<i class="fas fa-edit me-2"></i>Edit Todo');
        $('#deleteBtn').show();
        
        $.get('api/index.php', { resource: 'todos', id: todoId }, function(todo) {
            if (todo.error) {
                showError(todo.error);
                return;
            }
            
            $('#todoId').val(todo.id);
            $('#todoTitle').val(todo.title);
            $('#todoDescription').val(todo.description || '');
            $('#todoStatus').val(todo.status);
            $('#todoPriority').val(todo.priority);
            $('#todoTargetDate').val(todo.target_completion_date || '');
            $('#todoProject').val(todo.project_id);
            $('#todoUser').val(todo.user_id);
            $('#todoLink').val(todo.link || '');
            $('#todoCompleted').prop('checked', todo.isCompleted == 1);
            
            new bootstrap.Modal(document.getElementById('todoModal')).show();
        });
    } else {
        // New mode
        $('#modalTitle').html('<i class="fas fa-plus-circle me-2"></i>Add New Todo');
        $('#deleteBtn').hide();
        $('#todoForm')[0].reset();
        $('#todoId').val('');
        $('#todoStatus').val(defaultStatus);
        $('#todoCompleted').prop('checked', false);
        
        new bootstrap.Modal(document.getElementById('todoModal')).show();
    }
}

// Save todo
function saveTodo() {
    const todoId = $('#todoId').val();
    const data = {
        title: $('#todoTitle').val(),
        description: $('#todoDescription').val(),
        status: $('#todoStatus').val(),
        priority: $('#todoPriority').val(),
        target_completion_date: $('#todoTargetDate').val() || null,
        project_id: $('#todoProject').val() || null,
        user_id: $('#todoUser').val() || null,
        link: $('#todoLink').val() || null,
        isCompleted: $('#todoCompleted').is(':checked') ? 1 : 0
    };
    
    // Validation
    if (!data.title.trim()) {
        showError('Title is required');
        return;
    }
    
    const method = todoId ? 'PUT' : 'POST';
    const url = todoId ? `api/index.php?resource=todos&id=${todoId}` : 'api/index.php?resource=todos';
    
    $('#saveBtn').prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i> Saving...');
    
    $.ajax({
        url: url,
        method: method,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            if (response.error) {
                showError(response.error);
                return;
            }
            
            bootstrap.Modal.getInstance(document.getElementById('todoModal')).hide();
            loadTodos();
            showSuccess(todoId ? 'Todo updated successfully' : 'Todo created successfully');
        },
        error: function(xhr, status, error) {
            showError('Failed to save todo: ' + error);
        },
        complete: function() {
            $('#saveBtn').prop('disabled', false).html('<i class="fas fa-save me-1"></i> Save Changes');
        }
    });
}

// Delete todo by ID
function deleteTodoById(todoId) {
    if (!confirm('Are you sure you want to delete this todo?')) {
        return;
    }
    
    $.ajax({
        url: `api/index.php?resource=todos&id=${todoId}`,
        method: 'DELETE',
        success: function(response) {
            if (response.error) {
                showError(response.error);
                return;
            }
            
            loadTodos();
            showSuccess('Todo deleted successfully');
        },
        error: function(xhr, status, error) {
            showError('Failed to delete todo: ' + error);
        }
    });
}

// Delete todo (modal button)
function deleteTodo() {
    const todoId = $('#todoId').val();
    if (todoId) {
        deleteTodoById(todoId);
    }
}

// Search todos
function searchTodos(query) {
    if (!query.trim()) {
        renderKanbanBoard(allTodos);
        return;
    }
    
    const results = allTodos.filter(todo => 
        todo.title.toLowerCase().includes(query.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(query.toLowerCase())) ||
        (todo.project_name && todo.project_name.toLowerCase().includes(query.toLowerCase()))
    );
    
    $('#searchResults').html(`<p class="text-muted">${results.length} result${results.length !== 1 ? 's' : ''} found</p>`);
    
    results.forEach(function(todo) {
        const item = $(`
            <div class="mb-2 p-2 border rounded" style="cursor:pointer" data-id="${todo.id}">
                <div class="fw-semibold">${escapeHtml(todo.title)}</div>
                <small class="text-muted">${todo.status} | ${todo.priority}</small>
            </div>
        `);
        item.click(function() {
            bootstrap.Modal.getInstance(document.getElementById('searchModal')).hide();
            openTodoModal(todo.id);
        });
        $('#searchResults').append(item);
    });
}

// Drag and Drop functionality
let draggedElement = null;

function initDragAndDrop() {
    $('.kanban-body').on('dragover', handleDragOver);
    $('.kanban-body').on('dragleave', handleDragLeave);
    $('.kanban-body').on('drop', handleDrop);
}

function handleDragStart(e) {
    draggedElement = this;
    $(this).addClass('dragging');
    e.originalEvent.dataTransfer.effectAllowed = 'move';
    e.originalEvent.dataTransfer.setData('text/plain', '');
}

function handleDragEnd(e) {
    $(this).removeClass('dragging');
    draggedElement = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.originalEvent.dataTransfer.dropEffect = 'move';
    $(this).addClass('drag-over');
}

function handleDragLeave(e) {
    $(this).removeClass('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    $(this).removeClass('drag-over');
    
    if (draggedElement) {
        const newStatus = $(this).data('status');
        const todoId = $(draggedElement).data('id');
        
        // Visual feedback
        const column = $(this).closest('.kanban-column');
        column.css('transform', 'scale(1.02)');
        setTimeout(() => column.css('transform', ''), 200);
        
        // Update todo status
        $.ajax({
            url: `api/index.php?resource=todos&id=${todoId}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ status: newStatus }),
            success: function(response) {
                if (response.error) {
                    showError(response.error);
                    return;
                }
                
                loadTodos();
                showSuccess('Todo status updated');
            },
            error: function(xhr, status, error) {
                showError('Failed to update status: ' + error);
            }
        });
    }
}

// Utility functions
function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isTargetDateOverdue(dateString) {
    if (!dateString) return false;
    const targetDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return targetDate < today;
}

function showError(message) {
    const alertHtml = `
        <div class="alert alert-danger alert-dismissible fade show position-fixed top-0 end-0 m-3" 
             role="alert" style="z-index: 9999; max-width: 400px;">
            <i class="fas fa-exclamation-circle me-2"></i>
            <strong>Error:</strong> ${escapeHtml(message)}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $('body').append(alertHtml);
    setTimeout(() => {
        $('.alert-dismissible').alert('close');
    }, 5000);
}

function showSuccess(message) {
    const alertHtml = `
        <div class="alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-3" 
             role="alert" style="z-index: 9999; max-width: 400px;">
            <i class="fas fa-check-circle me-2"></i>
            ${escapeHtml(message)}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $('body').append(alertHtml);
    setTimeout(() => {
        $('.alert-dismissible').alert('close');
    }, 3000);
}
