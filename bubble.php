<?php

$pdo = null;

function connect(): PDO
{
    return new PDO('mysql:host=localhost;dbname=bubbles;charset=utf8', 'root', 'test', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,        // Fehler als Ausnahme werfen
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,   // Verhindert doppelte Array-Schlüssel
        PDO::ATTR_EMULATE_PREPARES => false,                // Echte Prepared Statements
    ]);
}

// Cross-Site Scripting (XSS) verhindern
function sanitizeInput($data)
{
    return filter_var(trim($data), FILTER_SANITIZE_STRING);
}

// übergebene Daten auf Gültigkeit prüfen bevor sie in die Datenbank geschrieben werden
function validateData(&$data): bool
{
    if (!isset($data['points'], $data['firstname'], $data['lastname'])) {
        return false;
    }

    $data['points'] = filter_var($data['points'], FILTER_VALIDATE_INT);
    $data['firstname'] = sanitizeInput($data['firstname']);
    $data['lastname'] = sanitizeInput($data['lastname']);

    return !empty($data['points']) && !empty($data['firstname']) && !empty($data['lastname']);
}

function get()
{
    global $pdo;
    if (!$pdo) {
        $pdo = connect();
    }

    $sql = "SELECT * FROM highscore ORDER BY points DESC LIMIT 10";
    $statement = $pdo->prepare($sql);
    $statement->execute();

    return json_encode($statement->fetchAll());
}

function save($data): bool
{
    global $pdo;
    if (!$pdo) {
        $pdo = connect();
    }

    if (!validateData($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Ungültige Daten']);
        return false;
    }

    $sql = "SELECT * FROM highscore WHERE points = :points LIMIT 1";
    $statement = $pdo->prepare($sql);
    $statement->execute(array('points' => $data['points']));
    $row = $statement->fetch();

    if ($row) {
        $sql = "UPDATE highscore SET firstname = :firstname, lastname = :lastname WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            'firstname' => $data['firstname'],
            'lastname' => $data['lastname'],
            'id' => $row['id']
        ]);
    } else {
        $sql = "INSERT INTO highscore (points, firstname, lastname) VALUES (:points, :firstname, :lastname)";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            'points' => $data['points'],
            'firstname' => $data['firstname'],
            'lastname' => $data['lastname']
        ]);
    }

    echo get();
    return true;
}

$action = filter_input(INPUT_GET, 'action', FILTER_SANITIZE_STRING);

if ($action === 'save') {
    save($_GET);
} else {
    echo get();
}