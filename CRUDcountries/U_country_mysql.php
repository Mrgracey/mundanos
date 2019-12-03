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


$target_dir = "uploads/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
$search=mysqli_query($con,"SELECT * FROM media WHERE id_country='$id'");
$existe=mysqli_num_rows($search);

// Check if image file is a actual image or fake image
if(isset($_POST["submit"])) {
    $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
    if($check !== false) {
        if ($existe==0) {
            mysqli_query($con, "INSERT INTO media (`id_country`, `url`) VALUES ('$id', '$target_file')");
        }else{
            mysqli_query($con, "UPDATE `media` SET `url` = '$target_file' WHERE `media`.`id_country` = '$id'");
        }
    } 
}
    
    mysqli_query($con, $query);
    header('location:../paises.php');
    
    
    