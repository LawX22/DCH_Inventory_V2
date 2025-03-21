<?php
include 'db_connection.php'; // Your database connection file

// 🔥 Allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check if 'inventory_Id' is provided
if (!isset($_GET['inventory_Id'])) {
    echo json_encode(["error" => "Missing inventory_Id"]);
    exit;
}

$inventory_Id = $_GET['inventory_Id'];

$sql = "SELECT * FROM stock_history WHERE inventory_Id = ? ORDER BY transaction_date DESC LIMIT 500";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $inventory_Id);
$stmt->execute();
$result = $stmt->get_result();

$history = [];
while ($row = $result->fetch_assoc()) {
    $history[] = $row;
}

echo json_encode($history);
?>
