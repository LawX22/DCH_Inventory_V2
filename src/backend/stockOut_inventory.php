<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db_connection.php';
$data = $_POST;

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
    exit;
}

$stockId = $data['stockId'] ?? null;
$inventory_Id = $data['itemId'] ?? null;
$unitsAdded = $data['unitsAdded'] ?? null;
$reqNumber = $data['requisitionNum'] ?? null;
$dateStocked = $data['requisitionDate'] ?? null;
$username = $data['username'] ?? null;
$connector_id = $data['connector_id'] ?? null;

if (!$connector_id) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

// ✅ Step 1: Fetch existing inventory data
$fetchQuery = "SELECT units, itemCode, brand, category, itemDesc_1, itemDesc_2, location, storage_area
               FROM inventory_merge WHERE inventory_Id = ?";
$stmt = mysqli_prepare($conn, $fetchQuery);
mysqli_stmt_bind_param($stmt, "i", $inventory_Id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$inventoryData = mysqli_fetch_assoc($result);
mysqli_stmt_close($stmt);

if (!$inventoryData) {
    echo json_encode(["status" => "error", "message" => "Inventory item not found"]);
    exit;
}

// Extract data
$itemCode = $inventoryData['itemCode'];
$brand = $inventoryData['brand'];
$category = $inventoryData['category'];
$itemDesc_1 = $inventoryData['itemDesc_1'];
$itemDesc_2 = $inventoryData['itemDesc_2'];
$location = $inventoryData['location'];
$storage_area = $inventoryData['storage_area'];
$prevUnits = $inventoryData['units'];

$currUnits = $prevUnits - $unitsAdded;

$activity_performed = 'Removed ' . $unitsAdded . ' units from item ' . $itemDesc_1 . ' ' . $itemDesc_2;

// ✅ Step 2: Decrease units in WAREHOUSE
$updateQuery = "UPDATE inventory_merge SET units = units - ? WHERE inventory_Id = ?";
$stmt = mysqli_prepare($conn, $updateQuery);
mysqli_stmt_bind_param($stmt, "ii", $unitsAdded, $inventory_Id);
mysqli_stmt_execute($stmt);
mysqli_stmt_close($stmt);

// ✅ Step 3: If in WAREHOUSE, increase corresponding STORE entry
if ($location == 'WAREHOUSE') {
    $storeUpdateQuery = "UPDATE inventory_merge SET units  = units + ? 
                         WHERE connector_id = ? AND location = 'STORE' LIMIT 1";
    $stmt = mysqli_prepare($conn, $storeUpdateQuery);
    mysqli_stmt_bind_param($stmt, "ii", $unitsAdded, $connector_id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
}

// ✅ Step 4: Insert into stock_history
$insertQuery = "INSERT INTO stock_history 
                (inventory_Id, item_code, brand, category, stock_name, location,
                 units_added, requisition_number, transaction_date, encoder, transaction_type, current_stock, previous_units)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Stock Out', ?, ?)";
$stmt = mysqli_prepare($conn, $insertQuery);
mysqli_stmt_bind_param(
    $stmt,
    "issssssissii",
    $stockId,
    $itemCode,
    $brand,
    $category,
    $itemDesc_1,
    $location,
    $unitsAdded,
    $reqNumber,
    $dateStocked,
    $username,
    $currUnits,
    $prevUnits
);
mysqli_stmt_execute($stmt);
mysqli_stmt_close($stmt);

// ✅ Step 5: Insert into activity_report
$activity_sql = "INSERT INTO activity_report 
                (activity_type, date_performed, activity_performed, encoder, inventory_Id, location, time) 
                 VALUES ('Stock Out', NOW(), ?, ?, ?, ?, NOW())";
$stmt = mysqli_prepare($conn, $activity_sql);
mysqli_stmt_bind_param($stmt, "ssss", $activity_performed, $username, $inventory_Id, $location);
mysqli_stmt_execute($stmt);
mysqli_stmt_close($stmt);

echo json_encode(["status" => "success", "message" => "Stock updated successfully"]);

?>
