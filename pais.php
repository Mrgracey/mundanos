<?php
    $iso=$_GET['id'];
    include("conexion.php");
    $query = mysqli_query($con, "SELECT * FROM country WHERE `iso`='$iso'");
    while ($A_row=mysqli_fetch_array($query)) {
        $id=$A_row['id'];
        $name=$A_row['name'];
        $title=$A_row['title'];
        $description=$A_row['description'];
        $tf=$A_row['tf_active'];
    }
    $query_posts = mysqli_query($con, "SELECT * FROM posts WHERE id_country='$id' and tf_active=1");
    
    
    
?>
<div id="primary" class="content-area">
	<main id="main" class="site-main" role="main">	
        <article id="post-99" class="post-99 page type-page status-publish hentry empty-entry-meta">
            <header class="entry-header">
                <h1 class="entry-title"><?php echo $name; ?></h1>	
            </header>
            <div class="entry-content">
                <?php
                        echo    '<h4 class="has-dark-gray-color" style="text-align:center;">'.$title.'</h4>
                        <p style="font-size:19px;text-align:center;" class="has-text-color has-dark-gray-color">
                            <div class="fr-view">'.$description.'</div>
                        </p>';
                    ?>
                
                <hr class="wp-block-separator">
                <?php
                    while ($A_row=mysqli_fetch_array($query_posts)) {
                        echo    '<h4 class="has-dark-gray-color" style="text-align:center;">'.$A_row['title'].'</h4>
                        <div class="fr-view">
                            <p style="font-size:19px;text-align:center;" class="has-text-color has-dark-gray-color">'.$A_row['description'].'</p>
                        </div>
                        <div class="wp-block-button aligncenter is-style-squared">
                            <a class="wp-block-button__link has-text-color has-dark-gray-color has-background" id="'.$A_row['id'].'" style="background-color:#f4b75d;">LEER COMPLETO</a>
                        </div>
                        <hr class="wp-block-separator">
                        <div style="height:25px;" aria-hidden="true" class="wp-block-spacer"></div>';
                    }
                ?>
                
                <!--  -->
            </div>
        </article>
    </main>
</div>
<?php
  include("conexion.php");
  $A_id=array(0);
  $A_tf=array(0);
  $posts_in_array=mysqli_query($con, "SELECT id, tf_active FROM posts");
  while ($A_row=mysqli_fetch_array($posts_in_array)) {
    $A_id[]=$A_row['id'];
    $A_tf[]=$A_row['tf_active'];
  }
  
  // for($i=0;$i<count($A_ISO);$i++){
  //  echo $A_ISO[$i].'<br>';
  // }
?> 
<script>
  var idJS=<?php echo json_encode($A_id);?>;
  var tfJS=<?php echo json_encode($A_tf);?>;
  for (i = 0; i < idJS.length; i++) { 
    
    
    if (tfJS[i]==1) {
      $( '#'+idJS[i] ).click(function(){
        $('#content').load('post.php?id='+ $(this).attr('id') );
      });
    }else{
        $( '#'+idJS[i] ).click(function(e) {
            e.preventDefault();
		});
    }
  }
</script> 