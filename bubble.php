<?php

$pdo = null;

function connect(): PDO
{
    return new PDO('mysql:host=localhost;dbname=bubbles;charset=utf8', 'root', 'test');
}

function get()
{
    global $pdo;
    if (!$pdo) {
        $pdo = connect();
    }

    $result = [];
    $sql = "SELECT * FROM highscore ORDER BY points DESC";
    $pos = 1;
    foreach ($pdo->query($sql) as $row) {
        $result[] = $row;
        if ($pos > 10) {
            break;
        }
        $pos++;
    }
    return json_encode($result);
}

function save($data): bool
{
    global $pdo;
    if (!$pdo) {
        $pdo = connect();
    }

    $sql = "SELECT * FROM highscore WHERE points = :points";
    $statement = $pdo->prepare($sql);
    $statement->execute(array('points' => $data['points']));
    $updated = false;
    $rows = $statement->fetchAll();
    foreach ($rows as $row) {
        $data['id'] = $row['id'];
        $sql = "UPDATE highscore set firstname = :firstname, lastname = :lastname WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute($data);
        $updated = true;
        break;
    }
    if (!$updated) {
        $sql = "INSERT INTO highscore (points, firstname, lastname) VALUES (:points, :firstname, :lastname)";
        $statement = $pdo->prepare($sql);
        $statement->execute(array(
            'points' => $data['points'],
            'firstname' => $data['firstname'],
            'lastname' => $data['lastname'],
        ));
    }
    echo get();
    return true;
}

if (isset($_GET['action']) && $_GET['action'] == 'save') {
    save($_GET);
} else {
    echo get();
}