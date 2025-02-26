<?php
header("Access-Control-Allow-Origin: *");  // Allow any origin (change this in production)
header("Content-Type: application/json");

include 'db_connection.php';  // Include database connection

$location = isset($_GET['location']) ? $_GET['location'] : '';
$searchQuery = isset($_GET['search']) ? $_GET['search'] : '';

$sql = "SELECT * FROM activity_report WHERE 1=1";  
$params = [];
$types = "";

// Apply location filter
if ($location !== '' && $location !== 'All') {
    $sql .= " AND location = ?";
    if ($location === 'Warehouse') {
        $params[] = 'WAREHOUSE'; // Convert 'Warehouse' to 'AREA A'
    } else {
        $params[] = $location;
    }
    $types .= "s";
}

// Apply search filter
if ($searchQuery !== '') {
    $sql .= " AND (activity_performed LIKE ?)";
    $params[] = "%$searchQuery%"; // Add wildcards for LIKE
    $types .= "s";
}

$sql .= " ORDER BY report_id DESC LIMIT 100";

// Prepare the statement
$stmt = $conn->prepare($sql);
if ($stmt === false) {
    echo json_encode(["error" => "Query preparation failed: " . $conn->error]);
    exit;
}

// Bind parameters if any exist
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

// Execute query
$stmt->execute();
$result = $stmt->get_result();

// Fetch data
$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

// Close resources
$stmt->close();
$conn->close();
?>
