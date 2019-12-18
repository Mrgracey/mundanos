<?php
include('conexion.php');
$id=$_POST['id'];
$name=$_POST['name'];
$comment=$_POST['comment'];

$query = "INSERT INTO `comments`(`name`, `comment`, `id_post`) VALUES('$name', '$comment', '$id')";
    mysqli_query($con, $query);
    header('location:mundanos.php');
    