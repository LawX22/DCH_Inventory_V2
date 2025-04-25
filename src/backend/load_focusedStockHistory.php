<?php
include 'db_connection.php'; // Database connection

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (!isset($_GET['inventory_Id'])) {
    echo json_encode(["error" => "Missing inventory_Id"]);
    exit;
}

$inventory_Id = $_GET['inventory_Id'];
$minDate = isset($_GET['minDate']) ? $_GET['minDate'] : null;
$maxDate = isset($_GET['maxDate']) ? $_GET['maxDate'] : null;
$transactionType = isset($_GET['transactionType']) ? $_GET['transactionType'] : null;

// 🔹 Base query
$sql = "SELECT * FROM stock_history WHERE inventory_Id = ?";
$params = [$inventory_Id];
$types = "i";

// 🔹 Optional filters
if (!empty($minDate)) {
    $sql .= " AND transaction_date >= ?";
    $params[] = $minDate;
    $types .= "s";
}
if (!empty($maxDate)) {
    $sql .= " AND transaction_date <= ?";
    $params[] = $maxDate;
    $types .= "s";
}
if (!empty($transactionType)) {
    $sql .= " AND transaction_type = ?";
    $params[] = $transactionType;
    $types .= "s";
}

$sql .= " ORDER BY transaction_date DESC LIMIT 500";

// 🔹 Prepare and execute
$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$history = [];
while ($row = $result->fetch_assoc()) {
    $history[] = $row;
}

echo json_encode($history);
?>
