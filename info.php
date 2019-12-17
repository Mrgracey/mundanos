<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="css/prueba.css">
    <link href="css/froala_editor.pkgd.min.css" rel="stylesheet" type="text/css" />
    <link href="css/froala_style.min.css" rel="stylesheet" type="text/css" />
    <title>Document</title>
</head>
<body>
<div class="fr-view">
    <?php
// session_start();

// $user = 'root';
// $pass = '';
// $host ='localhost';
// $database = "mundanos";




$parrafo1=$_POST['content'];


echo $parrafo1; 


//  mysqli_query($con,"INSERT INTO `text` (`text`, `id_posts`) VALUES ('$parrafo1', '1')");

// $query=mysqli_query($con,"SELECT * FROM `text`");

// while($data = mysqli_fetch_array($query)){
//     echo "<hr>".$data['id'];
//     echo $data['text'];
// }
    ?>  
</div>
<script type="text/javascript" src="js/jquery-3.4.1.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/froala-editor@latest/js/froala_editor.pkgd.min.js"></script>
    <script type="text/javascript" src="https://raw.githack.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.js"></script>

<script>
   new FroalaEditor('textarea', {
    toolbarInline: true,
    charCounterCount: false
  })
</script>
</body>
</html>
