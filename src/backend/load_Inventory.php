<?php
header("Access-Control-Allow-Origin: *");  // Allow any origin (change this in production)
header("Content-Type: application/json");

include 'db_connection.php';  // Include database connection

$sql = "SELECT * FROM inventory_merge ORDER BY inventory_id DESC LIMIT 100";  
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
} else {
    echo json_encode([]);
}

$conn->close();
?>
