<?php
// Allow requests from any origin (adjust this for security)
header("Access-Control-Allow-Origin: *");

// Allow these HTTP methods
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Allow these headers in the request
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db_connection.php'; // Your database connection

$data = json_decode(file_get_contents("php://input"), true);
$itemId = $data['itemId'];
$isSelected = $data['isSelected'];

$sql = "UPDATE inventory_merge SET isSelected = ? WHERE inventory_Id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $isSelected, $itemId);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
