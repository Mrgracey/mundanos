<?php
    include("../seguridad.php");
?>
<!DOCTYPE html>
<html dir="ltr" lang="en"><head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- Tell the browser to be responsive to screen width -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <!-- Favicon icon -->
    <link rel="icon" type="image/png" sizes="16x16" href="../wp_template/cropped-mundo3-1.png">
    <title>MUNDANOS - Admin Dashboard</title>
    <!-- This Page CSS -->
    <link href="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/chartist.css" rel="stylesheet">
    <link href="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/chartist-plugin-tooltip.css" rel="stylesheet">
    <link href="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/jvector.css" rel="stylesheet">
    <link href="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/jquery-jvectormap-2.css" rel="stylesheet">
    <!-- needed css -->
    <link href="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/style.css" rel="stylesheet">

    <link rel="stylesheet" href="../css/prueba.css">
    <link href="../css/froala_editor.pkgd.min.css" rel="stylesheet" type="text/css" />
    <link href="../css/froala_style.min.css" rel="stylesheet" type="text/css" />
    
    <link href="../css/froala_editor.pkgd.min.css" rel="stylesheet" type="text/css" />
    <link href="../css/themes/dark.min.css" rel="stylesheet" type="text/css" />

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
<![endif]-->
<style type="text/css">
    .jqstooltip { 
        position: absolute;
        left: 0px;
        top: 0px;
        visibility: hidden;
        background: rgb(0, 0, 0) transparent;
        background-color: rgba(0,0,0,0.6);
        filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000);
        -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000)";
        color: white;
        font: 10px arial, san serif;
        text-align: left;
        white-space: nowrap;
        padding: 5px;border: 1px solid white;
        z-index: 10000;
    }
    .jqsfield { 
        color: white;
        font: 10px arial, san serif;
        text-align: left;
    }
     /* The switch - the box around the slider */
.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }
  
  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }
  
  input:checked + .slider {
    background-color: #2196F3;
  }
  
  input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
  }
  
  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
  
  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }
  
  .slider.round:before {
    border-radius: 50%;
  } 

  .inp {
  position: relative;
  margin: auto;
  width: 100%;
  max-width: 280px;
}
.inp .label {
  position: absolute;
  top: 16px;
  left: 0;
  font-size: 16px;
  color: #9098a9;
  font-weight: 500;
  transform-origin: 0 0;
  transition: all 0.2s ease;
}
.inp .border {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 100%;
  background: #07f;
  transform: scaleX(0);
  transform-origin: 0 0;
  transition: all 0.15s ease;
}
.inp input {
  -webkit-appearance: none;
  width: 100%;
  border: 0;
  font-family: inherit;
  padding: 12px 0;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 2px solid #c8ccd4;
  background: none;
  border-radius: 0;
  color: white;
  transition: all 0.15s ease;
}
.inp input:hover {
  background: rgba(34,50,84,0.03);
}
.inp input:not(:placeholder-shown) + span {
  color: #5a667f;
  transform: translateY(-26px) scale(0.75);
}
.inp input:focus {
  background: none;
  outline: none;
}
.inp input:focus + span {
  color: #07f;
  transform: translateY(-26px) scale(0.75);
}
.inp input:focus + span + .border {
  transform: scaleX(1);
}
.inline{
    display: inline;
}
.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
</head>

<body data-theme="dark">
    <?php
        include("../conexion.php");
        $id=$_GET['id'];
        $query = mysqli_query($con, "SELECT * FROM country WHERE id='$id' ");
        $comments=mysqli_query($con, "SELECT * FROM comments WHERE tf_moderate=0");
        $num_comments=mysqli_num_rows($comments);
    ?>
    <!-- ============================================================== -->
    <!-- Preloader - style you can find in spinners.css -->
    <!-- ============================================================== -->
    <div class="preloader" style="display: none;">
        <div class="lds-ripple">
            <div class="lds-pos"></div>
            <div class="lds-pos"></div>
        </div>
    </div>
    <!-- ============================================================== -->
    <!-- Main wrapper - style you can find in pages.scss -->
    <!-- ============================================================== -->
    <div id="main-wrapper" data-layout="vertical" data-navbarbg="skin1" data-sidebartype="mini-sidebar" data-sidebar-position="fixed" data-header-position="fixed" data-boxed-layout="full">
        <!-- ============================================================== -->
        <!-- Topbar header - style you can find in pages.scss -->
        <!-- ============================================================== -->
        <header class="topbar" data-navbarbg="skin6">
            
            <nav class="navbar top-navbar navbar-expand-md navbar-light">
                <div class="navbar-header border-right" data-logobg="skin6">
                    <!-- This is for the sidebar toggle which is visible on mobile only -->
                    <a class="nav-toggler waves-effect waves-light d-block d-md-none" href="javascript:void(0)"><i class="ti-menu ti-close"></i></a>
                    <a class="navbar-brand" href="../mundanos.html">
                        <!-- Logo icon -->
                        <b class="logo-icon">
                            <!--You can put here icon as well // <i class="wi wi-sunset"></i> //-->
                            <!-- Dark Logo icon -->
                            <img src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/logo-icon.png" alt="homepage" class="dark-logo">
                            <!-- Light Logo icon -->
                            <img src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/logo-light-icon.png" alt="homepage" class="light-logo">
                        </b>
                        <!--End Logo icon -->
                        <!-- Logo text -->
                        <span class="logo-text">
                             <!-- dark Logo text -->
                             <img src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/logo-text.png" alt="homepage" class="dark-logo">
                             <!-- Light Logo text -->    
                             <img src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/logo-light-text.png" class="light-logo" alt="homepage">
                        </span>
                    </a>
                    <!-- ============================================================== -->
                    <!-- End Logo -->
                    <!-- ============================================================== -->
                    <!-- ============================================================== -->
                    <!-- Toggle which is visible on mobile only -->
                    <!-- ============================================================== -->
                    <a class="topbartoggler d-block d-md-none waves-effect waves-light" href="javascript:void(0)" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><i class="ti-more"></i></a>
                </div>
                <div class="navbar-collapse collapse" id="navbarSupportedContent" data-navbarbg="skin6">
                    <ul class="navbar-nav float-left mr-auto">
                        <li class="nav-item d-none d-md-block">
                            <a class="nav-link sidebartoggler waves-effect waves-light" href="javascript:void(0)" data-sidebartype="mini-sidebar">
                                <i class="fa fa-bars"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
        <aside class="left-sidebar" data-sidebarbg="skin5">
            <div class="scroll-sidebar ps-container ps-theme-default ps-active-y" data-ps-id="93307cc5-70b0-7de7-8c7f-51ecda3ac404">
                <nav class="sidebar-nav">
                    <ul id="sidebarnav" class="in">
                        <li class="sidebar-item selected">
                            <a class="sidebar-link has-arrow waves-effect waves-dark active" href="../dashboard.php" aria-expanded="false">
                                <i class="fa fa-chart-line"></i>
                                <span class="hide-menu">Dashboard</span> 
                                <?php
                                            if ($num_comments>0) {
                                                echo '<span class="badge badge-inverse badge-pill ml-auto mr-3 font-medium px-2 py-1">'.$num_comments.'</span>';
                                            }
                                        ?>
                            </a>
                            <ul aria-expanded="false" class="collapse first-level in">
                                <li class="sidebar-item active">
                                    <a href="../paises.php" class="sidebar-link active">
                                        <i class="fa fa-flag"></i>
                                        <span class="hide-menu"> Paises </span>
                                    </a>
                                </li>
                                <li class="sidebar-item ">
                                    <a href="dashboard.php" class="sidebar-link ">
                                        <i class="fa fa-users"></i>
                                        <span class="hide-menu"> Users </span>
                                    </a>
                                </li>
                                <li class="sidebar-item">
                                    <a href="../publicaciones.php" class="sidebar-link">
                                        <i class="fa fa-file"></i>
                                        <span class="hide-menu"> Publicaciones </span>
                                    </a>
                                </li>
                                <li class="sidebar-item">
                                    <a href="../comentarios.php" class="sidebar-link">
                                        <i class="fa fa-comment-dots"></i>
                                        <span class="hide-menu"> Comentarios </span>
                                        <?php
                                            if ($num_comments>0) {
                                                echo '<span class="badge badge-inverse badge-pill ml-auto mr-3 font-medium px-2 py-1">'.$num_comments.'</span>';
                                            }
                                        ?>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
                <div class="ps-scrollbar-x-rail" style="left: 0px; bottom: 0px;">
                    <div class="ps-scrollbar-x" tabindex="0" style="left: 0px; width: 0px;">
                    </div>
                </div>
                <div class="ps-scrollbar-y-rail" style="top: 0px; height: 0px; right: 3px;">
                    <div class="ps-scrollbar-y" tabindex="0" style="top: 0px; height: 0px;">
                    </div>
                </div>
            </div>
        </aside>
        <div class="page-wrapper" style="display: block;">
            <div class="page-content container-fluid">
                <div class="row">
                    <div class="col-md-12">
                        
                        
                        <div class="row"> 
                                            <div class=" col-lg-2">
                                                
                                            </div>
                                            <div class="col-md-12 col-lg-8">
                                                <div class="card">
                                                    
                                                    <div class="card-body">
                                                        
                                                        <?php
                                                            // $query_paises=mysqli_query($con,"SELECT id, name FROM country");
                                                            // while( $row=mysqli_fetch_array($query_paises)){
                                                            //     $A_country[]=$row['name'];
                                                            //     $A_country_id[]=$row['id'];
                                                            // }
                                                            if (isset($_POST['tf_active'])) {
                                                                while( $A_row=mysqli_fetch_array($query)){
                                                                    //debug array nombre paises "$A_country"  
                                                                    
                                                                    // $country=$A_row['id_country']-1;
                                                                    echo    '<form action="U_country_mysql.php" method="post">
                                                                                <input type="hidden" name="id" value="'.$id.'">
                                                                                <label style="float: left; display: inline;" for="inp" class="inp">
                                                                                    <input type="text" value="'. $A_row['title'].'" name="title" id="inp" placeholder="Titulo">
                                                                                    <span class="label"></span>
                                                                                    <span class="border"></span>
                                                                                </label>
                                                                                <label style="float: right; display: inline;" for="inp" class="text-muted inp">
                                                                                    <input style="text-align: right; border: none;" class="text-muted" type="text" disabled value="'. utf8_encode($A_row['name']).'" name="title" id="inp" placeholder="Titulo">
                                                                                    
                                                                                </label>
                                                                                </br>
                                                                                </br>
                                                                                </br>
                                                                                
                                                                                <textarea id="description" name="description">'.utf8_encode($A_row['description']).'</textarea>
                                                                                <br>
                                                                                <div class="inline">
                                                                                <button type="submit" class="inline btn btn-danger text-white float-right ml-3 d-none d-md-block">Guardar cambios  </button>
                                                                                
                                                                            </form>';
                                                                            $fileName= basename ($_FILES ['fileToUpload']['name']);
                                                                            $fileDest	= "../uploads/img_".$id.".jpg";
                                                                            move_uploaded_file ($_FILES ['fileToUpload']['tmp_name'], $fileDest);
                                                                }
                                                            }else{
                                                                echo    ' <div class="loader"></div><form name="tfinactivo" id="tfinactivo" action="U_country_mysql.php" method="get"><input type="hidden" name="id" value="'.$id.'"><input type="submit" value="Submit" hidden/></form>';
                                                                ?>
                                                                <script type="text/javascript">
                                                                    window.onload=function(){
                                                                        var auto = setTimeout(function(){ autoRefresh(); }, 10);

                                                                        function submitform(){
                                                                        document.forms["tfinactivo"].submit();
                                                                        }

                                                                        function autoRefresh(){
                                                                        clearTimeout(auto);
                                                                        auto = setTimeout(function(){ submitform(); autoRefresh(); }, 100);
                                                                        }
                                                                    }
                                                                </script>
                                                                <?php
                                                            }
                                                        ?>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-2">
                                                
                                            </div>
                                        </div>
                    </div>
                </div>
            </div>  
            <footer class="footer text-center">
                All Rights Reserved. Designed and Developed by
                MrGracey.
            </footer>
            
        </div>
        <!-- ============================================================== -->
        <!-- End Page wrapper  -->
        <!-- ============================================================== -->
    </div>
    <!-- ============================================================== -->
    <!-- End Wrapper -->
    <!-- ============================================================== -->
    <!-- ============================================================== -->
    <!-- customizer Panel -->
    <!-- ============================================================== -->
    
    <div class="chat-windows"></div>
    <!-- ============================================================== -->
    <!-- All Jquery -->
    <!-- ============================================================== -->
    <script src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/jquery.js"></script>
    <!-- Bootstrap tether Core JavaScript -->
    <script src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/popper.js"></script>
    <script src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/bootstrap.js"></script>
    <!-- apps -->
    <script src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/app_002.js"></script>
    <script src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/app.js"></script>
    <script src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/app-style-switcher.js"></script>
    <!-- slimscrollbar scrollbar JavaScript -->
    <script src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/perfect-scrollbar.js"></script>
    <script src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/sparkline.js"></script>
    <!--Wave Effects -->
    <script src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/waves.js"></script>
    <!--Menu sidebar -->
    <script src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/sidebarmenu.js"></script>
    <!--Custom JavaScript -->
    <script src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/custom.js"></script>
    <!-- This Page JS -->
    <script src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/jquery-jvectormap-2.js"></script>
    <script src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/jquery-jvectormap-world-mill-en.js"></script>
    <script src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/jquery-jvectormap-in-mill.js"></script>
    <script src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/jquery-jvectormap-us-aea-en.js"></script>
    <script src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/jquery-jvectormap-uk-mill-en.js"></script>
    <script src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/jquery-jvectormap-au-mill.js"></script>
    <script src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/chartist.js"></script>
    <script src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/chartist-plugin-tooltip.js"></script>
    <script src="../Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/dashboard3.js"></script>

    <script src="https://kit.fontawesome.com/614bbff60b.js" crossorigin="anonymous"></script>

    <script type="text/javascript" src="../js/jquery-3.4.1.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/froala-editor@latest/js/froala_editor.pkgd.min.js"></script>
    <script type="text/javascript" src="https://raw.githack.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.js"></script>

    <script>
        
        
        new FroalaEditor('textarea#description', {
            theme: 'dark',
            zIndex: 2003,
            toolbarSticky: false
        })
    </script>
<div class="jvectormap-tip" style="display: none; left: 624px; top: 709.5px;">Georgia</div></body></html>