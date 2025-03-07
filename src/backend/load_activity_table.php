<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");



// Database connection
include 'db_connection.php';


// Connect to databas

// Get the start and end of the current week (Monday to Saturday)


$startOfWeek = date('Y-m-d', strtotime('monday this week'));
$endOfWeek = date('Y-m-d', strtotime('saturday this week'));

// Query to get counts by action and day
$sql = "
    SELECT 
        activity_type,
        DAYNAME(date_performed) as day,
        COUNT(*) as count
    FROM 
        activity_report
    WHERE 
        date_performed >= '$startOfWeek' AND date_performed <= '$endOfWeek'
    GROUP BY 
        activity_type, DAYNAME(date_performed)
";

$result = $conn->query($sql);

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
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $action = $row['activity_type'];
        $day = strtolower($row['day']); // e.g., "monday"
        $count = $row['count'];

        if (isset($data[$action][$day])) {
            $data[$action][$day] = $count;
            $data[$action]['total'] += $count;
        }
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

echo json_encode($response);

$conn->close();

