<?php
session_start();
include "db_connection.php"; // Ensure this file connects to your database

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['username']) && isset($data['password'])) {
    $username = $data['username'];
    $password = $data['password'];

    // Use prepared statements to prevent SQL injection
    $stmt = $conn->prepare("SELECT username, password, userType FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($dbUsername, $dbPassword, $userType);
        $stmt->fetch();

        // Verify password (update this if passwords are hashed)
        if ($password === $dbPassword) {
            $_SESSION['username'] = $dbUsername;
            $_SESSION['userType'] = $userType;

            echo json_encode([
                "success" => true,
                "username" => $dbUsername,
                "userType" => $userType
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Invalid password"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "User not found"]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Missing username or password"]);
}
?>
