<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include 'db_connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($data === null) {
    die(json_encode(['status' => 'error', 'message' => 'Invalid JSON data received.']));
}

if (!$conn) {
    die(json_encode(['status' => 'error', 'message' => 'Connection failed: ' . mysqli_connect_error()]));
}

$date_updated = date('Y-m-d H:i:s');
$transaction_date = $data['date'] ?? null;
$transaction_type = $data['stockType'] ?? null;
$reqnum = $data['reqnum'] ?? null;
$encoder = $data['user'] ?? null;

if (!$transaction_date || !$transaction_type || !$reqnum || !$encoder) {
    die(json_encode(['status' => 'error', 'message' => 'Required data is missing.']));
}

$stmt = $conn->prepare("INSERT INTO stock_history (
    date_updated, 
    transaction_date, 
    transaction_type, 
    requisition_number, 
    encoder, 
    previous_units, 
    stock_name, 
    units_added, 
    brand
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

if (!$stmt) {
    die(json_encode(['status' => 'error', 'message' => 'MySQL prepare failed: ' . mysqli_error($conn)]));
}

if (!isset($data['items']) || !is_array($data['items']) || empty($data['items'])) {
    die(json_encode(['status' => 'error', 'message' => 'No items found in the data.']));
}

foreach ($data['items'] as $item) {
    $previous_units = $item['units'] ?? null;
    $stock_name = $item['description'] ?? null;
    $units_added = $item['quantity'] ?? null;
    $brand = $item['brand'] ?? null;

    if (!$previous_units || !$stock_name || !$units_added || !$brand) {
        die(json_encode(['status' => 'error', 'message' => 'Incomplete item data received.']));
    }

    $stmt->bind_param("sssssssss", $date_updated, $transaction_date, $transaction_type, $reqnum, $encoder, $previous_units, $stock_name, $units_added, $brand);

    if (!$stmt->execute()) {
        die(json_encode(['status' => 'error', 'message' => 'Insert error: ' . $stmt->error]));
    }
}

// Now delete from stock_group with same encoder
$delete_stmt = $conn->prepare("DELETE FROM stock_group WHERE encoder = ?");
if ($delete_stmt) {
    $delete_stmt->bind_param("s", $encoder);
    if (!$delete_stmt->execute()) {
        die(json_encode(['status' => 'error', 'message' => 'Delete error: ' . $delete_stmt->error]));
    }
    $delete_stmt->close();
} else {
    die(json_encode(['status' => 'error', 'message' => 'Delete prepare failed: ' . $conn->error]));
}

$stmt->close();
$conn->close();

echo json_encode(['status' => 'success', 'message' => 'Records inserted and old stock_group rows deleted.']);
?>
