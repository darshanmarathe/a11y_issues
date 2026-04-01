// Todo Kanban Application
$(document).ready(function() {
    // Initialize jqxWidgets
    initializeJqxWidgets();
    
    // Set current date
    $('#currentDate').text(new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
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
        loadTodos();
    });
    
    $('.add-todo-btn').click(function() {
        const status = $(this).data('status');
        openTodoModal(null, status);
    });
    
    // Initialize drag and drop
    initDragAndDrop();
});

// Initialize jqxWidgets controls
function initializeJqxWidgets() {
    // Initialize jqxDateTimeInput for target date
    $('#todoTargetDate').jqxDateTimeInput({
        width: '100%',
        height: 38,
        formatString: 'yyyy-MM-dd',
        theme: 'material'
    });
}

// Load all todos
function loadTodos() {
    $.get('api/index.php', { resource: 'todos' }, function(response) {
        if (response.error) {
            showError(response.error);
            return;
        }
        
        renderKanbanBoard(response);
        updateStatistics(response);
    }).fail(function(xhr, status, error) {
        showError('Failed to load todos: ' + error);
    });
}

// Render Kanban board with todos
function renderKanbanBoard(todos) {
    // Clear all columns
    $('.kanban-column-body').empty();
    
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
        const columnBody = $(`.kanban-column-body[data-status="${status}"]`);
        
        if (items.length === 0) {
            columnBody.html('<div class="empty-state"><i class="fas fa-clipboard-list"></i><p>No todos</p></div>');
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
            <div class="card-meta" style="margin-top: 5px;">
                ${todo.user_name ? `<span class="user-avatar" title="${escapeHtml(todo.user_name)}">${initials}</span>` : ''}
                ${todo.target_completion_date ? `
                    <span class="target-date-badge ${isOverdue ? 'overdue' : ''}">
                        <i class="far fa-calendar"></i> ${formatDate(todo.target_completion_date)}
                    </span>
                ` : ''}
                ${todo.link ? `<a href="${escapeHtml(todo.link)}" target="_blank" class="link-badge"><i class="fas fa-link"></i> Link</a>` : ''}
            </div>
            <div class="card-actions">
                <button class="btn btn-sm btn-primary edit-btn" data-id="${todo.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${todo.id}">
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
    
    $('#totalTodos').text(stats.total);
    $('#backlogCount').text(stats.Backlog);
    $('#linedupCount').text(stats.Linedup);
    $('#wipCount').text(stats.Wip);
    $('#doneCount').text(stats.Done);
    $('#stuckCount').text(stats.Stuck);
}

// Load projects
function loadProjects() {
    $.get('api/index.php', { resource: 'projects' }, function(response) {
        if (response.error) {
            showError(response.error);
            return;
        }
        
        const select = $('#todoProject');
        select.empty().append('<option value="">Select Project</option>');
        
        response.forEach(function(project) {
            select.append(`<option value="${project.id}">${escapeHtml(project.name)}</option>`);
        });
    });
}

// Load users
function loadUsers() {
    $.get('api/index.php', { resource: 'users' }, function(response) {
        if (response.error) {
            showError(response.error);
            return;
        }
        
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
        $('#modalTitle').text('Edit Todo');
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
            
            $('#todoModal').modal('show');
        });
    } else {
        // New mode
        $('#modalTitle').text('Add New Todo');
        $('#deleteBtn').hide();
        $('#todoForm')[0].reset();
        $('#todoId').val('');
        $('#todoStatus').val(defaultStatus);
        $('#todoCompleted').prop('checked', false);
        $('#todoModal').modal('show');
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
            
            $('#todoModal').modal('hide');
            loadTodos();
            showSuccess(todoId ? 'Todo updated successfully' : 'Todo created successfully');
        },
        error: function(xhr, status, error) {
            showError('Failed to save todo: ' + error);
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

// Drag and Drop functionality
let draggedElement = null;

function initDragAndDrop() {
    $('.kanban-column-body').on('dragover', handleDragOver);
    $('.kanban-column-body').on('dragleave', handleDragLeave);
    $('.kanban-column-body').on('drop', handleDrop);
}

function handleDragStart(e) {
    draggedElement = this;
    $(this).addClass('dragging');
    e.originalEvent.dataTransfer.effectAllowed = 'move';
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isTargetDateOverdue(dateString) {
    if (!dateString) return false;
    const targetDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return targetDate < today;
}

function showError(message) {
    alert('Error: ' + message);
}

function showSuccess(message) {
    // You can replace this with a toast notification
    console.log('Success: ' + message);
}
