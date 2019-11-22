<?php
include('conexion.php');
$id=$_GET['id'];
$user=$_POST['user'];
$password=$_POST['password'];
$email=$_POST['email'];
$type=$_POST['type'];
if (isset($_POST['tf_active'])) {
    $tf_active=1;
}else{
    $tf_active=0;
}
    $query = "UPDATE `user` SET `email` = '$email', `user` = '$user', `password` = '$password', `type` = '$type', `tf_active` = '$tf_active' WHERE `user`.`id` = '$id'";
    mysqli_query($con, $query);
    header('location:dashboard.php');
    