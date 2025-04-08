<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    // Establish the database connection
    $pdo = new PDO("mysql:host=localhost;dbname=dch_test_export", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if the connection is successful
    if ($pdo) {
        // Connection is successful
    } else {
        echo "Database connection failed\n";
        exit;
    }

    // Retrieve the username from the POST request
    $input = json_decode(file_get_contents("php://input"), true);
    $username = $input['username'] ?? null; // Use the username passed in the request, or null if not set

    // Check if username is provided
    if (!$username) {
        echo json_encode(['error' => 'Username is required']);
        exit;
    }

    // Prepare and execute the SQL query with INNER JOIN and username filtering
    $stmt = $pdo->prepare("
        SELECT sg.username, sg.inventory_Id,sg.stock_group_id,inv.itemDesc_1, inv.units, inv.brand
        FROM stock_group sg
        JOIN inventory_merge inv ON sg.inventory_Id = inv.inventory_Id
        WHERE sg.username = :username
    ");
    $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    $stmt->execute();

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Check if any results were returned
    if (!empty($results)) {
        echo json_encode($results);
    } else {
        echo json_encode(['message' => 'No records found for the username']);
    }

} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
