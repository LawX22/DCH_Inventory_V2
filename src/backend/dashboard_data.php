<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
include 'db_connection.php';

// Get date ranges
$startOfWeek = date('Y-m-d', strtotime('monday this week'));
$endOfWeek = date('Y-m-d', strtotime('saturday this week'));
$startOfMonth = date('Y-m-01');
$endOfMonth = date('Y-m-t');
// Initialize response array

$response = [
    "weekly_average_activity" => 0,
    "weekly_total_activity" => 0,
    "monthly_total_stock_in" => 0,
    "monthly_total_sales" => 0,
    "monthly_total_income" => 0,
    "inventory_merge_total" => 0
];

// --- 1. Get Weekly Total & Average Activity ---
$days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
$totals = array_fill_keys($days, 0);

$sql = "
    SELECT 
        DAYNAME(date_performed) as day,
        COUNT(*) as total
    FROM 
        activity_report
    WHERE 
        date_performed >= '$startOfWeek' AND date_performed <= '$endOfWeek'
    GROUP BY 
        DAYNAME(date_performed)
";




$result = $conn->query($sql);
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $day = $row['day'];
        $totals[$day] = (int)$row['total'];
    }
}
$weeklyTotal = array_sum($totals);
$response['weekly_total_activity'] = $weeklyTotal;
$response['weekly_average_activity'] = round($weeklyTotal / count($days), 2);



// --- 2. Get Monthly Total Stock In ---
$sql = "
    SELECT SUM(units_added) as total_stock_in
    FROM stock_history
    WHERE transaction_type = 'Stock In'
    AND transaction_date >= '$startOfMonth' AND transaction_date <= '$endOfMonth'
";
$result = $conn->query($sql);
if ($result) {
    $row = $result->fetch_assoc();
    $response['monthly_total_stock_in'] = (int)$row['total_stock_in'];
}


// --- 3. Get Monthly Total Sales ---
$sql = "
SELECT SUM(units_added * price) as total_sales
FROM stock_history
WHERE transaction_date >= '$startOfMonth' 
AND transaction_date <= '$endOfMonth'
AND location = 'STORE'

";
$result = $conn->query($sql);
if ($result) {
    $row = $result->fetch_assoc();
    $response['monthly_total_sales'] = (float)$row['total_sales'];
}

// --- 4. Get Monthly Total Income (Assuming you have an `income` column) ---
$sql = "
    SELECT SUM(units_added * price) as total_income
    FROM stock_history
    WHERE transaction_date >= '$startOfMonth' AND transaction_date <= '$endOfMonth'
    AND location = 'STORE'
    AND transaction_type = 'Stock Out'
";
$result = $conn->query($sql);
if ($result) {
    $row = $result->fetch_assoc();
    $response['monthly_total_income'] = (float)$row['total_income'];
}


// --- 5. Get Total Inventory (From inventory_merge table) ---
$sql = "SELECT COUNT(*) as total_inventory FROM inventory_merge";
$result = $conn->query($sql);
if ($result) {
    $row = $result->fetch_assoc();
    $response['inventory_merge_total'] = (int)$row['total_inventory'];
}

// Return all data
echo json_encode($response);

$conn->close();
