<?php

class Database {

   private static $server = "localhost";
   private static $user = "root";
   private static $password = "";
   private static $dbName = "Hotels";

   private static $connex = null;

   public static function connect(){

      try 
      {
         self::$connex = new PDO("mysql:host=" . self::$server . ";dbname=" . self::$dbName ,self::$user ,self::$password);
         self::$connex->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         self::$connex->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE,PDO::FETCH_OBJ);
      }

      catch(PDOException $e)
      {
         echo "Connection failed: " . $e->getMessage();
      }

      return self::$connex ;
   }

   public static function disconnect () {
      self::$connex = null;
   }

}

?>


