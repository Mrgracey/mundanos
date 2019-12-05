<?php

// A list of permitted file extensions
$allowed = array('jpeg', 'jpg');

if(isset($_FILES['upl']) && $_FILES['upl']['error'] == 0){

	$extension = pathinfo($_FILES['upl']['name'], PATHINFO_EXTENSION);

	if(!in_array(strtolower($extension), $allowed)){
		echo '{"status":"error"}';
		exit;
	}
include("processupload_prom.php");

	if(move_uploaded_file($_FILES['upl']['tmp_name'], '../fotos/'.$_FILES['upl']['name'])){
		echo '$("#lista").load("fotos_promociones.php")';
		echo '{"status":"success"}';
		exit;
	}
	
	
}

echo '{"status":"error"}';
exit;

?>