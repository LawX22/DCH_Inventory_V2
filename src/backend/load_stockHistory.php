<?php
header("Access-Control-Allow-Origin: *");  
header("Content-Type: application/json");

include 'db_connection.php';

$location = isset($_GET['location']) ? $_GET['location'] : '';
$searchQuery = isset($_GET['search']) ? $_GET['search'] : '';

$sql = "SELECT * FROM stock_history WHERE 1=1";

// Filter by location if selected
if ($location !== '' && $location !== 'All') {
    if ($location === 'Warehouse') {
        $sql .= " AND location = 'AREA A'";
    } else {
        $sql .= " AND location = ?";
    }
}

// Apply search filter
if ($searchQuery !== '') {
    $sql .= " AND (item_code LIKE ? OR brand LIKE ? OR stock_name LIKE ?)";
}

// Add LIMIT at the end
$sql .= " ORDER BY stock_history_id DESC LIMIT 100";

$stmt = $conn->prepare($sql);

// Bind parameters dynamically
$params = [];
$types = '';

// Handle location parameter
if ($location !== '' && $location !== 'All' && $location !== 'Warehouse') {
    $params[] = $location;
    $types .= 's';
}

// Handle search query
if ($searchQuery !== '') {
    $likeQuery = "%$searchQuery%";
    for ($i = 0; $i < 3; $i++) {  // Fix: Changed 4 to 3
        $params[] = $likeQuery;
        $types .= 's';
    }
}

// Debugging - Check Query and Parameters
// error_log("SQL: " . $sql);
// error_log("Params: " . json_encode($params));

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();
$inventory = $result->fetch_all(MYSQLI_ASSOC);

// Return JSON response
echo json_encode($inventory);

$conn->close();
?>
