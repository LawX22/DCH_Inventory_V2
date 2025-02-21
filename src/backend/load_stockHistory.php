<?php
header("Access-Control-Allow-Origin: *");  // Allow any origin (change this in production)
header("Content-Type: application/json");

include 'db_connection.php';  // Include database connection

// Get selected location from the request
$selectedLocation = isset($_GET['location']) ? $conn->real_escape_string($_GET['location']) : '';

// Modify SQL query based on the selected location
if ($selectedLocation === "All" || empty($selectedLocation)) {
    $sql = "SELECT * FROM stock_history ORDER BY stock_history_id DESC LIMIT 100";  // Fetch all records
} elseif ($selectedLocation === "Warehouse") {
    $sql = "SELECT * FROM stock_history WHERE location IS NULL OR location != 'Store' ORDER BY stock_history_id DESC LIMIT 100";  
    // Fetch records where location is NOT 'Store' (handles NULL cases too)
} else {
    $sql = "SELECT * FROM stock_history WHERE location = '$selectedLocation' ORDER BY stock_history_id DESC LIMIT 100"; 
    // Fetch only the selected location
}

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
} else {
    echo json_encode([]);
}

$conn->close();
?>
