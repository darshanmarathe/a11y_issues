<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../config/database.php';

// Initialize database if not exists
if (!file_exists(__DIR__ . '/../data/todos.db')) {
    initDB();
}

$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_GET['resource']) ? $_GET['resource'] : '';
$action = isset($_GET['action']) ? $_GET['action'] : '';

try {
    switch ($path) {
        case 'todos':
            handleTodos($method);
            break;
        case 'projects':
            handleProjects($method);
            break;
        case 'users':
            handleUsers($method);
            break;
        default:
            echo json_encode(['error' => 'Invalid resource']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

function handleTodos($method) {
    $db = getDB();
    
    switch ($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                $stmt = $db->prepare("SELECT t.*, p.name as project_name, u.name as user_name 
                    FROM todos t 
                    LEFT JOIN projects p ON t.project_id = p.id 
                    LEFT JOIN users u ON t.user_id = u.id 
                    WHERE t.id = ?");
                $stmt->execute([$_GET['id']]);
                echo json_encode($stmt->fetch());
            } else {
                $stmt = $db->query("SELECT t.*, p.name as project_name, u.name as user_name 
                    FROM todos t 
                    LEFT JOIN projects p ON t.project_id = p.id 
                    LEFT JOIN users u ON t.user_id = u.id 
                    ORDER BY t.created_at DESC");
                echo json_encode($stmt->fetchAll());
            }
            break;
            
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $db->prepare("INSERT INTO todos (title, description, status, priority, isCompleted, target_completion_date, link, project_id, user_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['title'] ?? '',
                $data['description'] ?? '',
                $data['status'] ?? 'Backlog',
                $data['priority'] ?? 'Medium',
                $data['isCompleted'] ?? 0,
                $data['target_completion_date'] ?? null,
                $data['link'] ?? null,
                $data['project_id'] ?? null,
                $data['user_id'] ?? null
            ]);
            echo json_encode(['id' => $db->lastInsertId(), 'message' => 'Todo created successfully']);
            break;
            
        case 'PUT':
            if (isset($_GET['id'])) {
                $data = json_decode(file_get_contents('php://input'), true);
                $stmt = $db->prepare("UPDATE todos SET 
                    title = ?, description = ?, status = ?, priority = ?, 
                    isCompleted = ?, target_completion_date = ?, link = ?, 
                    project_id = ?, user_id = ?, updated_at = CURRENT_TIMESTAMP 
                    WHERE id = ?");
                
                // Set completion date if completed
                $completionDate = null;
                if (($data['isCompleted'] ?? 0) == 1) {
                    $completionDate = date('Y-m-d H:i:s');
                }
                
                $stmt->execute([
                    $data['title'] ?? '',
                    $data['description'] ?? '',
                    $data['status'] ?? 'Backlog',
                    $data['priority'] ?? 'Medium',
                    $data['isCompleted'] ?? 0,
                    $data['target_completion_date'] ?? null,
                    $data['link'] ?? null,
                    $data['project_id'] ?? null,
                    $data['user_id'] ?? null,
                    $_GET['id']
                ]);
                echo json_encode(['message' => 'Todo updated successfully']);
            }
            break;
            
        case 'DELETE':
            if (isset($_GET['id'])) {
                $stmt = $db->prepare("DELETE FROM todos WHERE id = ?");
                $stmt->execute([$_GET['id']]);
                echo json_encode(['message' => 'Todo deleted successfully']);
            }
            break;
    }
}

function handleProjects($method) {
    $db = getDB();
    
    switch ($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                $stmt = $db->prepare("SELECT * FROM projects WHERE id = ?");
                $stmt->execute([$_GET['id']]);
                echo json_encode($stmt->fetch());
            } else {
                $stmt = $db->query("SELECT * FROM projects ORDER BY name");
                echo json_encode($stmt->fetchAll());
            }
            break;
            
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $db->prepare("INSERT INTO projects (name, description) VALUES (?, ?)");
            $stmt->execute([$data['name'] ?? '', $data['description'] ?? '']);
            echo json_encode(['id' => $db->lastInsertId(), 'message' => 'Project created successfully']);
            break;
            
        case 'PUT':
            if (isset($_GET['id'])) {
                $data = json_decode(file_get_contents('php://input'), true);
                $stmt = $db->prepare("UPDATE projects SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
                $stmt->execute([$data['name'] ?? '', $data['description'] ?? '', $_GET['id']]);
                echo json_encode(['message' => 'Project updated successfully']);
            }
            break;
            
        case 'DELETE':
            if (isset($_GET['id'])) {
                $stmt = $db->prepare("DELETE FROM projects WHERE id = ?");
                $stmt->execute([$_GET['id']]);
                echo json_encode(['message' => 'Project deleted successfully']);
            }
            break;
    }
}

function handleUsers($method) {
    $db = getDB();
    
    switch ($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
                $stmt->execute([$_GET['id']]);
                echo json_encode($stmt->fetch());
            } else {
                $stmt = $db->query("SELECT * FROM users ORDER BY name");
                echo json_encode($stmt->fetchAll());
            }
            break;
            
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $db->prepare("INSERT INTO users (name, email) VALUES (?, ?)");
            $stmt->execute([$data['name'] ?? '', $data['email'] ?? '']);
            echo json_encode(['id' => $db->lastInsertId(), 'message' => 'User created successfully']);
            break;
            
        case 'PUT':
            if (isset($_GET['id'])) {
                $data = json_decode(file_get_contents('php://input'), true);
                $stmt = $db->prepare("UPDATE users SET name = ?, email = ? WHERE id = ?");
                $stmt->execute([$data['name'] ?? '', $data['email'] ?? '', $_GET['id']]);
                echo json_encode(['message' => 'User updated successfully']);
            }
            break;
            
        case 'DELETE':
            if (isset($_GET['id'])) {
                $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
                $stmt->execute([$_GET['id']]);
                echo json_encode(['message' => 'User deleted successfully']);
            }
            break;
    }
}
