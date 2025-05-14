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
    $storageArea = $conn->real_escape_string($_POST['storageArea'] ?? '');
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

    // Get the latest connector_id and increment it
    $connector_id_result = $conn->query("SELECT MAX(connector_id) AS max_id FROM inventory_merge");
    $new_connector_id = 1;
    if ($connector_id_result && $row = $connector_id_result->fetch_assoc()) {
        $new_connector_id = intval($row['max_id']) + 1;
    }

    // Prepare locations
    $locations = ['STORE', 'WAREHOUSE'];
    $success = true;
    $errors = [];

    foreach ($locations as $loc) {
        $sql = "INSERT INTO inventory_merge (connector_id, itemCode, brand, category, itemDesc_1, itemDesc_2, units, price, retail_price, location, storage_area, image, isDelete) 
                VALUES ('$new_connector_id', '$itemCode', '$itemBrand', '$itemCategory', '$description1', '$description2', '$units', '$fixedPrice', '$retailPrice', '$loc', '$storageArea', '$imagePath', 0)";
        if ($conn->query($sql) === TRUE) {
            $inventoryId = $conn->insert_id;
            $activity = "Added item $description1 to $loc";
            $activity_sql = "INSERT INTO activity_report (activity_type, date_performed, activity_performed, encoder, inventory_Id, location, time) 
                             VALUES ('Add Item', NOW(), '$activity', '$username', '$inventoryId', '$loc', NOW())";
            if (!$conn->query($activity_sql)) {
                $errors[] = "Failed to log activity for $loc: " . $conn->error;
                $success = false;
            }
        } else {
            $errors[] = "Failed to insert item for $loc: " . $conn->error;
            $success = false;
        }
    }

    $conn->close();

    if ($success) {
        echo json_encode(["message" => "Item added to STORE and WAREHOUSE successfully!", "image" => $imagePath]);
    } else {
        echo json_encode(["error" => $errors]);
    }

    exit;
}
?>
