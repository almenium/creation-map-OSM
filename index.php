<?php

require_once 'db_connection.php';

header('Content-Type: application/json; charset=utf-8');

// Récupération et validation de l'ID d'hôtel
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

if ($id === null || $id === false) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Paramètre "id" manquant ou invalide.'
    ]);
    exit;
}

try {
    $db = Database::connect();

    $sql = '
        SELECT 
            hotel_lat AS lat,
            hotel_lon AS lon
        FROM hotel
        WHERE hotel_id = :id
    ';

    $stmt = $db->prepare($sql);
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    $hotel = $stmt->fetch();

    if (!$hotel) {
        http_response_code(404);
        echo json_encode([
            'error' => 'Aucun hôtel trouvé pour cet identifiant.'
        ]);
        exit;
    }

    echo json_encode($hotel);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erreur lors de la récupération des coordonnées.'
    ]);
}
