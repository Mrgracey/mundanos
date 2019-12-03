<?php
    include("../conexion.php");
    $user=$_POST['user'];
    $password=$_POST['password'];
    $email=$_POST['email'];
    $type=$_POST['type'];
    mysqli_query($con, "INSERT INTO `user` (`email`, `user`, `password`, `type`) VALUES ('$email', '$user', '$password', '$type');");
    header('location:../dashboard.php');
?>