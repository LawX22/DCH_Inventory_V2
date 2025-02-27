<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection
include 'db_connection.php';


if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

$sql = "SELECT category from inventory_merge GROUP BY category ORDER BY category ASC;"; // Change 'brands_table' to your actual table name
$result = $conn->query($sql);

$brands = [];
while ($row = $result->fetch_assoc()) {
    $brands[] = $row["category"];
}

echo json_encode($brands);
$conn->close();
?>
