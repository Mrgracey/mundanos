<?php
session_start();
$id=$_GET['id'];
include('../conexion.php');

    mysqli_query($con, "DELETE FROM `posts` WHERE `posts`.`id` = '$id'");
    header('location:../publicaciones.php');
    