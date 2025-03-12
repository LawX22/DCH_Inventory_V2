<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
include 'db_connection.php';

// Get parameters from frontend
$encoder = isset($_GET['encoder']) ? $_GET['encoder'] : '';
$startOfWeek = isset($_GET['startOfWeek']) ? $_GET['startOfWeek'] : '';
$endOfWeek = isset($_GET['endOfWeek']) ? $_GET['endOfWeek'] : '';

// Log received parameters for debugging
file_put_contents("debug_log.txt", "Encoder: $encoder, Start: $startOfWeek, End: $endOfWeek\n", FILE_APPEND);

if (empty($startOfWeek) || empty($endOfWeek)) {
    echo json_encode(["error" => "Missing start or end of week"]);
    exit;
}

// Base SQL query
$sql = "
    SELECT 
        activity_type,
        DAYNAME(date_performed) as day,
        COUNT(*) as count
    FROM 
        activity_report
    WHERE 
        date_performed BETWEEN ? AND ?
";

// Add encoder filter if it's not "All"
if ($encoder !== 'All' && !empty($encoder)) {
    $sql .= " AND encoder = ?";
}

$sql .= " GROUP BY activity_type, DAYNAME(date_performed)";

// Prepare the query
$stmt = $conn->prepare($sql);

// Bind parameters based on whether encoder is included
if ($encoder !== 'All' && !empty($encoder)) {
    $stmt->bind_param("sss", $startOfWeek, $endOfWeek, $encoder);
} else {
    $stmt->bind_param("ss", $startOfWeek, $endOfWeek);
}

// Execute the query
if (!$stmt->execute()) {
    echo json_encode(["error" => "Database query failed", "details" => $stmt->error]);
    exit;
}

$result = $stmt->get_result();
$data = [];

// Default structure
$actions = ["Add Item", "Update Item", "Delete Item", "Stock In", "Stock Out"];
$days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Initialize default data array
foreach ($actions as $action) {
    $row = [
        "action" => $action,
        "monday" => 0,
        "tuesday" => 0,
        "wednesday" => 0,
        "thursday" => 0,
        "friday" => 0,
        "saturday" => 0,
        "total" => 0
    ];
    $data[$action] = $row;
}

// Populate with actual counts from the database
while ($row = $result->fetch_assoc()) {
    $action = $row['activity_type'];
    $day = strtolower($row['day']); // e.g., "monday"
    $count = (int)$row['count']; // Ensure it's an integer

    if (isset($data[$action][$day])) {
        $data[$action][$day] = $count;
        $data[$action]['total'] += $count;
    }
}

// Calculate "Per day" totals
$perDay = [
    "action" => "Per day",
    "monday" => 0,
    "tuesday" => 0,
    "wednesday" => 0,
    "thursday" => 0,
    "friday" => 0,
    "saturday" => 0,
    "total" => 0
];

foreach ($days as $day) {
    $dayLower = strtolower($day);
    foreach ($actions as $action) {
        $perDay[$dayLower] += $data[$action][$dayLower];
    }
    $perDay['total'] += $perDay[$dayLower];
}

// Convert to array format for response
$response = array_values($data);
$response[] = $perDay; // Add "Per day" row at the end

// Ensure JSON encoding success
$jsonOutput = json_encode($response);
if ($jsonOutput === false) {
    echo json_encode(["error" => "JSON encoding failed", "details" => json_last_error_msg()]);
} else {
    echo $jsonOutput;
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>
