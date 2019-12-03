<?php
  include("conexion.php");
  $id=$_GET['id'];
  $query=mysqli_query($con, "SELECT * FROM posts WHERE `id`='$id'");
  while ($A_row=mysqli_fetch_array($query)) {
	$title=$A_row['title'];
	$description=$A_row['description'];
	$body=$A_row['body'];
  }
  
  // for($i=0;$i<count($A_ISO);$i++){
  //  echo $A_ISO[$i].'<br>';
  // }
?> 
<div id="primary" class="content-area">
	<main id="main" class="site-main" role="main">
		<article id="post-736" class="post-736 post type-post status-publish format-standard has-post-thumbnail hentry category-belice category-relatos-viajeros">
			<div class="entry-thumbnail">
				<img src="post_archivos/belice-14.jpg" class="attachment-illustratr-featured-image size-illustratr-featured-image wp-post-image" alt="" srcset="https://mundanos783251065.files.wordpress.com/2019/06/belice-14.jpg?w=1100&amp;h=500&amp;crop=1 1100w, https://mundanos783251065.files.wordpress.com/2019/06/belice-14.jpg?w=2200&amp;h=1000&amp;crop=1 2200w, https://mundanos783251065.files.wordpress.com/2019/06/belice-14.jpg?w=150&amp;h=68&amp;crop=1 150w, https://mundanos783251065.files.wordpress.com/2019/06/belice-14.jpg?w=300&amp;h=136&amp;crop=1 300w, https://mundanos783251065.files.wordpress.com/2019/06/belice-14.jpg?w=768&amp;h=349&amp;crop=1 768w, https://mundanos783251065.files.wordpress.com/2019/06/belice-14.jpg?w=1024&amp;h=465&amp;crop=1 1024w" sizes="(max-width: 1100px) 100vw, 1100px" data-attachment-id="739" data-permalink="https://mundanos.net/belice-14/" data-orig-file="https://mundanos783251065.files.wordpress.com/2019/06/belice-14.jpg" data-orig-size="6000,4000" data-comments-opened="1" data-image-meta="{&quot;aperture&quot;:&quot;1.8&quot;,&quot;credit&quot;:&quot;&quot;,&quot;camera&quot;:&quot;NIKON D3300&quot;,&quot;caption&quot;:&quot;&quot;,&quot;created_timestamp&quot;:&quot;1531491445&quot;,&quot;copyright&quot;:&quot;&quot;,&quot;focal_length&quot;:&quot;35&quot;,&quot;iso&quot;:&quot;100&quot;,&quot;shutter_speed&quot;:&quot;0.000625&quot;,&quot;title&quot;:&quot;&quot;,&quot;orientation&quot;:&quot;0&quot;}" data-image-title="belice-14" data-image-description="" data-medium-file="https://mundanos783251065.files.wordpress.com/2019/06/belice-14.jpg?w=300" data-large-file="https://mundanos783251065.files.wordpress.com/2019/06/belice-14.jpg?w=840" width="1100" height="500">
			</div><!-- .entry-thumbnail -->
			<header class="entry-header">
				<?php
					echo '<h1 class="entry-title">'.$title.'</h1>';
				?>
				<span class="cat-links">
					<!-- <a href="https://mundanos.net/category/belice/" rel="category tag">Belice</a>, 
					<a href="https://mundanos.net/category/relatos-viajeros/" rel="category tag">Relatos viajeros</a> -->
				</span>
			</header><!-- .entry-header -->
			<div class="entry-content">
				<?php
					echo '
						<div class="fr-view">'.$description.'</div>
						<div class="fr-view">'.$body.'</div>
					';
				?>
			</div>
		</article><!-- #post-## -->
	</main><!-- #main -->
</div><!-- #primary -->

