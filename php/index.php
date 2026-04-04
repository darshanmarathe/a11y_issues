<!DOCTYPE html>
<html lang="en" data-bs-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo Kanban Board</title>
    
    <!-- Google Font: Inter -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap">
    <!-- Bootstrap 5 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
    <!-- AdminLTE 4 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/admin-lte@4.0.0-beta3/dist/css/adminlte.min.css">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <!-- jqxWidgets -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqwidgets/19.0.0/jqwidgets/styles/jqx.material.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="layout-fixed sidebar-expand-lg bg-body-tertiary">
<div class="app-wrapper d-flex">
    <!-- Preloader -->
    <div class="preloader">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>

    <!-- Main Sidebar -->
    <aside class="app-sidebar bg-dark shadow" data-bs-theme="dark">
        <!-- Brand -->
        <div class="app-sidebar-header border-bottom">
            <a href="index.php" class="app-brand-link text-decoration-none">
                <span class="app-brand-logo me-2">
                    <i class="fas fa-columns fa-2x text-primary"></i>
                </span>
                <span class="app-brand-text ms-2 fw-bold">Kanban</span>
            </a>
        </div>

        <!-- Sidebar Menu -->
        <nav class="app-sidebar-body">
            <ul class="nav flex-column sidebar-menu">
                <li class="menu-header">Main</li>
                <li class="nav-item">
                    <a href="#kanbanSection" class="nav-link active" onclick="scrollToSection('kanbanSection')">
                        <i class="nav-icon fas fa-columns"></i>
                        <p>Kanban Board</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#statsSection" class="nav-link" onclick="scrollToSection('statsSection')">
                        <i class="nav-icon fas fa-chart-pie"></i>
                        <p>Statistics</p>
                    </a>
                </li>
                
                <li class="menu-header">Actions</li>
                <li class="nav-item">
                    <a href="#" class="nav-link" data-bs-toggle="modal" data-bs-target="#todoModal" id="addTodoBtn">
                        <i class="nav-icon fas fa-plus-circle text-success"></i>
                        <p>Add New Todo</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" id="refreshBtn">
                        <i class="nav-icon fas fa-sync-alt text-info"></i>
                        <p>Refresh Data</p>
                    </a>
                </li>
                
                <li class="menu-header">Filters</li>
                <li class="nav-item">
                    <a href="#" class="nav-link" onclick="filterByPriority('Urgent'); return false;">
                        <i class="nav-icon fas fa-fire text-danger"></i>
                        <p>Urgent</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" onclick="filterByPriority('High'); return false;">
                        <i class="nav-icon fas fa-arrow-up text-warning"></i>
                        <p>High Priority</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" onclick="filterByCompleted(); return false;">
                        <i class="nav-icon fas fa-check-circle text-success"></i>
                        <p>Completed</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" onclick="clearFilters(); return false;">
                        <i class="nav-icon fas fa-filter"></i>
                        <p>All Todos</p>
                    </a>
                </li>
                
                <li class="menu-header">Settings</li>
                <li class="nav-item">
                    <a href="#" class="nav-link" data-bs-toggle="modal" data-bs-target="#settingsModal">
                        <i class="nav-icon fas fa-cog"></i>
                        <p>Settings</p>
                    </a>
                </li>
            </ul>
        </nav>
    </aside>

    <!-- Content Wrapper -->
    <div class="app-wrapper flex-grow-1 d-flex flex-column">
        <!-- Navbar -->
        <nav class="app-header navbar navbar-expand border-bottom bg-white">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" data-lte-toggle="sidebar" href="#" role="button">
                        <i class="fas fa-bars"></i>
                    </a>
                </li>
                <li class="nav-item d-none d-sm-block">
                    <h5 class="mb-0 fw-semibold">Todo Kanban Board</h5>
                </li>
            </ul>

            <ul class="navbar-nav ms-auto">
                <!-- Search -->
                <li class="nav-item me-2">
                    <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#searchModal">
                        <i class="fas fa-search"></i>
                    </a>
                </li>
                <!-- Notifications -->
                <li class="nav-item dropdown me-2">
                    <a class="nav-link" data-bs-toggle="dropdown" href="#">
                        <i class="far fa-bell"></i>
                        <span class="badge bg-danger" id="notificationBadge">0</span>
                    </a>
                    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                        <a href="#" class="dropdown-item">
                            <i class="fas fa-exclamation-circle me-2"></i>
                            <span id="overdueNotif">No overdue todos</span>
                        </a>
                    </div>
                </li>
                <!-- Date -->
                <li class="nav-item">
                    <span class="nav-link text-muted small" id="currentDate"></span>
                </li>
            </ul>
        </nav>

        <!-- Main Content -->
        <div class="app-content p-3">
            <!-- Statistics Cards -->
            <div id="statsSection" class="row g-3 mb-4">
                <div class="col-6 col-lg-2">
                    <div class="card stat-card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="stat-icon bg-primary bg-opacity-10 rounded p-3 me-3">
                                    <i class="fas fa-layer-group fa-2x text-primary"></i>
                                </div>
                                <div>
                                    <h3 class="mb-0 fw-bold" id="totalTodos">0</h3>
                                    <small class="text-muted">Total</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-6 col-lg-2">
                    <div class="card stat-card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="stat-icon bg-secondary bg-opacity-10 rounded p-3 me-3">
                                    <i class="fas fa-inbox fa-2x text-secondary"></i>
                                </div>
                                <div>
                                    <h3 class="mb-0 fw-bold" id="backlogCount">0</h3>
                                    <small class="text-muted">Backlog</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-6 col-lg-2">
                    <div class="card stat-card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="stat-icon bg-info bg-opacity-10 rounded p-3 me-3">
                                    <i class="fas fa-list-check fa-2x text-info"></i>
                                </div>
                                <div>
                                    <h3 class="mb-0 fw-bold" id="linedupCount">0</h3>
                                    <small class="text-muted">Lined Up</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-6 col-lg-2">
                    <div class="card stat-card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="stat-icon bg-warning bg-opacity-10 rounded p-3 me-3">
                                    <i class="fas fa-spinner fa-2x text-warning"></i>
                                </div>
                                <div>
                                    <h3 class="mb-0 fw-bold" id="wipCount">0</h3>
                                    <small class="text-muted">WIP</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-6 col-lg-2">
                    <div class="card stat-card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="stat-icon bg-success bg-opacity-10 rounded p-3 me-3">
                                    <i class="fas fa-check-circle fa-2x text-success"></i>
                                </div>
                                <div>
                                    <h3 class="mb-0 fw-bold" id="doneCount">0</h3>
                                    <small class="text-muted">Done</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-6 col-lg-2">
                    <div class="card stat-card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="stat-icon bg-danger bg-opacity-10 rounded p-3 me-3">
                                    <i class="fas fa-exclamation-triangle fa-2x text-danger"></i>
                                </div>
                                <div>
                                    <h3 class="mb-0 fw-bold" id="stuckCount">0</h3>
                                    <small class="text-muted">Stuck</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Kanban Board -->
            <div id="kanbanSection" class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0 py-3">
                    <div class="row align-items-center">
                        <div class="col">
                            <h5 class="card-title mb-0 fw-semibold">
                                <i class="fas fa-columns text-primary me-2"></i>Todo Board
                            </h5>
                        </div>
                        <div class="col-auto">
                            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#todoModal">
                                <i class="fas fa-plus me-1"></i> Add Todo
                            </button>
                            <div class="btn-group ms-2">
                                <button class="btn btn-outline-secondary btn-sm dropdown-toggle" data-bs-toggle="dropdown">
                                    <i class="fas fa-filter"></i> Filter
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li><a class="dropdown-item" href="#" onclick="filterByPriority('Urgent'); return false;">Urgent</a></li>
                                    <li><a class="dropdown-item" href="#" onclick="filterByPriority('High'); return false;">High Priority</a></li>
                                    <li><a class="dropdown-item" href="#" onclick="filterByCompleted(); return false;">Completed</a></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li><a class="dropdown-item" href="#" onclick="clearFilters(); return false;">All Todos</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body p-0">
                    <div id="kanbanBoard" class="kanban-container p-3">
                        <div class="row g-3">
                            <!-- Backlog -->
                            <div class="col-lg col-md-6">
                                <div class="kanban-column" data-status="Backlog">
                                    <div class="kanban-header bg-secondary">
                                        <div class="d-flex align-items-center">
                                            <i class="fas fa-inbox me-2"></i>
                                            <h6 class="mb-0 fw-semibold">Backlog</h6>
                                            <span class="badge bg-light text-dark ms-auto" id="badge-Backlog">0</span>
                                        </div>
                                    </div>
                                    <div class="kanban-body" data-status="Backlog"></div>
                                    <div class="kanban-footer">
                                        <button class="btn btn-sm btn-outline-secondary w-100 add-todo-btn" data-status="Backlog">
                                            <i class="fas fa-plus me-1"></i> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Lined Up -->
                            <div class="col-lg col-md-6">
                                <div class="kanban-column" data-status="Linedup">
                                    <div class="kanban-header bg-info">
                                        <div class="d-flex align-items-center">
                                            <i class="fas fa-list-check me-2"></i>
                                            <h6 class="mb-0 fw-semibold">Lined Up</h6>
                                            <span class="badge bg-light text-dark ms-auto" id="badge-Linedup">0</span>
                                        </div>
                                    </div>
                                    <div class="kanban-body" data-status="Linedup"></div>
                                    <div class="kanban-footer">
                                        <button class="btn btn-sm btn-outline-info w-100 add-todo-btn" data-status="Linedup">
                                            <i class="fas fa-plus me-1"></i> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- WIP -->
                            <div class="col-lg col-md-6">
                                <div class="kanban-column" data-status="Wip">
                                    <div class="kanban-header bg-warning">
                                        <div class="d-flex align-items-center">
                                            <i class="fas fa-spinner me-2"></i>
                                            <h6 class="mb-0 fw-semibold">WIP</h6>
                                            <span class="badge bg-light text-dark ms-auto" id="badge-Wip">0</span>
                                        </div>
                                    </div>
                                    <div class="kanban-body" data-status="Wip"></div>
                                    <div class="kanban-footer">
                                        <button class="btn btn-sm btn-outline-warning w-100 add-todo-btn" data-status="Wip">
                                            <i class="fas fa-plus me-1"></i> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Done -->
                            <div class="col-lg col-md-6">
                                <div class="kanban-column" data-status="Done">
                                    <div class="kanban-header bg-success">
                                        <div class="d-flex align-items-center">
                                            <i class="fas fa-check-circle me-2"></i>
                                            <h6 class="mb-0 fw-semibold">Done</h6>
                                            <span class="badge bg-light text-dark ms-auto" id="badge-Done">0</span>
                                        </div>
                                    </div>
                                    <div class="kanban-body" data-status="Done"></div>
                                    <div class="kanban-footer">
                                        <button class="btn btn-sm btn-outline-success w-100 add-todo-btn" data-status="Done">
                                            <i class="fas fa-plus me-1"></i> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Stuck -->
                            <div class="col-lg col-md-6">
                                <div class="kanban-column" data-status="Stuck">
                                    <div class="kanban-header bg-danger">
                                        <div class="d-flex align-items-center">
                                            <i class="fas fa-exclamation-triangle me-2"></i>
                                            <h6 class="mb-0 fw-semibold">Stuck</h6>
                                            <span class="badge bg-light text-dark ms-auto" id="badge-Stuck">0</span>
                                        </div>
                                    </div>
                                    <div class="kanban-body" data-status="Stuck"></div>
                                    <div class="kanban-footer">
                                        <button class="btn btn-sm btn-outline-danger w-100 add-todo-btn" data-status="Stuck">
                                            <i class="fas fa-plus me-1"></i> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="app-footer border-top mt-auto">
            <div class="float-end d-none d-sm-inline">v1.0</div>
            <strong>&copy; 2026</strong> Kanban Board
        </footer>
    </div>
</div>

<!-- Todo Modal -->
<div class="modal fade" id="todoModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title" id="modalTitle">
                    <i class="fas fa-plus-circle me-2"></i>Add New Todo
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <form id="todoForm">
                    <input type="hidden" id="todoId">
                    <div class="row g-3">
                        <div class="col-md-8">
                            <label class="form-label fw-semibold">Title <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="todoTitle" placeholder="Enter todo title" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Status</label>
                            <select class="form-select" id="todoStatus">
                                <option value="Backlog">Backlog</option>
                                <option value="Linedup">Lined Up</option>
                                <option value="Wip">WIP</option>
                                <option value="Done">Done</option>
                                <option value="Stuck">Stuck</option>
                            </select>
                        </div>
                        <div class="col-12">
                            <label class="form-label fw-semibold">Description</label>
                            <textarea class="form-control" id="todoDescription" rows="2" placeholder="Add description..."></textarea>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Priority</label>
                            <select class="form-select" id="todoPriority">
                                <option value="Urgent">Urgent</option>
                                <option value="High">High</option>
                                <option value="Medium" selected>Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Target Date</label>
                            <input type="date" class="form-control" id="todoTargetDate">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Project</label>
                            <select class="form-select" id="todoProject">
                                <option value="">Select Project</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Assign To</label>
                            <select class="form-select" id="todoUser">
                                <option value="">Select User</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Link</label>
                            <input type="url" class="form-control" id="todoLink" placeholder="https://...">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Completion</label>
                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" id="todoCompleted">
                                <label class="form-check-label" for="todoCompleted">Mark as Done</label>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer bg-light">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i> Cancel
                </button>
                <button type="button" class="btn btn-danger" id="deleteBtn" style="display:none;">
                    <i class="fas fa-trash me-1"></i> Delete
                </button>
                <button type="button" class="btn btn-primary" id="saveBtn">
                    <i class="fas fa-save me-1"></i> Save Changes
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Settings Modal -->
<div class="modal fade" id="settingsModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-dark text-white">
                <h5 class="modal-title"><i class="fas fa-cog me-2"></i>Settings</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="form-check form-switch mb-3">
                    <input class="form-check-input" type="checkbox" id="compactMode">
                    <label class="form-check-label" for="compactMode">Compact Mode</label>
                </div>
                <div class="form-check form-switch mb-3">
                    <input class="form-check-input" type="checkbox" id="showDescriptions" checked>
                    <label class="form-check-label" for="showDescriptions">Show Descriptions on Cards</label>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<!-- Search Modal -->
<div class="modal fade" id="searchModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content border-0 shadow">
            <div class="modal-header">
                <h5 class="modal-title"><i class="fas fa-search me-2"></i>Search Todos</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <input type="text" class="form-control form-control-lg" id="searchInput" placeholder="Type to search todos...">
                <div id="searchResults" class="mt-3"></div>
            </div>
        </div>
    </div>
</div>

<!-- Scripts -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/admin-lte@4.0.0-beta3/dist/js/adminlte.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqwidgets/19.0.0/jqwidgets/jqx-all.min.js"></script>
<script src="assets/js/app.js"></script>
<script>
// Helper to scroll to sections
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
</script>
</body>
</html>
