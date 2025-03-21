<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection
include 'db_connection.php';

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize and get POST data
    $itemCode = $conn->real_escape_string($_POST['itemCode'] ?? '');
    $itemBrand = $conn->real_escape_string($_POST['itemBrand'] ?? '');
    $itemCategory = $conn->real_escape_string($_POST['itemCategory'] ?? '');
    $description1 = $conn->real_escape_string($_POST['description1'] ?? '');
    $description2 = $conn->real_escape_string($_POST['description2'] ?? '');
    $units = intval($_POST['units'] ?? 0);
    $fixedPrice = floatval($_POST['fixedPrice'] ?? 0);
    $retailPrice = floatval($_POST['retailPrice'] ?? 0);
    $location = $conn->real_escape_string($_POST['location'] ?? '');
    $storageArea = $conn->real_escape_string($_POST['storageArea'] ?? '');
    $description2 = $conn->real_escape_string($_POST['description2'] ?? '');
    $username = $conn->real_escape_string($_POST['username'] ?? '');

    // Image upload
    $imagePath = "";
    if (!empty($_FILES['image']['name'])) {
        $targetDir = "uploads/";
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0777, true);
        }
        $imagePath = $targetDir . basename($_FILES['image']['name']);
        move_uploaded_file($_FILES['image']['tmp_name'], $imagePath);
    }
    // Insert into database
    $sql = "INSERT INTO inventory_merge (itemCode, brand, category, itemDesc_1, itemDesc_2, units, price, retail_price, location, storage_area, image, isDelete) 
            VALUES ('$itemCode', '$itemBrand', '$itemCategory', '$description1', '$description2', '$units', '$fixedPrice', '$retailPrice', '$location', '$storageArea', '$imagePath', 0)";
if ($conn->query($sql) === TRUE) {
    $inventoryId = $conn->insert_id; // Get the last inserted ID
    $activity_performed = 'Added item '.$description1;
    // Insert into activity_report
    $activity_sql = "INSERT INTO activity_report (activity_type, date_performed, activity_performed, encoder, inventory_Id, location, time) 
    VALUES ('Add Item', NOW(), '$activity_performed', '$username' , '$inventoryId' , '$location',NOW())";
    if ($conn->query($activity_sql) === TRUE) {
        echo json_encode(["message" => "Item added successfully!", "image" => $imagePath]);
    } else {
        echo json_encode(["error" => "Item added but failed to log activity: " . $conn->error]);
    }
} else {
    echo json_encode(["error" => "Error: " . $conn->error]);
}
    $conn->close();
    exit;
}
?>
