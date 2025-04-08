<?php

// Show all PHP errors for debugging
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

// Prepare and execute insert
foreach ($data as $item) {
    $stock_group_id = $item['stock_group_id'];
    $itemDesc_1 = $item['itemDesc_1'];
    $brand = $item['brand'];
    $category = $item['category'];
    $units = $item['units'];
    $units_added = $item['units_added'];
    $transaction_date = $item['transaction_date'];
    $transaction_type = $item['transaction_type'];
    $date_updated = $item['date_updated'];
    $encoder = $item['encoder'];

    $stmt = $conn->prepare("INSERT INTO stock_history (itemDesc_1, brand, category, units, units_added, transaction_date, transaction_type, date_updated, encoder) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("ssssissss", $itemDesc_1, $brand, $category, $units, $units_added, $transaction_date, $transaction_type, $date_updated, $encoder);
    if (!$stmt->execute()) {
        echo json_encode(["status" => "error", "message" => "Execute failed: " . $stmt->error]);
        exit;
    }
}

// Success response
echo json_encode(["status" => "success"]);
?>
