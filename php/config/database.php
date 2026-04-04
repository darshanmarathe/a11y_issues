<?php
// Use realpath for consistent path handling across platforms
$dbPath = __DIR__ . '/../data/todos.db';
define('DB_PATH', realpath(dirname($dbPath)) . '/todos.db');

function getDB() {
    static $db = null;
    if ($db === null) {
        // Check if PDO SQLite is available
        if (!in_array('sqlite', PDO::getAvailableDrivers())) {
            throw new Exception('SQLite PDO driver is not enabled. Please enable extension=pdo_sqlite in your php.ini file.');
        }
        
        try {
            $db = new PDO('sqlite:' . DB_PATH);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $db->exec('PRAGMA foreign_keys = ON');
        } catch (PDOException $e) {
            throw new Exception('Database connection failed: ' . $e->getMessage());
        }
    }
    return $db;
}

function initDB() {
    // Ensure data directory exists
    $dataDir = __DIR__ . '/../data';
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0755, true);
    }
    
    $db = getDB();
    
    // Create Projects table
    $db->exec("CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
    
    // Create Users table
    $db->exec("CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
    
    // Create Todos table
    $db->exec("CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'Backlog',
        priority TEXT DEFAULT 'Medium',
        isCompleted INTEGER DEFAULT 0,
        completion_date DATETIME,
        target_completion_date DATETIME,
        link TEXT,
        project_id INTEGER,
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )");
    
    // Insert default projects (using INSERT OR IGNORE to avoid duplicates)
    $db->exec("INSERT OR IGNORE INTO projects (id, name, description) VALUES (1, 'Default Project', 'Default project for todos')");
    $db->exec("INSERT OR IGNORE INTO projects (id, name, description) VALUES (2, 'Website Redesign', 'Company website redesign project')");
    $db->exec("INSERT OR IGNORE INTO projects (id, name, description) VALUES (3, 'Mobile App', 'Mobile application development')");
    
    // Reset auto increment after manual inserts
    $db->exec("UPDATE sqlite_sequence SET seq = 3 WHERE name = 'projects'");
    
    // Insert default users
    $db->exec("INSERT OR IGNORE INTO users (id, name, email) VALUES (1, 'Admin User', 'admin@example.com')");
    $db->exec("INSERT OR IGNORE INTO users (id, name, email) VALUES (2, 'John Doe', 'john@example.com')");
    $db->exec("INSERT OR IGNORE INTO users (id, name, email) VALUES (3, 'Jane Smith', 'jane@example.com')");
    
    // Reset auto increment after manual inserts
    $db->exec("UPDATE sqlite_sequence SET seq = 3 WHERE name = 'users'");
    
    // Check if sample todos exist
    $count = $db->query("SELECT COUNT(*) FROM todos")->fetchColumn();
    if ($count == 0) {
        // Insert sample todos
        $db->exec("INSERT INTO todos (id, title, description, status, priority, isCompleted, target_completion_date, project_id, user_id) 
            VALUES (1, 'Setup project structure', 'Create initial project folders and files', 'Done', 'High', 1, '2026-03-15', 1, 1)");
        $db->exec("INSERT INTO todos (id, title, description, status, priority, isCompleted, target_completion_date, project_id, user_id) 
            VALUES (2, 'Design database schema', 'Create SQLite database with all required tables', 'Done', 'High', 1, '2026-03-16', 1, 1)");
        $db->exec("INSERT INTO todos (id, title, description, status, priority, isCompleted, target_completion_date, project_id, user_id) 
            VALUES (3, 'Implement API endpoints', 'Create REST API for CRUD operations', 'Wip', 'High', 0, '2026-04-05', 1, 2)");
        $db->exec("INSERT INTO todos (id, title, description, status, priority, isCompleted, target_completion_date, project_id, user_id) 
            VALUES (4, 'Build Kanban board UI', 'Create interactive Kanban board with AdminLTE', 'Linedup', 'Medium', 0, '2026-04-10', 2, 3)");
        $db->exec("INSERT INTO todos (id, title, description, status, priority, isCompleted, target_completion_date, project_id, user_id) 
            VALUES (5, 'Add jqxWidgets controls', 'Integrate jqxWidgets for better UI components', 'Backlog', 'Low', 0, '2026-04-15', 2, 1)");
        $db->exec("INSERT INTO todos (id, title, description, status, priority, isCompleted, target_completion_date, project_id, user_id) 
            VALUES (6, 'Write documentation', 'Document the application features and usage', 'Stuck', 'Medium', 0, '2026-04-20', 3, 2)");
        
        // Reset auto increment after manual inserts
        $db->exec("UPDATE sqlite_sequence SET seq = 6 WHERE name = 'todos'");
    }
}
