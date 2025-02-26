<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_connection.php';

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

$sql = "SELECT DISTINCT category FROM inventory_merge"; 

$result = $conn->query($sql);

$categories = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $categories[] = ["category" => $row["category"]];
    }
    echo json_encode($categories);
} else {
    echo json_encode(["error" => $conn->error]);
}

$conn->close();
?>
