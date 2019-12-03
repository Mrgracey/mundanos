<?php
session_start();
$id_user=1;//$_SESSION['user'];
include('../conexion.php');
$id=$_POST['id'];
$title=$_POST['title'];
$description=$_POST['description'];
$body=$_POST['body'];
$id_country=$_POST['country'];
if (isset($_POST['tf_active'])) {
    $tf_active=1;
}else{
    $tf_active=0;
}
    $query = "UPDATE `posts` SET `title` = '$title', `description` = '$description', `body` = '$body', `id_country` = '$id_country', `tf_active` = '$tf_active', `updated_at`=CURRENT_TIMESTAMP, `id_user`='$id_user' WHERE `posts`.`id` = '$id'";
    mysqli_query($con, $query);
    header('location:../publicaciones.php');
    