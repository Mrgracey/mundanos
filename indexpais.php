
	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">

			
				
<article id="post-60" class="post-60 page type-page status-publish hentry empty-entry-meta">
	
	<header class="entry-header">
		<h1 class="entry-title">PAÍSES</h1>	</header><!-- .entry-header -->

	<div class="entry-content">
		
<p style="text-align:center; margin: 0 0px 0px 2em;" class="has-text-color has-background has-medium-font-size has-white-color has-red-background-color">¿Qué país quieres conocer?<br></p>



<div style="height:50px;" aria-hidden="true" class="wp-block-spacer"></div>


<div class="wp-block-column">
	<div class="grid-container">
		
	<?php
	$A_numeros=array(1,2,3,4,5,6,7,8,9);
		include("conexion.php");
        $query_paises=mysqli_query($con,"SELECT * FROM country WHERE tf_active=1");
        while( $row=mysqli_fetch_array($query_paises)){
            $A_country[]=$row['name'];
			$A_country_id[]=$row['id'];	
			$A_iso[]=$row['iso'];
		}	
			for($i=0; $i<count($A_country); $i++){
            echo '<div class="item'.$A_numeros[$i].'"><h3 style="text-align:center;">'.utf8_encode($A_country[$i]).'</h3>';
				echo '<figure class="">
					<a href="#" id="'.$A_country_id[$i].'" onClick="cargarPais(this.id)">
						<img class="upload" sizes="(max-width: 414px) 100vw, 414px" width="414" height="275" src="uploads/img_'.$A_country_id[$i].'.jpg" alt="">
					</a>
				</figure>
			</div>';
		}
	// }
	?>
	</div>
</div>






	<footer class="entry-meta">
		
			</footer><!-- .entry-meta -->
</article><!-- #post-## -->

				
			
		</main><!-- #main -->
	</div><!-- #primary -->


	
