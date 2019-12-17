<?php
session_start();

$id_user=$_SESSION['user'];
include('../conexion.php');

$query_id=mysqli_query($con, "SELECT id FROM posts ORDER BY id DESC LIMIT 1");
while ($A_id=mysqli_fetch_array($query_id)) {
    $id=$A_id['id'];
}
echo $id;

$fileName= basename ($_FILES ['inp']['name']);
$fileDest	= "../uploads/img_post_".$id.".jpg";
move_uploaded_file ($_FILES ['inp']['tmp_name'], $fileDest);
$title=$_POST['title'];
$description=$_POST['description'];
$body=$_POST['body'];
$id_country=$_POST['country'];
    $query = "INSERT INTO `posts`(`title`, `description`, `body`, `id_country`, `id_user`) VALUES('$title', '$description', '$body', '$id_country', '$id_user')";
    mysqli_query($con, $query);
    // header('location:../publicaciones.php');
    