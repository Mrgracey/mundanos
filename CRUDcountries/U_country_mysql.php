<?php
include('../conexion.php');

if (isset($_POST['id'])) {
    $id=$_POST['id'];
    $title=$_POST['title'];
    $description=$_POST['description'];
    $tf_active=1;
    $query = "UPDATE `country` SET `title`='$title', `description`='$description', `tf_active` = '$tf_active' WHERE `country`.`id` = '$id'";
    
}elseif (isset($_GET['id'])) {
    $id=$_GET['id'];  
    $tf_active=0;
    $query = "UPDATE `country` SET `tf_active` = '$tf_active' WHERE `country`.`id` = '$id'";
}

$target_dir = "uploads/img_".$id.".jpg";
$search=mysqli_query($con,"SELECT * FROM media WHERE id_country='$id'");
$existe=mysqli_num_rows($search);

        if ($existe==0) {
            mysqli_query($con, "INSERT INTO media (`id_country`, `url`) VALUES ('$id', '$target_dir')");
            
        }else{
            mysqli_query($con, "UPDATE `media` SET `url` = '$target_dir' WHERE `media`.`id_country` = '$id'");
            
        }

    
    mysqli_query($con, $query);
    header('location:../paises.php');
    
    
    
    