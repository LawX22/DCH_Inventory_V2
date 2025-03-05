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
    $imageChange = $_POST['imageChange'] ?? '';  // This is your flag for image updates

    if (!$itemId) {
        echo json_encode(["success" => false, "message" => "Item ID is required"]);
        exit;
    }

    $imageName = null;

    // Handle new image upload if provided
    if (isset($_FILES['image']) && $_FILES['image']['error'] == UPLOAD_ERR_OK) {
        error_log("Image file detected: " . $_FILES['image']['name']);
        error_log("File type: " . $_FILES['image']['type']);
        error_log("File size: " . $_FILES['image']['size']);

        $targetDir = "uploads/";  // Make sure this folder exists
        $fileExtension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $imageName =  $targetDir . basename($_FILES['image']['name']);
        $targetFile = $targetDir . $imageName;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $imageName)) {
            error_log("Image successfully uploaded to: " . $targetFile);
        } else {
            error_log("Failed to move uploaded file.");
            echo json_encode(["success" => false, "message" => "Failed to upload image"]);
            exit;
        }
    } else {
        if ($imageChange === 'false') {
            // No image change, keep old image (do not update image column)
            $imageName = null;
            error_log("No image change requested, keeping existing image.");
        } elseif ($imageChange === 'true') {
            // User indicated image change but file was missing or error occurred
            error_log("Image change requested, but no valid image file received.");
        } else {
            error_log("No image file received and no clear imageChange flag.");
        }
    }

    // Prepare SQL (with or without image column)
    if ($imageChange === 'true') {
        // Update with new image
        $sql = "UPDATE inventory_merge 
                SET itemCode=?, brand=?, category=?, itemDesc_1=?, itemDesc_2=?, 
                    units=?, price=?, retail_price=?, location=?, storage_area=?, image=? 
                WHERE inventory_Id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssssddsssi", 
            $itemCode, $itemBrand, $itemCategory, $itemDesc1, $itemDesc2, 
            $units, $fixedPrice, $retailPrice, $location, $storageArea, $imageName, $itemId
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
                         (activity_type, date_performed, activity_performed, encoder, inventory_Id, location) 
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
