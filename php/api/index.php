<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../config/database.php';

try {
    // Initialize database if not exists
    if (!file_exists(__DIR__ . '/../data/todos.db')) {
        initDB();
    }

    $method = $_SERVER['REQUEST_METHOD'];
    $resource = isset($_GET['resource']) ? $_GET['resource'] : '';

    switch ($resource) {
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
            http_response_code(400);
            echo json_encode(['error' => 'Invalid resource. Use: todos, projects, or users']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
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
                $result = $stmt->fetch();
                echo json_encode($result ?: ['error' => 'Todo not found']);
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
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid JSON data']);
                return;
            }
            
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
                $input = file_get_contents('php://input');
                $data = json_decode($input, true);
                
                if (json_last_error() !== JSON_ERROR_NONE) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid JSON data']);
                    return;
                }
                
                $stmt = $db->prepare("UPDATE todos SET 
                    title = ?, description = ?, status = ?, priority = ?, 
                    isCompleted = ?, target_completion_date = ?, link = ?, 
                    project_id = ?, user_id = ?, updated_at = CURRENT_TIMESTAMP 
                    WHERE id = ?");
                
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
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Todo ID required']);
            }
            break;
            
        case 'DELETE':
            if (isset($_GET['id'])) {
                $stmt = $db->prepare("DELETE FROM todos WHERE id = ?");
                $stmt->execute([$_GET['id']]);
                echo json_encode(['message' => 'Todo deleted successfully']);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Todo ID required']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
}

function handleProjects($method) {
    $db = getDB();
    
    switch ($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                $stmt = $db->prepare("SELECT * FROM projects WHERE id = ?");
                $stmt->execute([$_GET['id']]);
                $result = $stmt->fetch();
                echo json_encode($result ?: ['error' => 'Project not found']);
            } else {
                $stmt = $db->query("SELECT * FROM projects ORDER BY name");
                echo json_encode($stmt->fetchAll());
            }
            break;
            
        case 'POST':
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid JSON data']);
                return;
            }
            
            $stmt = $db->prepare("INSERT INTO projects (name, description) VALUES (?, ?)");
            $stmt->execute([$data['name'] ?? '', $data['description'] ?? '']);
            echo json_encode(['id' => $db->lastInsertId(), 'message' => 'Project created successfully']);
            break;
            
        case 'PUT':
            if (isset($_GET['id'])) {
                $input = file_get_contents('php://input');
                $data = json_decode($input, true);
                
                if (json_last_error() !== JSON_ERROR_NONE) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid JSON data']);
                    return;
                }
                
                $stmt = $db->prepare("UPDATE projects SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
                $stmt->execute([$data['name'] ?? '', $data['description'] ?? '', $_GET['id']]);
                echo json_encode(['message' => 'Project updated successfully']);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Project ID required']);
            }
            break;
            
        case 'DELETE':
            if (isset($_GET['id'])) {
                $stmt = $db->prepare("DELETE FROM projects WHERE id = ?");
                $stmt->execute([$_GET['id']]);
                echo json_encode(['message' => 'Project deleted successfully']);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Project ID required']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
}

function handleUsers($method) {
    $db = getDB();
    
    switch ($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
                $stmt->execute([$_GET['id']]);
                $result = $stmt->fetch();
                echo json_encode($result ?: ['error' => 'User not found']);
            } else {
                $stmt = $db->query("SELECT * FROM users ORDER BY name");
                echo json_encode($stmt->fetchAll());
            }
            break;
            
        case 'POST':
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid JSON data']);
                return;
            }
            
            $stmt = $db->prepare("INSERT INTO users (name, email) VALUES (?, ?)");
            $stmt->execute([$data['name'] ?? '', $data['email'] ?? '']);
            echo json_encode(['id' => $db->lastInsertId(), 'message' => 'User created successfully']);
            break;
            
        case 'PUT':
            if (isset($_GET['id'])) {
                $input = file_get_contents('php://input');
                $data = json_decode($input, true);
                
                if (json_last_error() !== JSON_ERROR_NONE) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid JSON data']);
                    return;
                }
                
                $stmt = $db->prepare("UPDATE users SET name = ?, email = ? WHERE id = ?");
                $stmt->execute([$data['name'] ?? '', $data['email'] ?? '', $_GET['id']]);
                echo json_encode(['message' => 'User updated successfully']);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'User ID required']);
            }
            break;
            
        case 'DELETE':
            if (isset($_GET['id'])) {
                $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
                $stmt->execute([$_GET['id']]);
                echo json_encode(['message' => 'User deleted successfully']);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'User ID required']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
}
