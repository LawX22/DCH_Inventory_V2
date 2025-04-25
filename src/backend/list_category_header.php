<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_connection.php';

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

$brand = isset($_GET['brand']) ? $_GET['brand'] : null;
$selectedLocation = isset($_GET['selectedLocation']) ? $_GET['selectedLocation'] : null;

$categorys = [];

if ($brand !== ' ' && $selectedLocation !== 'All') {
    // Both brand and location are set
    $stmt = $conn->prepare("SELECT DISTINCT category FROM inventory_merge WHERE brand = ? AND location = ? ORDER BY category ASC");
    $stmt->bind_param("ss", $brand, $selectedLocation);
    $stmt->execute();
    $result = $stmt->get_result();

} elseif ($brand !== ' ') {
    // Only brand is set
    $stmt = $conn->prepare("SELECT DISTINCT category FROM inventory_merge WHERE brand = ? ORDER BY category ASC");
    $stmt->bind_param("s", $brand);
    $stmt->execute();
    $result = $stmt->get_result();

} elseif ($selectedLocation !== 'All') {
    // Only location is set
    $stmt = $conn->prepare("SELECT DISTINCT category FROM inventory_merge WHERE location = ? ORDER BY category ASC");
    $stmt->bind_param("s", $selectedLocation);
    $stmt->execute();
    $result = $stmt->get_result();

} else {
    // No filters, get all
    $result = $conn->query("SELECT DISTINCT category FROM inventory_merge ORDER BY category ASC");
}

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $categorys[] = ["category" => $row["category"]];
    }
    echo json_encode($categorys);
} else {
    echo json_encode(["error" => $conn->error]);
}

$conn->close();
?>
