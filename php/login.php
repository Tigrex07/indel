<?php
// Permitir peticiones desde Vite (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Leer JSON enviado desde React
$data = json_decode(file_get_contents("php://input"), true);

// Obtener datos
$usuario = $data["usuario"] ?? "";
$contrasena = $data["contrasena"] ?? "";

// Validación simple (temporal)
if ($usuario !== "" && $contrasena !== "") {
    echo json_encode([
        "success" => true,
        "message" => "Login exitoso"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Datos incorrectos"
    ]);
}
