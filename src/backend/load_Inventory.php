<?php
header("Access-Control-Allow-Origin: *");  // Allow any origin (change this in production)
header("Content-Type: application/json");
include 'db_connection.php'; // Ensure you have your DB connection here

$location = isset($_GET['location']) ? $_GET['location'] : '';
$searchQuery = isset($_GET['search']) ? $_GET['search'] : '';

$sql = "SELECT * FROM inventory_merge WHERE 1=1"; // Ensures filters can be appended properly

// Filter by location if selected
if ($location !== '' && $location !== 'All') {
    $sql .= " AND location = ?";
}

// Apply search filter
if ($searchQuery !== '') {
    $sql .= " AND (itemCode LIKE ? OR brand LIKE ? OR itemDesc_1 LIKE ? OR itemDesc_2 LIKE ?)";
}

// Add LIMIT at the end
$sql .= " LIMIT 100";

$stmt = $conn->prepare($sql);

// Bind parameters dynamically
$params = [];
$types = '';

if ($location !== '' && $location !== 'All') {

    if($location === 'Warehouse'){
        $params[] = 'AREA A';
        $types .= 's';
    }
    else {
        $params[] = $location;
    $types .= 's';
    }

   
}

if ($searchQuery !== '') {
    $likeQuery = "%$searchQuery%";
    for ($i = 0; $i < 4; $i++) {
        $params[] = $likeQuery;
        $types .= 's';
    }
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
