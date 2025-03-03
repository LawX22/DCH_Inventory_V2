<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include 'db_connection.php'; // Ensure this file connects to your database

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Log all received data for debugging
    error_log("POST Data: " . print_r($_POST, true));
    error_log("FILES Data: " . print_r($_FILES, true));

    $itemId = $_POST['itemId'] ?? '';
    $Id = $_POST['Id'] ?? '';
    $requisitionNum = $_POST['requisitionNum'] ?? '';
    $requisitionDate = $_POST['requisitionDate'] ?? '';
    $unitsAdded = $_POST['unitsAdded'] ?? '';
    $username = $_POST['username'] ?? '';
    $inputChanged = $_POST['inputChanged'] ?? '';
      // This is your flag for image updates

    if ($inputChanged===true) {
       
    }

    else{

    }

    $imageName = null;

    

    // Prepare SQL (with or without image column)
    if ($imageChange != 'true') {
        // Update with new image
        $sql = "UPDATE stock_history
                SET transaction_date=?, requisition_number=?
                WHERE stock_history_id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssi", 
            $requisitionDate, $requisitionNum, $Id
        );
    } else {
        // Update without changing image
        $sql = "UPDATE inventory_merge 
                SET itemCode=?, brand=?, category=?, itemDesc_1=?, itemDesc_2=?, 
                    units=?, price=?, retail_price=?, location=?, storage_area=? 
                WHERE inventory_Id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssssddssi", 
            $itemCode, $itemBrand, $itemCategory, $itemDesc1, $itemDesc2, 
            $units, $fixedPrice, $retailPrice, $location, $storageArea, $itemId
        );
    }

    if ($stmt->execute()) {
        // Log successful update
        error_log("Item with ID $itemId successfully updated.");

        // Log activity to the activity_report table
        $activity_performed = "Updated item: " . $itemDesc1;
        $activity_sql = "INSERT INTO activity_report 
                         (activity_type, date_performed, activity_performed, encoder, inventory_Id, activity_category) 
                         VALUES (?, NOW(), ?, ?, ?, ?)";
        $activity_stmt = $conn->prepare($activity_sql);
        $activity_type = "Update Item";
        $activity_stmt->bind_param("sssis", 
            $activity_type, $activity_performed, $username, $itemId, $location
        );

        if ($activity_stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Item updated and activity logged successfully!"]);
        } else {
            error_log("Failed to log activity: " . $conn->error);
            echo json_encode(["success" => false, "message" => "Item updated but failed to log activity"]);
        }

        $activity_stmt->close();
    } else {
        error_log("Failed to update item with ID $itemId: " . $conn->error);
        echo json_encode(["success" => false, "message" => "Failed to update item"]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
