<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://cdn.jsdelivr.net/npm/froala-editor@3.0.6/css/froala_editor.pkgd.min.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/froala-editor@3.0.6/js/froala_editor.pkgd.min.js"></script>
    <title>Document</title>
</head>
<body>
    <form action="prueba.php" method="post">
        <textarea id="example" name="froala"></textarea>
        <input type="submit" value="submit">
    </form>
    <script>
        var editor = new FroalaEditor('#example')
    </script>
</body>
</html>