<?php
session_start();
$id_user=1;//$_SESSION['user'];
include('../conexion.php');
$title=$_POST['title'];
$description=$_POST['description'];
$body=$_POST['body'];
$id_country=$_POST['country'];
    $query = "INSERT INTO `posts`(`title`, `description`, `body`, `id_country`, `id_user`) VALUES('$title', '$description', '$body', '$id_country', '$id_user')";
    mysqli_query($con, $query);
    header('location:../publicaciones.php');
    