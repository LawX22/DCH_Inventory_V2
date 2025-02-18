<?php
$host = "localhost";
$username = "root";
$password = "";
$database = "dch_test_export";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}
?>
