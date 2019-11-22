<?php
    include("conexion.php");

    $id = $_GET['id'];

    mysqli_query($con, "DELETE FROM `user` WHERE `user`.`id` = '$id'");

        header('location: dashboard.php');
?>