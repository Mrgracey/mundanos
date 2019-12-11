<?php
//include 'conexion.php';


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'src/Exception.php';
require 'src/PHPMailer.php';
require 'src/SMTP.php';


$name = $_POST["name"];
$email = $_POST["email"];
$text = $_POST["text"];
$web = $_POST["web"];

$body = "Nombre: ".$name."<br> Email: ".$email."<br> Mensaje: ".$text;


//
// if(!isset($_POST['name']) ||
// !isset($_POST['email']) ||
// !isset($_POST['subject']) ||
// !isset($_POST['message'])) {

// $email_message = "Detalles del formulario de contacto:\n\n";
// $email_message .= "Nombre: " . $_POST['name'] . "\n";
// $email_message .= "E-mail: " . $_POST['email'] . "\n";
// $email_message .= "Teléfono: " . $_POST['subject'] . "\n";
// $email_message .= "Comentarios: " . $_POST['message'] . "\n\n";

$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->SMTPDebug = 0;                      // Enable verbose debug output
    $mail->isSMTP();                                            // Send using SMTP
    $mail->Host       = 'smtp.gmail.com';                    // Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
    $mail->Username   = 'gracey.martin@cts.edu.ar';                     // SMTP username
    $mail->Password   = 'Gimenez1.';                               // SMTP password
    $mail->SMTPSecure = 'tls';         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` also accepted
    $mail->Port       = 587;                                    // TCP port to connect to

    //Recipients
    $mail->setFrom('gracey.martin@cts.edu.ar', $name);
    $mail->addAddress('gracey.martin@cts.edu.ar', 'Mundanos');     // Add a recipient


    // Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = "Mundanos nuevo comentario";
    $mail->Body    = $body;


    $mail->send();
    echo 'mensaje enviado';
    header("location: mundanos.php");
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}


?>
