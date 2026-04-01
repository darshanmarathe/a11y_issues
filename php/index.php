<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo Kanban Board</title>
    
    <!-- Google Font: Source Sans Pro -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- AdminLTE -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/admin-lte@4.0.0-beta3/dist/css/adminlte.min.css">
    <!-- jqxWidgets Material Theme -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqwidgets/19.0.0/jqwidgets/styles/jqx.material.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="hold-transition sidebar-mini layout-fixed">
<div class="wrapper">
    <!-- Navbar -->
    <nav class="app-header navbar navbar-expand bg-dark">
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link" data-lte-toggle="sidebar" href="#" role="button">
                    <i class="fas fa-bars"></i>
                </a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link">Home</a>
            </li>
        </ul>
        <ul class="navbar-nav ms-auto">
            <li class="nav-item">
                <span class="nav-link text-white" id="currentDate"></span>
            </li>
        </ul>
    </nav>

    <!-- Main Sidebar Container -->
    <aside class="app-sidebar bg-dark" data-bs-theme="dark">
        <!-- Sidebar Brand -->
        <div class="app-sidebar-header">
            <a href="#" class="app-brand-link">
                <span class="app-brand-text dark-mode text ms-2">Todo Kanban</span>
            </a>
        </div>
        
        <!-- Sidebar Menu -->
        <div class="app-sidebar-body">
            <nav class="mt-2">
                <ul class="nav sidebar-menu flex-column" data-lte-toggle="treeview" role="menu">
                    <li class="nav-item">
                        <a href="#" class="nav-link active">
                            <i class="nav-icon fas fa-columns"></i>
                            <p>Kanban Board</p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link" data-toggle="modal" data-target="#todoModal">
                            <i class="nav-icon fas fa-plus"></i>
                            <p>New Todo</p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link" id="refreshBtn">
                            <i class="nav-icon fas fa-sync"></i>
                            <p>Refresh</p>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </aside>

    <!-- Content Wrapper -->
    <div class="app-wrapper">
        <!-- Content Header -->
        <div class="app-content-header">
            <div class="container-fluid">
                <div class="row mb-2">
                    <div class="col-sm-6">
                        <h1 class="m-0">Kanban Board</h1>
                    </div>
                    <div class="col-sm-6">
                        <ol class="breadcrumb float-sm-end">
                            <li class="breadcrumb-item"><a href="#">Home</a></li>
                            <li class="breadcrumb-item active" aria-current="page">Kanban</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main content -->
        <div class="app-content">
            <div class="container-fluid">
                <!-- Statistics Cards -->
                <div class="row">
                    <div class="col-lg-2 col-6">
                        <div class="small-box bg-info">
                            <h3 id="totalTodos">0</h3>
                            <p>Total</p>
                        </div>
                    </div>
                    <div class="col-lg-2 col-6">
                        <div class="small-box bg-secondary">
                            <h3 id="backlogCount">0</h3>
                            <p>Backlog</p>
                        </div>
                    </div>
                    <div class="col-lg-2 col-6">
                        <div class="small-box bg-warning">
                            <h3 id="linedupCount">0</h3>
                            <p>Lined Up</p>
                        </div>
                    </div>
                    <div class="col-lg-2 col-6">
                        <div class="small-box bg-primary">
                            <h3 id="wipCount">0</h3>
                            <p>WIP</p>
                        </div>
                    </div>
                    <div class="col-lg-2 col-6">
                        <div class="small-box bg-success">
                            <h3 id="doneCount">0</h3>
                            <p>Done</p>
                        </div>
                    </div>
                    <div class="col-lg-2 col-6">
                        <div class="small-box bg-danger">
                            <h3 id="stuckCount">0</h3>
                            <p>Stuck</p>
                        </div>
                    </div>
                </div>

                <!-- Kanban Board -->
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Todo Kanban Board</h3>
                                <div class="card-tools">
                                    <button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#todoModal">
                                        <i class="fas fa-plus"></i> Add Todo
                                    </button>
                                </div>
                            </div>
                            <div class="card-body">
                                <div id="kanbanBoard" class="kanban-container">
                                    <div class="row">
                                        <!-- Backlog Column -->
                                        <div class="col-lg-2 col-md-4">
                                            <div class="card kanban-column" data-status="Backlog">
                                                <div class="card-header bg-secondary">
                                                    <h5 class="card-title mb-0">Backlog</h5>
                                                    <span class="badge bg-light text-dark float-end" id="badge-Backlog">0</span>
                                                </div>
                                                <div class="card-body kanban-column-body" data-status="Backlog"></div>
                                                <div class="card-footer">
                                                    <button class="btn btn-sm btn-block btn-outline-secondary add-todo-btn" data-status="Backlog">
                                                        <i class="fas fa-plus"></i> Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Lined Up Column -->
                                        <div class="col-lg-2 col-md-4">
                                            <div class="card kanban-column" data-status="Linedup">
                                                <div class="card-header bg-warning">
                                                    <h5 class="card-title mb-0">Lined Up</h5>
                                                    <span class="badge bg-light text-dark float-end" id="badge-Linedup">0</span>
                                                </div>
                                                <div class="card-body kanban-column-body" data-status="Linedup"></div>
                                                <div class="card-footer">
                                                    <button class="btn btn-sm btn-block btn-outline-warning add-todo-btn" data-status="Linedup">
                                                        <i class="fas fa-plus"></i> Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- WIP Column -->
                                        <div class="col-lg-2 col-md-4">
                                            <div class="card kanban-column" data-status="Wip">
                                                <div class="card-header bg-primary">
                                                    <h5 class="card-title mb-0">WIP</h5>
                                                    <span class="badge bg-light text-dark float-end" id="badge-Wip">0</span>
                                                </div>
                                                <div class="card-body kanban-column-body" data-status="Wip"></div>
                                                <div class="card-footer">
                                                    <button class="btn btn-sm btn-block btn-outline-primary add-todo-btn" data-status="Wip">
                                                        <i class="fas fa-plus"></i> Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Done Column -->
                                        <div class="col-lg-2 col-md-4">
                                            <div class="card kanban-column" data-status="Done">
                                                <div class="card-header bg-success">
                                                    <h5 class="card-title mb-0">Done</h5>
                                                    <span class="badge bg-light text-dark float-end" id="badge-Done">0</span>
                                                </div>
                                                <div class="card-body kanban-column-body" data-status="Done"></div>
                                                <div class="card-footer">
                                                    <button class="btn btn-sm btn-block btn-outline-success add-todo-btn" data-status="Done">
                                                        <i class="fas fa-plus"></i> Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Stuck Column -->
                                        <div class="col-lg-2 col-md-4">
                                            <div class="card kanban-column" data-status="Stuck">
                                                <div class="card-header bg-danger">
                                                    <h5 class="card-title mb-0">Stuck</h5>
                                                    <span class="badge bg-light text-dark float-end" id="badge-Stuck">0</span>
                                                </div>
                                                <div class="card-body kanban-column-body" data-status="Stuck"></div>
                                                <div class="card-footer">
                                                    <button class="btn btn-sm btn-block btn-outline-danger add-todo-btn" data-status="Stuck">
                                                        <i class="fas fa-plus"></i> Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="app-footer">
        <div class="float-end d-none d-sm-inline">Anything you want</div>
        <strong>Copyright &copy; 2026</strong> All rights reserved.
    </footer>
</div>

<!-- Todo Modal -->
<div class="modal fade" id="todoModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalTitle">Add New Todo</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="todoForm">
                    <input type="hidden" id="todoId">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="todoTitle" class="form-label">Title *</label>
                                <input type="text" class="form-control" id="todoTitle" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="todoStatus" class="form-label">Status</label>
                                <select class="form-select" id="todoStatus">
                                    <option value="Backlog">Backlog</option>
                                    <option value="Linedup">Lined Up</option>
                                    <option value="Wip">WIP</option>
                                    <option value="Done">Done</option>
                                    <option value="Stuck">Stuck</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="todoDescription" class="form-label">Description</label>
                        <textarea class="form-control" id="todoDescription" rows="3"></textarea>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="todoPriority" class="form-label">Priority</label>
                                <select class="form-select" id="todoPriority">
                                    <option value="Urgent">Urgent</option>
                                    <option value="High">High</option>
                                    <option value="Medium" selected>Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="todoTargetDate" class="form-label">Target Completion Date</label>
                                <input type="date" class="form-control" id="todoTargetDate">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="todoProject" class="form-label">Project</label>
                                <select class="form-select" id="todoProject">
                                    <option value="">Select Project</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="todoUser" class="form-label">User</label>
                                <select class="form-select" id="todoUser">
                                    <option value="">Select User</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="todoLink" class="form-label">Link</label>
                        <input type="url" class="form-control" id="todoLink" placeholder="https://...">
                    </div>
                    <div class="mb-3">
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="todoCompleted">
                            <label class="form-check-label" for="todoCompleted">Mark as Completed</label>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger" id="deleteBtn" style="display:none;">
                    <i class="fas fa-trash"></i> Delete
                </button>
                <button type="button" class="btn btn-primary" id="saveBtn">
                    <i class="fas fa-save"></i> Save
                </button>
            </div>
        </div>
    </div>
</div>

<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<!-- Bootstrap -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<!-- AdminLTE -->
<script src="https://cdn.jsdelivr.net/npm/admin-lte@4.0.0-beta3/dist/js/adminlte.min.js"></script>
<!-- jqxWidgets -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqwidgets/19.0.0/jqwidgets/jqx-all.min.js"></script>
<!-- Custom JS -->
<script src="assets/js/app.js"></script>
</body>
</html>
