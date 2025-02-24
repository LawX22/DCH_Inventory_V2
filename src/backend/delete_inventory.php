<?php
header("Access-Control-Allow-Origin: *"); // Allow all origins
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
header("Content-Type: application/json");

include 'db_connection.php'; // Ensure this file establishes $conn

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = $_POST['id'] ?? '';
    $username = $_POST['user'] ?? 'Unknown'; // Default if username is missing

    if (empty($id)) {
        echo json_encode(["success" => false, "error" => "Missing ID"]);
        exit;
    }

    // Soft delete item
    $sql = "UPDATE inventory_merge SET isDelete = 1 WHERE inventory_id = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(["success" => false, "error" => "Failed to prepare statement: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        // Log the deletion into activity_report
        $activity_performed = "Deleted item with ID " . $id;
        $log_sql = "INSERT INTO activity_report (activity_type, date_performed, activity_performed, encoder, inventory_Id) 
                    VALUES ('Delete Item', NOW(), ?, ?, ?)";
        $log_stmt = $conn->prepare($log_sql);

        if ($log_stmt) {
            $log_stmt->bind_param("ssi", $activity_performed, $username, $id);
            $log_stmt->execute();
            $log_stmt->close();
        }

        echo json_encode(["success" => true, "message" => "Item marked as deleted and logged successfully"]);
    } else {
        echo json_encode(["success" => false, "error" => "Execution failed: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "error" => "Invalid request method"]);
}
