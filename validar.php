<?php
include("conexion.php");

$user = $_POST['user'];
$pass = $_POST['password'];

$query = mysqli_query($con, "SELECT id, type  FROM user WHERE  user = '$user' and password = '$pass' and tf_active=1 ");

$result = mysqli_num_rows($query);
	if ($result == 0) {
		header("location: login.php");
	}else {
		$row = mysqli_fetch_array($query);
			$type = $row['type'];
			session_start();
			$_SESSION['user'] = $user;
			

			if ($type == 'admin') {
				header("location: dashboard.php");
				$_SESSION['autenticado'] = 'si';
			}else {
				$_SESSION['autenticado'] = 'no';
				header("location: mundanos.php");
		}
	}