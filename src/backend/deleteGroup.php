<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Include DB
include 'db_connection.php';

// Decode JSON
$data = json_decode(file_get_contents("php://input"), true);

// Check if JSON decoding failed
if (!is_array($data)) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON data"]);
    exit;
}

// Retrieve stock_group_id from JSON data
$stock_group_id = $data['stock_group_id'];

if (empty($stock_group_id)) {
    echo json_encode(["status" => "error", "message" => "stock_group_id is required"]);
    exit;
}

// Prepare SQL query to delete the stock group by stock_group_id
$sql = "DELETE FROM stock_group WHERE stock_group_id = ?";
$stmt = $conn->prepare($sql);

// Bind parameters and execute
$stmt->bind_param("s", $stock_group_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
?>
