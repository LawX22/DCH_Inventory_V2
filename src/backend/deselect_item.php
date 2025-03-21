<?php
include 'db_connection.php';


header('Access-Control-Allow-Origin: *'); // Allow requests from any origin
header('Access-Control-Allow-Methods: POST, OPTIONS'); // Allow only POST and OPTIONS requests
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Allow specific headers
header('Content-Type: application/json');


// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['inventory_Id'])) {
    $inventory_Id = $data['inventory_Id'];

    $sql = "UPDATE inventory_merge SET isSelected = 0 WHERE inventory_Id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $inventory_Id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Item updated"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update"]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
}
?>
