<?php

include("../conecta.php");
$prp_id = $_POST['prp_id'];
if (!file_exists("../fotos/".$prp_id)){
mkdir("../fotos/".$prp_id, 0777);
}
############ Configuration ##############
$destination_folder		= '../fotos/'.$prp_id.'/'; //upload directory ends with / (slash)
$jpeg_quality 			= 90; //jpeg quality
##########################################

//continue only if $_POST is set and it is a Ajax request
if(isset($_POST) && isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){

	// check $_FILES['ImageFile'] not empty
	if(!isset($_FILES['upl']) || !is_uploaded_file($_FILES['upl']['tmp_name'])){
			die('Image file is Missing!'); // output error when above checks fail.
	}
	
	//uploaded file info we need to proceed
	$image_name = $_FILES['upl']['name']; //file name
	$image_size = $_FILES['upl']['size']; //file size
	$image_temp = $_FILES['upl']['tmp_name']; //file temp

	$ffoto = strtr($image_name, "áéíóúüÁÉÍÓÚñÑ", "aeiouuAEIOUnN");
		$ffoto = strtr($ffoto," ","_");
		$ffoto=strtolower($ffoto);
$fileDest	= $destination_folder.$ffoto;
move_uploaded_file ($image_temp, $fileDest);



$original = imagecreatefromjpeg($fileDest);
		$ancho = imagesx($original);
		$alto = imagesy($original);
	$destinoch =  $destination_folder.'th_'.$ffoto;
	$destinosl =  $destination_folder.'sl_'.$ffoto;
	


	// 300 300
	$ancho_final1 = 870;
		$alto_final1 = 520;
		
		if(($ancho/$alto) > 1.673){
		
		$ancho_sl=$alto_final1*$ancho/$alto;
		/*$alto_ch=$ancho_final*$alto/$ancho;*/
		$thumb = imagecreatetruecolor($ancho_sl,$alto_final1); 
		imagecopyresampled($thumb,$original,0,0,0,0,$ancho_sl,$alto_final1,$ancho,$alto); 
		imagejpeg($thumb,$destinosl,90); 
		unset($thumb);
		
		$gr = imagecreatefromjpeg($destinosl);
		/*$y_gr = ($alto_final - $alto_ch)/2;*/
		$x_gr = ($ancho_final1 - $ancho_sl)/2;
		$thumb = imagecreatetruecolor($ancho_final1,$alto_final1); 
		$fondo = imagecolorallocate($thumb, 255, 255, 255);
		imagefilledrectangle($thumb, 0, 0, $ancho_final1, $alto_final1, $fondo);
		/*
		imagecopy($thumb,$gr,0,$y_gr,0,0,$ancho_final,$alto_final); 
		*/
		imagecopy($thumb,$gr,$x_gr,0,0,0,$ancho_sl,$alto_final1); 
		imagejpeg($thumb,$destinosl,90); 		
		unset($thumb);
		
		
		} else {
		
		$alto_sl=$ancho_final1*$alto/$ancho;
		$thumb = imagecreatetruecolor($ancho_final1,$alto_sl); 
		imagecopyresampled($thumb,$original,0,0,0,0,$ancho_final1,$alto_sl,$ancho,$alto); 
		imagejpeg($thumb,$destinosl,90); 
		unset($thumb);
		
		$gr = imagecreatefromjpeg($destinosl);
		$y_gr = ($alto_final1 - $alto_sl)/2;
		$thumb = imagecreatetruecolor($ancho_final1,$alto_final1); 
		$fondo = imagecolorallocate($thumb, 255, 255, 255);
		imagefilledrectangle($thumb, 0, 0, $ancho_final1, $alto_final1, $fondo);
		imagecopy($thumb,$gr,0,$y_gr,0,0,$ancho_final1,$alto_sl); 
		imagejpeg($thumb,$destinosl,90); 		
		unset($thumb);
		
		
		}



	
	// 300 300
	$ancho_final = 300;
		$alto_final = 222;
		
		if(($ancho/$alto) > 1.351){
		
		$ancho_ch=$alto_final*$ancho/$alto;
		/*$alto_ch=$ancho_final*$alto/$ancho;*/
		$thumb = imagecreatetruecolor($ancho_ch,$alto_final); 
		imagecopyresampled($thumb,$original,0,0,0,0,$ancho_ch,$alto_final,$ancho,$alto); 
		imagejpeg($thumb,$destinoch,90); 
		unset($thumb);
		
		$gr = imagecreatefromjpeg($destinoch);
		/*$y_gr = ($alto_final - $alto_ch)/2;*/
		$x_gr = ($ancho_final - $ancho_ch)/2;
		$thumb = imagecreatetruecolor($ancho_final,$alto_final); 
		$fondo = imagecolorallocate($thumb, 255, 255, 255);
		imagefilledrectangle($thumb, 0, 0, $ancho_final, $alto_final, $fondo);
		/*
		imagecopy($thumb,$gr,0,$y_gr,0,0,$ancho_final,$alto_final); 
		*/
		imagecopy($thumb,$gr,$x_gr,0,0,0,$ancho_ch,$alto_final); 
		imagejpeg($thumb,$destinoch,80); 		
		unset($thumb);
		
		
		} else {
		
		$alto_ch=$ancho_final*$alto/$ancho;
		$thumb = imagecreatetruecolor($ancho_final,$alto_ch); 
		imagecopyresampled($thumb,$original,0,0,0,0,$ancho_final,$alto_ch,$ancho,$alto); 
		imagejpeg($thumb,$destinoch,90); 
		unset($thumb);
		
		$gr = imagecreatefromjpeg($destinoch);
		$y_gr = ($alto_final - $alto_ch)/2;
		$thumb = imagecreatetruecolor($ancho_final,$alto_final); 
		$fondo = imagecolorallocate($thumb, 255, 255, 255);
		imagefilledrectangle($thumb, 0, 0, $ancho_final, $alto_final, $fondo);
		imagecopy($thumb,$gr,0,$y_gr,0,0,$ancho_final,$alto_ch); 
		imagejpeg($thumb,$destinoch,80); 		
		unset($thumb);
		
		
		}
}
			
		$t_or = mysql_fetch_array(mysql_query("select * from msc_fotos where fts_prp_id ='$prp_id' order by fts_order desc"));
			$nro = $t_or['fts_order'] + 1; 
			
$txt = "insert into msc_fotos (fts_prp_id, fts_name, fts_order) values('".$prp_id."','".$ffoto."','".$nro."')";
mysql_query($txt);


	?>