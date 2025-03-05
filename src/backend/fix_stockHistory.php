<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include 'db_connection.php'; // Ensure this connects properly

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    error_log("POST Data: " . print_r($_POST, true));
    

    $itemId = $_POST['itemId'] ?? '';
    $Id = $_POST['Id'] ?? '';
    $requisitionNum = $_POST['requisitionNum'] ?? '';
    $requisitionDate = $_POST['requisitionDate'] ?? '';
    $unitsAdded = $_POST['unitsAdded'] ?? '';
    $username = $_POST['username'] ?? '';
    $inputChanged = $_POST['inputChanged'] ?? 'false';  // default to 'false'
    $type = $_POST['stockType'] ?? '';


    // Handle image update logic
    if ($inputChanged === 'true') {

        if($type==='Stock In'){
            $sql = "UPDATE stock_history 
                SET requisition_number = ?, transaction_date = ?, units_added = ?, image_path = ?
                WHERE stock_history_id = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("sssii", $requisitionNum, $requisitionDate, $unitsAdded, $destination, $Id);
        }else{
            $sql = "UPDATE stock_history 
                SET requisition_number = ?, transaction_date = ?, units_added = ?, image_path = ?
                WHERE stock_history_id = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("sssii", $requisitionNum, $requisitionDate, $unitsAdded, $destination, $Id);
        }

        }
    } else {
        // Update query without image
        $sql = "UPDATE stock_history 
                SET requisition_number = ?, transaction_date = ?
                WHERE stock_history_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssi", $requisitionNum, $requisitionDate, $Id);
    }

    // Execute query
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Item updated successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update item"]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
