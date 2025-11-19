<?php

class Database
{
    
    private static string $host = 'localhost';
    private static string $dbName = 'Hotels';
    private static string $user = 'root';
    private static string $password = '';

    private static ?PDO $connection = null;

    public static function connect(): PDO
    {
        if (self::$connection === null) {
            $dsn = sprintf(
                'mysql:host=%s;dbname=%s;charset=utf8mb4',
                self::$host,
                self::$dbName
            );

            try {
                self::$connection = new PDO(
                    $dsn,
                    self::$user,
                    self::$password,
                    [
                        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    ]
                );
            } catch (PDOException $e) {
                // En prod : log + message générique
                http_response_code(500);
                exit('Une erreur de connexion à la base de données est survenue.');
            }
        }

        return self::$connection;
    }

    public static function disconnect(): void
    {
        self::$connection = null;
    }
}
