<?php
session_start();
include('../conexion.php');
$id=$_POST['id'];
if (isset($_POST['tf_moderate'])) {
    $tf_moderate=1;
}else{
    $tf_moderate=0;
}
    $query = "UPDATE `comments` SET `tf_moderate` = '$tf_moderate' WHERE `comments`.`id` = '$id'";
    mysqli_query($con, $query);
    header('location:../comentarios.php');
    