<?php
session_start();
$user = $_SESSION['username'];
include 'conexion.php';
include 'seguridad.php';
 ?>
<!doctype html>
<html lang="zxx">
<!--  -->
<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>gaming</title>
  <link rel="icon" href="img/favicon.png">
  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="css/bootstrap.min.css">
  <!-- animate CSS -->
  <link rel="stylesheet" href="css/animate.css">
  <!-- owl carousel CSS -->
  <link rel="stylesheet" href="css/owl.carousel.min.css">
  <!-- font awesome CSS -->
  <link rel="stylesheet" href="css/all.css">
  <!-- flaticon CSS -->
  <link rel="stylesheet" href="css/flaticon.css">
  <link rel="stylesheet" href="css/themify-icons.css">
  <!-- font awesome CSS -->
  <link rel="stylesheet" href="css/magnific-popup.css">
  <!-- swiper CSS -->
  <link rel="stylesheet" href="css/slick.css">
  <!-- style CSS -->
  <link rel="stylesheet" href="css/style.css">
</head>

<body>
  <!--::header part start::-->
  <?php include("incluidos/barra_menu.php");?>
  <!-- Header part end-->

  <!-- breadcrumb start-->
  <section class="breadcrumb breadcrumb_bg">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="breadcrumb_iner text-center">
            <div class="breadcrumb_iner_item">
              <h2>Soporte</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- breadcrumb start-->

  <!-- ================ contact section start ================= -->
  <section class="contact-section section_padding">
    <div class="container">


      <div class="row">



<!-- inicio form  -->
          <form class="form-contact contact_form" action="enviar_mail.php" method="POST" id="contactForm" novalidate="novalidate">
            <div class="row">
              <div class="col-12">
                <div class="form-group">

                  <textarea class="form-control w-100" name="message" id="message" cols="30" rows="9"
                    onfocus="this.placeholder = ''" onblur="this.placeholder = 'Enter Message'"
                    placeholder='Mensaje'></textarea>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <input class="form-control" name="name" id="name" type="text" onfocus="this.placeholder = ''"
                    onblur="this.placeholder = 'Enter your name'" placeholder='Su Nombre'>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <input class="form-control" name="email" id="email" type="email" onfocus="this.placeholder = ''"
                    onblur="this.placeholder = 'Enter email address'" placeholder='Su e-mail'>
                </div>
              </div>
              <div class="col-12">
                <div class="form-group">
                  <input class="form-control" name="subject" id="subject" type="text" onfocus="this.placeholder = ''"
                    onblur="this.placeholder = 'Enter Subject'" placeholder='Asunto'>
                </div>
              </div>
            </div>
            <div class="form-group mt-3">
              <button type="submit" value="Enviar Mensaje" class="button-contactForm btn_1">Enviar</button>
            </div>
          </form>

<!-- fin form  -->



    </div>
  </section>
  <!-- ================ contact section end ================= -->

  <!--::footer_part start::-->
  <footer class="footer_part black">
    <div class="footer_top">
      <div class="container">
        <div class="row">
          <div class="col-sm-6 col-lg-3">
            <div class="single_footer_part">
              <a href="index.html" class="footer_logo_iner"> <img src="img/logo.png" alt="#"> </a>
              <p>Heaven fruitful doesn't over lesser days appear creeping seasons so behold bearing
                days
                open
              </p>
            </div>
          </div>
          <div class="col-sm-6 col-lg-3">
            <div class="single_footer_part">
              <h4>Contact Info</h4>
              <p>Address : Your address goes
                here, your demo address.
                Bangladesh.</p>
              <p>Phone : +8880 44338899</p>
              <p>Email : info@colorlib.com</p>
            </div>
          </div>
          <div class="col-sm-6 col-lg-3">
            <div class="single_footer_part">
              <h4>Important Link</h4>
              <ul class="list-unstyled">
                <li><a href=""> WHMCS-bridge</a></li>
                <li><a href="">Search Domain</a></li>
                <li><a href="">My Account</a></li>
                <li><a href="">Shopping Cart</a></li>
                <li><a href="">Our Shop</a></li>
              </ul>
            </div>
          </div>
          <div class="col-sm-6 col-lg-3">
            <div class="single_footer_part">
              <h4>Newsletter</h4>
              <p>Heaven fruitful doesn't over lesser in days. Appear creeping seasons deve behold
                bearing
                days
                open
              </p>
              <div id="mc_embed_signup">
                <form target="_blank"
                  action="https://spondonit.us12.list-manage.com/subscribe/post?u=1462626880ade1ac87bd9c93a&amp;id=92a4423d01"
                  method="get" class="subscribe_form relative mail_part">
                  <input type="email" name="email" id="newsletter-form-email" placeholder="Email Address"
                    class="placeholder hide-on-focus" onfocus="this.placeholder = ''"
                    onblur="this.placeholder = ' Email Address '">
                  <button type="submit" name="submit" id="newsletter-submit"
                    class="email_icon newsletter-submit button-contactForm"><i class="far fa-paper-plane"></i></button>
                  <div class="mt-10 info"></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="copygight_text">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <div class="copyright_text">
              <P><!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->
Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | This template is made with <i class="ti-heart" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank">Colorlib</a>
<!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. --></P>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="footer_icon social_icon">
              <ul class="list-unstyled">
                <li><a href="#" class="single_social_icon"><i class="fab fa-facebook-f"></i></a>
                </li>
                <li><a href="#" class="single_social_icon"><i class="fab fa-twitter"></i></a></li>
                <li><a href="#" class="single_social_icon"><i class="fas fa-globe"></i></a></li>
                <li><a href="#" class="single_social_icon"><i class="fab fa-behance"></i></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
  <!--::footer_part end::-->
  <!-- jquery plugins here-->
  <script src="js/jquery-1.12.1.min.js"></script>
  <!-- popper js -->
  <script src="js/popper.min.js"></script>
  <!-- bootstrap js -->
  <script src="js/bootstrap.min.js"></script>
  <!-- easing js -->
  <script src="js/jquery.magnific-popup.js"></script>
  <!-- swiper js -->
  <script src="js/swiper.min.js"></script>
  <!-- swiper js -->
  <script src="js/masonry.pkgd.js"></script>
  <!-- particles js -->
  <script src="js/owl.carousel.min.js"></script>
  <script src="js/jquery.nice-select.min.js"></script>
  <!-- slick js -->
  <script src="js/slick.min.js"></script>
  <script src="js/jquery.counterup.min.js"></script>
  <script src="js/waypoints.min.js"></script>
  <script src="js/contact.js"></script>
  <script src="js/jquery.ajaxchimp.min.js"></script>
  <script src="js/jquery.form.js"></script>
  <script src="js/jquery.validate.min.js"></script>
  <script src="js/mail-script.js"></script>
  <!-- custom js -->
  <script src="js/custom.js"></script>
</body>

</html>
