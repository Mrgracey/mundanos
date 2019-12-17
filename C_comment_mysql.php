<?php
include('conexion.php');
$id=$_POST['id'];
$name=$_POST['name'];
$email=$_POST['email'];
$comment=$_POST['comment'];

$query = "INSERT INTO `comments`(`name`, `email`, `comment`, `id_post`) VALUES('$name', '$email', '$comment', '$id')";
    mysqli_query($con, $query);
    header('location:mundanos.php');
    