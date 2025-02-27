<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_connection.php';

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

$sql = "SELECT DISTINCT storage_area FROM inventory_merge ORDER BY storage_area ASC"; 

$result = $conn->query($sql);

$categories = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $categories[] = ["storage_area" => $row["storage_area"]];
    }
    echo json_encode($categories);
} else {
    echo json_encode(["error" => $conn->error]);
}

$conn->close();
?>
