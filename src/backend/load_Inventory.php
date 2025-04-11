<?php
header("Access-Control-Allow-Origin: *"); // Allow all origins
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include 'db_connection.php'; // Ensure you have your DB connection here

$location = isset($_GET['location']) ? $_GET['location'] : '';
$searchQuery = isset($_GET['search']) ? $_GET['search'] : '';
$brand = isset($_GET['brand']) ? $_GET['brand'] : '';
$category = isset($_GET['category']) ? $_GET['category'] : '';
$area = isset($_GET['area']) ? $_GET['area'] : '';
$stock = isset($_GET['stock']) ? $_GET['stock'] : '';


$sql = "SELECT * FROM inventory_merge WHERE 1=1 AND isDelete=0";

// Filter by location if selected
if ($location !== '' && $location !== 'All') {
    $sql .= " AND location = ?";
}



// Apply search filter on itemCode or concatenated itemDesc_1 & itemDesc_2
if ($searchQuery !== '') {  
    $sql .= " AND (itemCode LIKE ? OR CONCAT(IFNULL(itemDesc_1, ''), IFNULL(itemDesc_2, '')) LIKE ?)";

}

// Filter by brand if selected
if ($brand !== '') {
    $sql .= " AND brand = ?";
}

if ($stock !== '') {
    $sql .= " AND units <= ?";
}

// Filter by category if selected
if ($category !== '') {
    $sql .= " AND category = ?";
}

// Filter by area if selected
if ($area !== '') {
    $sql .= " AND storage_area = ?";
}

// Add ORDER BY and LIMIT
$sql .= " ORDER BY inventory_id DESC LIMIT 100";

$stmt = $conn->prepare($sql);

// Bind parameters dynamically
$params = [];
$types = '';

if ($location !== '' && $location !== 'All') {
    if ($location === 'Warehouse') {
        $params[] = 'WAREHOUSE';
        $types .= 's';
    } else {
        $params[] = $location;
        $types .= 's';
    }
}

if ($searchQuery !== '') {
    $likeQuery = "%$searchQuery%";
    $params[] = $likeQuery;
    $params[] = $likeQuery;
    $types .= 'ss';
}

if ($brand !== '') {
    $params[] = $brand;
    $types .= 's';
}

if ($stock !== '') {
    $params[] = $stock;
    $types .= 's';
}

if ($category !== '') {
    $params[] = $category;
    $types .= 's';
}

if ($area !== '') {
    $params[] = $area;
    $types .= 's';
}

// Bind parameters only if they exist
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();
$inventory = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($inventory);
?>
