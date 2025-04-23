<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

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
if (!$inventory_Id) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}
// ✅ **Step 1: Fetch existing inventory data**
$fetchQuery = "SELECT units, itemCode, brand, category, itemDesc_1, itemDesc_2, location, storage_area 
               FROM inventory_merge WHERE new_stock_id = ?";
$stmt = mysqli_prepare($conn, $fetchQuery);
mysqli_stmt_bind_param($stmt, "i", $stockId);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$inventoryData = mysqli_fetch_assoc($result);
mysqli_stmt_close($stmt);

if (!$inventoryData) {
    echo json_encode(["status" => "error", "message" => "Inventory item not found"]);
    exit;
}

// Extract fetched data into variables
$itemCode = $inventoryData['itemCode'];
$brand = $inventoryData['brand'];
$category = $inventoryData['category'];
$itemDesc_1 = $inventoryData['itemDesc_1'];
$itemDesc_2 = $inventoryData['itemDesc_2'];
$location = $inventoryData['location'];
$storage_area = $inventoryData['storage_area'];
$prevUnits = $inventoryData['units'];
$currUnits = $prevUnits + $unitsAdded; 

$activity_performed = 'Added ' . $unitsAdded . ' units to item ' . $itemDesc_1 . ' ' . $itemDesc_2;

// ✅ **Step 2: Update inventory units**
$updateQuery = "UPDATE inventory_merge SET units = units + ? WHERE new_stock_id = ?";
$stmt = mysqli_prepare($conn, $updateQuery);
mysqli_stmt_bind_param($stmt, "ii", $unitsAdded, $stockId);
mysqli_stmt_execute($stmt);
mysqli_stmt_close($stmt);

// ✅ **Step 3: Insert into stock_history**
$insertQuery = "INSERT INTO stock_history 
                (inventory_Id, item_code, brand, category, stock_name, location,
                units_added, requisition_number, transaction_date, encoder, transaction_type, current_stock, previous_units)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Stock In', ?, ?)";
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

// ✅ **Step 4: Insert into activity_report BEFORE sending response**
$activity_sql = "INSERT INTO activity_report (activity_type, date_performed, activity_performed, encoder, inventory_Id, location, time) 
                 VALUES ('Stock In', NOW(), ?, ?, ?, ?, NOW())";
$stmt = mysqli_prepare($conn, $activity_sql);
mysqli_stmt_bind_param($stmt, "ssss", $activity_performed, $username, $stockId, $location);
mysqli_stmt_execute($stmt);
mysqli_stmt_close($stmt);

// ✅ **Step 5: Send success response after all queries**
echo json_encode(["status" => "success", "message" => "Stock updated successfully"]);

?>
