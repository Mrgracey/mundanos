
	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">

			
				
<article id="post-60" class="post-60 page type-page status-publish hentry empty-entry-meta">
	
	<header class="entry-header">
		<h1 class="entry-title">PAÍSES</h1>	</header><!-- .entry-header -->

	<div class="entry-content">
		
<p style="text-align:center;" class="has-text-color has-background has-medium-font-size has-white-color has-red-background-color">¿Qué país quieres conocer?<br></p>



<div style="height:50px;" aria-hidden="true" class="wp-block-spacer"></div>


<div class="wp-block-column">
	<div class="grid-container">
	<?php
	$A_numeros=array(1,2,3,4,5,6,7,8,9);
		include("conexion.php");
        $query_paises=mysqli_query($con,"SELECT id, name FROM country WHERE tf_active=1");
        while( $row=mysqli_fetch_array($query_paises)){
            $A_country[]=$row['name'];
			$A_country_id[]=$row['id'];	
		}	
			for($i=0; $i<count($A_country); $i++){
            echo '<div class="item'.$A_numeros[$i].'"><h3 style="text-align:center;">'.utf8_encode($A_country[$i]).'</h3>';
            echo '<figure class=""><a href="https://mundanos.net/paises/belice/" rel="https://mundanos.net/paises/belize/"><img data-attachment-id="448" data-permalink="https://mundanos.net/belize-3-2/" data-orig-file="https://mundanos783251065.files.wordpress.com/2019/04/belize-3-1.jpg" data-orig-size="5880,3920" data-comments-opened="1" data-image-meta="{&quot;aperture&quot;:&quot;2.5&quot;,&quot;credit&quot;:&quot;&quot;,&quot;camera&quot;:&quot;NIKON D3300&quot;,&quot;caption&quot;:&quot;&quot;,&quot;created_timestamp&quot;:&quot;1533130324&quot;,&quot;copyright&quot;:&quot;&quot;,&quot;focal_length&quot;:&quot;35&quot;,&quot;iso&quot;:&quot;200&quot;,&quot;shutter_speed&quot;:&quot;0.002&quot;,&quot;title&quot;:&quot;&quot;,&quot;orientation&quot;:&quot;0&quot;}" data-image-title="Hopkins, Belize" data-image-description="" data-medium-file="https://mundanos783251065.files.wordpress.com/2019/04/belize-3-1.jpg?w=300" data-large-file="https://mundanos783251065.files.wordpress.com/2019/04/belize-3-1.jpg?w=840" src="paises_archivos/belize-3-1.jpg" alt="" class="wp-image-448" srcset="https://mundanos783251065.files.wordpress.com/2019/04/belize-3-1.jpg?w=414 414w, https://mundanos783251065.files.wordpress.com/2019/04/belize-3-1.jpg?w=825 825w, https://mundanos783251065.files.wordpress.com/2019/04/belize-3-1.jpg?w=150 150w, https://mundanos783251065.files.wordpress.com/2019/04/belize-3-1.jpg?w=300 300w, https://mundanos783251065.files.wordpress.com/2019/04/belize-3-1.jpg?w=768 768w" sizes="(max-width: 414px) 100vw, 414px" width="414" height="275"></a></figure></div>';
		}
	// }
	?>
	</div>
</div>






<p></p>
<div id="jp-post-flair" class="sharedaddy sd-like-enabled sd-sharing-enabled"><div class="sharedaddy sd-sharing-enabled"><div class="robots-nocontent sd-block sd-social sd-social-icon-text sd-sharing"><h3 class="sd-title">Compártelo:</h3><div class="sd-content"><ul><li class="share-twitter"><a rel="nofollow noopener noreferrer" data-shared="sharing-twitter-60" class="share-twitter sd-button share-icon" href="https://mundanos.net/paises/?share=twitter&amp;nb=1" target="_blank" title="Haz clic para compartir en Twitter"><span>Twitter</span></a></li><li class="share-facebook"><a rel="nofollow noopener noreferrer" data-shared="sharing-facebook-60" class="share-facebook sd-button share-icon" href="https://mundanos.net/paises/?share=facebook&amp;nb=1" target="_blank" title="Click to share on Facebook"><span>Facebook</span></a></li><li class="share-end"></li></ul></div></div></div><div class="sharedaddy sd-block sd-like jetpack-likes-widget-wrapper jetpack-likes-widget-loaded" id="like-post-wrapper-160719501-60-5ddd3c9812942" data-src="//widgets.wp.com/likes/index.html?ver=20190321#blog_id=160719501&amp;post_id=60&amp;origin=mundanos783251065.wordpress.com&amp;obj_id=160719501-60-5ddd3c9812942&amp;domain=mundanos.net" data-name="like-post-frame-160719501-60-5ddd3c9812942"><h3 class="sd-title">Me gusta:</h3><div class="likes-widget-placeholder post-likes-widget-placeholder" style="height: 55px; display: none;"><span class="button"><span>Me gusta</span></span> <span class="loading">Cargando...</span></div><iframe class="post-likes-widget jetpack-likes-widget" name="like-post-frame-160719501-60-5ddd3c9812942" src="indexpais_archivos/index.html" width="100%" height="55px" frameborder="0"></iframe><span class="sd-text-color"></span><a class="sd-link-color"></a></div></div>			</div><!-- .entry-content -->

	<footer class="entry-meta">
		
			</footer><!-- .entry-meta -->
</article><!-- #post-## -->

				
			
		</main><!-- #main -->
	</div><!-- #primary -->


	<div id="secondary" role="complementary">
		<a href="#" class="widgets-trigger"><span class="screen-reader-text">Widgets</span></a>
		<div class="widgets-wrapper">
			<div class="widgets-area clear" style="position: relative; height: 0px;">
				<aside id="search-1" class="widget widget_search" style="position: absolute; left: 0px; top: 0px;"><h1 class="widget-title">Búsqueda</h1><form role="search" method="get" class="search-form" action="https://mundanos.net/">
				<label>
					<span class="screen-reader-text">Buscar:</span>
					<input type="search" class="search-field" placeholder="Buscar …" name="s">
				</label>
				<input type="submit" class="search-submit" value="Buscar">
			</form></aside><aside id="text-1" class="widget widget_text" style="position: absolute; left: 0px; top: 0px;"><h1 class="widget-title">¡Hola! Soy Lucía</h1>			<div class="textwidget"><p><img class="alignnone size-medium wp-image-383" src="indexpais_archivos/img_5525.jpg" alt="" width="300" height="225">Vengo
 de Argentina y de América Latina. Soy historiadora, fotógrafa, 
escritora y una viajera apasionada. Empecé a viajar de una forma <em>mundana</em>
 en 2014, cuando me fui a recorrer Sudamérica a dedo durante un año. En 
2017 me gané una beca de la Universidad de Buenos Aires para estudiar en
 México, y me fui 8 meses a vivir a Guadalajara. Ahí aproveché para 
viajar por Cuba, Belize Y Guatemala, y finalmente me fui a China por 
cinco meses. Hoy estoy viviendo temporalmente en Brasil y dándole forma a
 todo esto que aprendí y quiero compartir con ustedes. Haber tenido la 
suerte y las posibilidades de recorrer el mundo así, de haber entrado en
 comunidades y espacios remotos, me hace sentir responsable con mi 
propia sociedad. Si yo pude deconstruirme, romper los estereotipos que 
traía y encontrarme con otros pueblos desde la más pura humanidad, ¿por 
qué reservarlo sólo para mí?</p>
<p>Yo no soy la protagonista de esta historia, si no una mediadora. La 
idea es hablar del mundo a través de su gente, comunicar mundanos de 
aquí con mundanos de allá, abrirnos la cabeza a otras realidades. Así 
que más que bienvenido a este <strong>mundo</strong> <strong>mundano</strong>, que habla de gente como vos y yo.</p>
<p>+ <a href="https://mundanos.net/la-propuesta/">Sobre MUNDANOS</a></p>
<p>+ <a href="https://mundanos.net/sobre-mi/">Sobre mí</a></p>
</div>
		</aside>		<aside id="recent-posts-3" class="widget widget_recent_entries" style="position: absolute; left: 0px; top: 0px;">		<h1 class="widget-title">Entradas recientes</h1>		<ul>
											<li>
					<a href="https://mundanos.net/2019/06/24/la-historia-de-belice/">LA HISTORIA DE&nbsp;BELICE</a>
									</li>
											<li>
					<a href="https://mundanos.net/2019/06/11/belice-en-un-dia-y-medio/">Belice: en un día y&nbsp;medio</a>
									</li>
											<li>
					<a href="https://mundanos.net/2019/05/30/la-historia-de-cuba-i/">La historia de Cuba: Parte&nbsp;I</a>
									</li>
											<li>
					<a href="https://mundanos.net/2019/04/28/microrelatos-de-artemisa/">MICRORELATOS DE ARTEMISA</a>
									</li>
											<li>
					<a href="https://mundanos.net/2019/04/18/guia-mundana-para-recorrer-cuba/">GUÍA (MUNDANA) PARA RECORRER&nbsp;CUBA</a>
									</li>
					</ul>
		</aside>			</div><!-- .widgets-area -->
		</div><!-- .widgets-wrapper -->
	</div><!-- #secondary -->
