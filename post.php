<?php
  include("conexion.php");
  $id=$_GET['id'];
  $query=mysqli_query($con, "SELECT * FROM posts WHERE `id`='$id'");
  $query_comments=mysqli_query($con, "SELECT * FROM comments WHERE `id_post`='$id' and `tf_moderate`=1");
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
		<h3 id="reply-title" class="comment-reply-title">
			Responder 
			<small>
				<a rel="nofollow" id="cancel-comment-reply-link" href="/2019/06/11/belice-en-un-dia-y-medio/#respond" style="display:none;">Cancelar respuesta</a>
			</small>
		</h3>
		<div class="comment-form-field comment-textarea">
			<form action="C_comment_mysql.php" method="post" id="commentform" class="comment-form" novalidate="">
				<div id="comment-form-comment" class="">
					<?php
						echo '<input type="hidden" name="id" value="'.$id.'">';
					?>
					<input type="text" placeholder="Nombre?" name="name" style="padding: 10px;width: 40%;background: #f1f2f3;border: 1px solid #f1f2f3;">
					<br>
					<br>
					<input type="text" placeholder="E-mail" name="email" style="padding: 10px;width: 60%;background: #f1f2f3;border: 1px solid #f1f2f3;">
					<br>
					<br>
					<textarea aria-hidden="true" tabindex="-1" style="position: absolute; inset: -999px auto auto 0px; border: 0px none; padding: 0px; box-sizing: content-box; overflow-wrap: break-word; height: 0px !important; min-height: 0px !important; overflow: hidden; transition: none 0s ease 0s; font-family: &quot;Source Sans Pro&quot;, sans-serif; font-size: 14px; font-weight: 400; font-style: normal; letter-spacing: 0px; text-transform: none; text-decoration: rgba(0, 0, 0, 0.7); word-spacing: 0px; text-indent: 0px; line-height: 21px; width: 818px;" class="autosizejs "></textarea>
					<textarea id="comment" name="comment" title="Introduce aquí tu comentario..." placeholder="Introduce aquí tu comentario..." style="height: 70px; overflow: hidden; overflow-wrap: break-word; resize: none; display: inline-block;"></textarea>
					<br>
					<br>
					<div style="float: right;">
						<p class="form-submit" style="display: block;">
							<input name="submit" type="submit" id="comment-submit" class="submit" value="Publicar comentario">
							<input type="hidden" name="comment_post_ID" value="736" id="comment_post_ID">
							<input type="hidden" name="comment_parent" id="comment_parent" value="0">
						</p>
					</div>
				</div>
			</form>
		</div>
		<br>
		<h3 id="reply-title" class="comment-reply-title">
			Comentarios
		</h3>
		<ol class="comment-list">
			<li id="comment-6" class="comment even thread-even depth-1 highlander-comment">
			<?php
				while ($A_row=mysqli_fetch_array($query_comments)) {
						echo '<article id="div-comment-6" class="comment-body clear">
							<div style = "border-bottom: 1px solid #f1f2f3;" class="comment-content">
								<footer class="comment-meta">
									<div>
										<cite class="fn">'.$A_row['name'].'</cite>
									</div>
									<div class="comment-meta-details">
										<span class="comment-meta-time">
											<a href="#">
												<time datetime="2019-12-06T04:12:35+00:00">'.$A_row['uploaded_at'].'</time>
											</a>
										</span>
									</div>
								</footer>
								<p>'.$A_row['comment'].'</p>
							</div><!-- .comment-content -->
						</article><!-- .comment-body -->
						<br>';
					}
				?>
			</li><!-- #comment-## -->
		</ol>
	</main><!-- #main -->
</div><!-- #primary -->

