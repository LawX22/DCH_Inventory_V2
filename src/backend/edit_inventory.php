<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include 'db_connection.php'; // Ensure this file connects to your database

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $itemId = $_POST['itemId'] ?? '';
    $itemCode = $_POST['itemCode'] ?? '';
    $itemBrand = $_POST['itemBrand'] ?? '';
    $itemCategory = $_POST['itemCategory'] ?? '';
    $itemDesc1 = $_POST['description1'] ?? '';
    $itemDesc2 = $_POST['description2'] ?? '';
    $units = $_POST['units'] ?? '';
    $fixedPrice = $_POST['fixedPrice'] ?? '';
    $retailPrice = $_POST['retailPrice'] ?? '';
    $location = $_POST['location'] ?? '';
    $storageArea = $_POST['storageArea'] ?? '';
    $username = $_POST['username'] ?? '';

    if (!$itemId) {
        echo json_encode(["success" => false, "message" => "Item ID is required"]);
        exit;
    }

    // Update inventory
    $sql = "UPDATE inventory_merge 
            SET itemCode=?, brand=?, category=?, itemDesc_1=?, itemDesc_2=?, 
                units=?, price=?, retail_price=?, location=?, storage_area=? 
            WHERE inventory_Id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssddssi", $itemCode, $itemBrand, $itemCategory, $itemDesc1, $itemDesc2, 
                      $units, $fixedPrice, $retailPrice, $location, $storageArea, $itemId);

    if ($stmt->execute()) {
        // Log activity
        $activity_performed = "Updated item: " . $itemDesc1;
        $activity_sql = "INSERT INTO activity_report (activity_type, date_performed, activity_performed, encoder, inventory_Id, activity_category) 
                         VALUES (?, NOW(), ?, ?, ?, ?)";
        $activity_stmt = $conn->prepare($activity_sql);
        $activity_type = "Update Item";

        $activity_stmt->bind_param("sssis", $activity_type, $activity_performed, $username, $itemId, $location);

        if ($activity_stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Item updated and activity logged successfully!"]);
        } else {
            echo json_encode(["success" => false, "message" => "Item updated but failed to log activity: " . $conn->error]);
        }

        $activity_stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update item"]);
    }
    
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
