<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$usuario = $data["usuario"] ?? "";
$contrasena = $data["contrasena"] ?? "";

if ($usuario !== "" && $contrasena !== "") {
    echo json_encode([
        "success" => true,
        "message" => "Login exitoso"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Usuario o contraseña incorrectos"
    ]);
}
