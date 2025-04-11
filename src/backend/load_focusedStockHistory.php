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

// 🔹 Get values from inventory_merge first
$mergeQuery = "SELECT itemDesc_1, itemDesc_2, itemDesc_3, brand, category, itemCode 
               FROM inventory_merge 
               WHERE new_stock_id = ?";
$mergeStmt = $conn->prepare($mergeQuery);
$mergeStmt->bind_param("i", $inventory_Id);
$mergeStmt->execute();
$mergeResult = $mergeStmt->get_result();

$mergeRow = $mergeResult->fetch_assoc();
if (!$mergeRow) {
    echo json_encode(["error" => "No data found in inventory_merge"]);
    exit;
}

// 🔹 Combine descriptions into one
$combinedDesc = trim(
    $mergeRow['itemDesc_1'] . ' ' .
    $mergeRow['itemDesc_2'] . ' ' .
    $mergeRow['itemDesc_3']
);

// 🔹 Build the stock_history query using proper AND/OR grouping
$sql = "SELECT * FROM stock_history 
        WHERE (
            (brand = ? 
            AND category = ? 
            AND item_code = ? 
            AND stock_name = ?)
            OR inventory_Id = ?
        )";


$params = [
    $mergeRow['brand'],
    $mergeRow['category'],
    $mergeRow['itemCode'],
    $combinedDesc,
    $inventory_Id
];
$types = "ssssi";

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