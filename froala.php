<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">

  <!-- Include Editor style. -->
  <link href="https://cdn.jsdelivr.net/npm/froala-editor@3.0.0-beta.1/css/froala_editor.pkgd.min.css" rel="stylesheet" type="text/css" />
</head>

<body>
  <div class="sample">
    <h2>File upload example.</h2>
    <form method="post" action="info.php">
      <textarea id="edit" name="content"></textarea>
      <input type="submit">
    </form>
  </div>

  <!-- Include Editor JS files. -->
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/froala-editor@3.0.0-beta.1/js/froala_editor.pkgd.min.js"></script>

  <!-- Initialize the editor. -->
  <script>
    new FroalaEditor('#edit', {
      // Set the file upload URL.
      imageUploadURL: './upload_image.php',

      imageUploadParams: {
        id: 'edit'
      }
    })
  </script>
</body>
</html>