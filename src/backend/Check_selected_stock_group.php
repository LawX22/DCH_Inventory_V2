<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_connection.php';
$data = $_POST;

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $inventory_id = $_GET['inventory_id'];
    $username = $_GET['username'];

    if (empty($inventory_id) || empty($username)) {
        echo json_encode(['exists' => false]);
        exit;
    }

    // Database connection
    $conn = new mysqli('localhost', 'root', '', 'dch_test_export');

    if ($conn->connect_error) {
        echo json_encode(['exists' => false]);
        exit;
    }

    $stmt = $conn->prepare("SELECT COUNT(*) FROM stock_group WHERE inventory_Id = ? AND username = ?");
    $stmt->bind_param("is", $inventory_id, $username);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();
    $conn->close();

    echo json_encode(['exists' => $count > 0]);
}
?>
