<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_connection.php';

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

$category = isset($_GET['category']) ? $_GET['category'] : null;
$selectedLocation = isset($_GET['selectedLocation']) ? $_GET['selectedLocation'] : null;
$brands = [];

if ($category !== ' ' && $selectedLocation !== 'All') {
    // Both category and location are set
    $stmt = $conn->prepare("SELECT DISTINCT brand FROM inventory_merge WHERE category = ? AND location = ? ORDER BY brand ASC");
    $stmt->bind_param("ss", $category, $selectedLocation);
    $stmt->execute();
    $result = $stmt->get_result();

} elseif ($category !== ' ') {
    // Only category is set
    $stmt = $conn->prepare("SELECT DISTINCT brand FROM inventory_merge WHERE category = ? ORDER BY brand ASC");
    $stmt->bind_param("s", $category);
    $stmt->execute();
    $result = $stmt->get_result();

} elseif ($selectedLocation !== 'All') {
    // Only location is set
    $stmt = $conn->prepare("SELECT DISTINCT brand FROM inventory_merge WHERE location = ? ORDER BY brand ASC");
    $stmt->bind_param("s", $selectedLocation);
    $stmt->execute();
    $result = $stmt->get_result();

} else {
    // No filters, get all
    $result = $conn->query("SELECT DISTINCT brand FROM inventory_merge ORDER BY brand ASC");
}

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $brands[] = ["brand" => $row["brand"]];
    }
    echo json_encode($brands);
} else {
    echo json_encode(["error" => $conn->error]);
}

$conn->close();
?>
