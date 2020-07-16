<?php

require 'db_connection.php';
// verification de la donnée
function checkInput($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
// affectation donnée $ajax a variable
$id = $_GET["id"];
//utilisation de la fonction vérif données
if(!empty($_GET['id'])){
    $title = checkInput($_GET['id']);
};
// connexion DB
$db = Database::connect();
// Requete SQL
$stmt = $db->prepare("SELECT hotel_lat as lat, hotel_lon as lon
            FROM hotel
            WHERE hotel_id = :id");
//application de la requete
$stmt-> execute(array(':id' => $id));
// enrgistrement des données récupéré sur la db dans la variable $item 
$item = $stmt->fetch();
// encode objet en json
$item = json_encode($item);
// renvoie json $item
print_r($item);





