<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_connection.php';

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

$sql = "SELECT DISTINCT brand FROM inventory_merge ORDER BY brand ASC"; 

$result = $conn->query($sql);

$categories = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $categories[] = ["brand" => $row["brand"]];
    }
    echo json_encode($categories);
} else {
    echo json_encode(["error" => $conn->error]);
}

$conn->close();
?>
