<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

error_reporting(E_ALL);
ini_set('display_errors', 1);

include "db_connection.php"; // Ensure correct path

// Check database connection
if (!$conn) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

// Get raw input data
$json = file_get_contents("php://input");

if (empty($json)) {
    echo json_encode(["success" => false, "message" => "Empty request body"]);
    exit;
}

$data = json_decode($json, true);

if ($data === null) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON received",
        "raw_input" => $json // Debugging
    ]);
    exit;
}

// Check if action is provided
if (!isset($data["action"])) {
    echo json_encode(["success" => false, "message" => "No action provided"]);
    exit;
}

// Process request
if ($data["action"] === "clearSelection") {
    $query = "UPDATE inventory_merge SET isSelected = 0";
    $stmt = $conn->prepare($query);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Selection cleared"]);
    } else {
        echo json_encode(["success" => false, "message" => "Database update failed"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid action"]);
}
?>
