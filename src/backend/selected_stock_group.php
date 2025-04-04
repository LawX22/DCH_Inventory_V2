<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $username = $input['username'] ?? null;
    $inventory_id = $input['inventory_Id'] ?? null;

    if (!$username || !$inventory_id) {
        echo json_encode(['success' => false, 'message' => 'Username or inventory_Id is missing']);
        exit;
    }

    try {
        $pdo = new PDO("mysql:host=localhost;dbname=dch_test_export", "root", "");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $pdo->prepare("INSERT INTO stock_group (username, inventory_Id) VALUES (:username, :inventory_Id)");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':inventory_Id', $inventory_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Data inserted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to insert data']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
