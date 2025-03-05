<?php
header("Access-Control-Allow-Origin: *");  // Allow any origin (change this in production)
header("Content-Type: application/json");
include 'db_connection.php'; // Ensure you have your DB connection here

$latest_unit_id = isset($_GET['latest_unit_id']) ? $_GET['latest_unit_id'] : '';


// Prepare the SQL statement
$sql = "SELECT units,image FROM inventory_merge WHERE inventory_id=?";

// Prepare the statement
$stmt = $conn->prepare($sql);

// Bind the parameter (assuming `inventory_id` is an integer, use 'i'; if it's a string, use 's')
$stmt->bind_param('i', $latest_unit_id);

// Execute the statement
$stmt->execute();

// Get the result
$result = $stmt->get_result();
$inventory = $result->fetch_all(MYSQLI_ASSOC);

// Output the JSON
echo json_encode($inventory);

$stmt->close();
$conn->close();
?>
