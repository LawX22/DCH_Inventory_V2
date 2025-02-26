<?php
$today = date("Y-m-d"); // Get the current date
$filename = "dch_inventory_export_{$today}.sql"; // Format the filename

header('Content-Type: application/sql');
header("Content-Disposition: attachment; filename=$filename");

include 'db_connection.php'; // Ensure this file connects to your database

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Start output buffering
ob_start();

// Get all table names
$tables = [];
$result = $conn->query("SHOW TABLES");
while ($row = $result->fetch_array()) {
    $tables[] = $row[0];
}

foreach ($tables as $table) {
    // Drop table statement
    echo "DROP TABLE IF EXISTS `$table`;\n";
    
    // Get CREATE TABLE statement
    $createTableResult = $conn->query("SHOW CREATE TABLE `$table`");
    $createTableRow = $createTableResult->fetch_assoc();
    echo $createTableRow['Create Table'] . ";\n\n";
    
    // Get table data
    $sql = "SELECT * FROM `$table`";
    $result = $conn->query($sql);

    while ($row = $result->fetch_assoc()) {
        $values = [];
        foreach ($row as $key => $value) {
            $values[] = isset($value) ? "'" . $conn->real_escape_string($value) . "'" : "NULL";
        }
        echo "INSERT INTO `$table` VALUES (" . implode(", ", $values) . ");\n";
    }
    echo "\n\n";
}

// Capture the output and write to the file
$output = ob_get_clean();
echo $output;

$conn->close();
?>
