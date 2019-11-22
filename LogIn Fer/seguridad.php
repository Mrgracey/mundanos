<?php
session_start();
if ($_SESSION['autenticado'] !='si') {
	header("location: mundanos.php");
}
