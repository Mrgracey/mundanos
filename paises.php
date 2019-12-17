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
    <link rel="icon" type="image/png" sizes="16x16" href="wp_template/cropped-mundo3-1.png">
    <title>MUNDANOS - Admin Dashboard</title>
    <!-- This Page CSS -->
    <link href="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/chartist.css" rel="stylesheet">
    <link href="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/chartist-plugin-tooltip.css" rel="stylesheet">
    <link href="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/jvector.css" rel="stylesheet">
    <link href="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/jquery-jvectormap-2.css" rel="stylesheet">
    <!-- needed css -->
    <link href="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/style.css" rel="stylesheet">
    <script src="js/sorttable.js"></script>
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
</style>
</head>

<body data-theme="dark">
    <?php
        
        include("conexion.php");
        include("seguridad.php");
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
                    <a class="navbar-brand" href="mundanos.php">
                        <!-- Logo icon -->
                        <b class="logo-icon">
                            <!--You can put here icon as well // <i class="wi wi-sunset"></i> //-->
                            <!-- Dark Logo icon -->
                            <img src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/logo-icon.png" alt="homepage" class="dark-logo">
                            <!-- Light Logo icon -->
                            <img src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/logo-light-icon.png" alt="homepage" class="light-logo">
                        </b>
                        <!--End Logo icon -->
                        <!-- Logo text -->
                        <span class="logo-text">
                             <!-- dark Logo text -->
                             <img src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/logo-text.png" alt="homepage" class="dark-logo">
                             <!-- Light Logo text -->    
                             <img src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/logo-light-text.png" class="light-logo" alt="homepage">
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
                <!-- ============================================================== -->
                <!-- End Logo -->
                <!-- ============================================================== -->
                <div class="navbar-collapse collapse" id="navbarSupportedContent" data-navbarbg="skin6">
                    <!-- ============================================================== -->
                    <!-- toggle and nav items -->
                    <!-- ============================================================== -->
                    <ul class="navbar-nav float-left mr-auto">
                        <li class="nav-item d-none d-md-block"><a class="nav-link sidebartoggler waves-effect waves-light" href="javascript:void(0)" data-sidebartype="mini-sidebar"><i class="fa fa-bars"></i></a></li>
                       
                        
                    </ul>
                    <!-- ============================================================== -->
                    <!-- Right side toggle and nav items -->
                    <!-- ============================================================== -->
                </div>
            </nav>
        </header>
        <!-- ============================================================== -->
        <!-- End Topbar header -->
        <!-- ============================================================== -->
        <!-- ============================================================== -->
        <!-- Left Sidebar - style you can find in sidebar.scss  -->
        <!-- ============================================================== -->
        <aside class="left-sidebar" data-sidebarbg="skin5">
            <!-- Sidebar scroll-->
            <div class="scroll-sidebar ps-container ps-theme-default ps-active-y" data-ps-id="93307cc5-70b0-7de7-8c7f-51ecda3ac404">
                <!-- Sidebar navigation-->
                <nav class="sidebar-nav">
                    <ul id="sidebarnav" class="in">
                        <li class="sidebar-item selected">
                            <a class="sidebar-link has-arrow waves-effect waves-dark active" href="dashboard.php" aria-expanded="false">
                                <i style="font-size: 2vh; margin-left: .5vh;" class="fa fa-chart-line"></i>
                                <span class="hide-menu">Dashboard</span> 
                                <?php
                                    if ($num_comments>0) {
                                        echo '<span class="badge badge-inverse badge-pill ml-auto mr-3 font-medium px-2 py-1">'.$num_comments.'</span>';
                                    }
                                ?>
                            </a>
                            <ul aria-expanded="false" class="collapse first-level in">
                                <li class="sidebar-item active">
                                    <a href="paises.php" class="sidebar-link  active">
                                        <i style="font-size: 2vh; margin-left: .5vh;" class="fa fa-flag"></i>
                                        <span class="hide-menu">&nbsp Paises </span>
                                    </a>
                                </li>
                                <li class="sidebar-item">
                                    <a href="dashboard.php" class="sidebar-link">
                                        <i style="font-size: 2vh; margin-left: .5vh;" class="fa fa-users"></i>
                                        <span class="hide-menu">&nbsp Users </span>
                                    </a>
                                </li>
                                <li class="sidebar-item">
                                    <a href="publicaciones.php" class="sidebar-link">
                                        <i style="font-size: 2vh; margin-left: .5vh;" class="fa fa-file"></i>
                                        <span class="hide-menu">&nbsp Publicaciones </span>
                                    </a>
                                </li>
                                <li class="sidebar-item">
                                    <a href="comentarios.php" class="sidebar-link">
                                        <i style="font-size: 2vh; margin-left: .5vh;" class="fa fa-comment-dots"></i>
                                        <span class="hide-menu">&nbsp Comentarios </span>
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
                  <!--  -->
                </nav>  
                <!-- End Sidebar navigation -->
            <div class="ps-scrollbar-x-rail" style="left: 0px; bottom: 0px;"><div class="ps-scrollbar-x" tabindex="0" style="left: 0px; width: 0px;"></div></div><div class="ps-scrollbar-y-rail" style="top: 0px; height: 0px; right: 3px;"><div class="ps-scrollbar-y" tabindex="0" style="top: 0px; height: 0px;"></div></div></div>
            <!-- End Sidebar scroll-->
        </aside>
        <!-- ============================================================== -->
        <!-- End Left Sidebar - style you can find in sidebar.scss  -->
        <!-- ============================================================== -->
        <!-- ============================================================== -->
        <!-- Page wrapper  -->
        <!-- ============================================================== -->
        <div class="page-wrapper" style="display: block;">
            <!-- ============================================================== -->
            <!-- Bread crumb and right sidebar toggle -->
            <!-- ============================================================== -->
            
            <!-- ============================================================== -->
            <!-- End Bread crumb and right sidebar toggle -->
            <!-- ============================================================== -->
            <!-- ============================================================== -->
            <!-- Container fluid  -->
            <!-- ============================================================== -->
            <div class="page-content container-fluid">
                <!-- ============================================================== -->
                <!-- First Cards Row  -->
                <!-- ============================================================== -->
                
                <!-- ============================================================== -->
                <!-- Table Row  -->
                <!-- ============================================================== -->
                <div class="row">
                    <div class="col-md-12">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title text-uppercase mb-0">Manage Users</h5>
                            </div>
                            <div class="table-responsive">
                                    <table id="table" class="table no-wrap user-table mb-0 sortable">
                                    <thead>
                                        <tr>
                                        <th scope="col" class="border-0 text-uppercase font-medium pl-4">#</th>
                                        <th scope="col" class="border-0 text-uppercase font-medium">Codigo</th>
                                        <th scope="col" class="border-0 text-uppercase font-medium">Nombre</th>
                                        <th scope="col" class="border-0 text-uppercase font-medium">Portada</th>
                                        <th scope="col" class="border-0 text-uppercase font-medium"><a href="paises.php" style="color: #525f7f;">Activo</a></th>
                                        <th scope="col" class="border-0 text-uppercase font-medium">Opciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                        <?php
                                        $tam=20;
                                        if(isset($_GET['pag'])){
                                            $pag=$_GET['pag'];
                                        }else{
                                            $pag=1;
                                        }
                                        $ini=$pag-1;
                                        $cuenta=$ini*$tam;
                                        // include("seguridad.php");
                                        $result=mysqli_query($con, "SELECT * FROM country");
                                        $num_rows=mysqli_num_rows($result);
                                        $query = mysqli_query($con, "SELECT * FROM country ORDER BY tf_active DESC LIMIT $cuenta, $tam");
                                        $query_paises=mysqli_query($con,"SELECT id_country, url FROM media");
                                        $tope=floor($num_rows/$tam)+1;
                                        while( $row=mysqli_fetch_array($query_paises)){
                                            $id1=$row['id_country'];
                                            $A_url[$id1]=$row['url'];
                                        }
                                        while( $A_row=mysqli_fetch_array($query)){
                                        echo '<tr>
                                                <td class="pl-4">'.utf8_encode($A_row['id']).'</td>
                                            <td>
                                                <h5 class="font-medium mb-0">'. $A_row['iso'].'</h5>
                                            </td>
                                            <td>
                                                <span class="text-muted">'.utf8_encode($A_row['name']).'</span>
                                            </td>
                                            <form action="CRUDcountries/update_country.php?id='.$A_row['id'].'" method="post" enctype="multipart/form-data">
                                            <td>';
                                            if (isset($A_url[$A_row['id']])) {
                                                echo '<input type="file" name="fileToUpload" id="fileToUpload">';
                                            }else{
                                                echo '<input type="file" placeholder="No hay archive" name="fileToUpload" id="fileToUpload">';
                                            }
                                            echo '</td>
                                            <td>
                                                <label class="switch">';
                                                    if ($A_row['tf_active']==1) {
                                                        echo   '<input type="checkbox" name="tf_active" value="1" checked>';
                                                    }else{
                                                        echo   '<input type="checkbox" name="tf_active" value="0" >';
                                                    }
                                                    echo     '<span class="slider round"></span>
                                                </label>
                                            </td>
                                            <td>
                                                <button type="submit" name="submit" class="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"><i class="fa fa-check"></i></button>
                                            </td>
                                            </form>
                                        </tr>';
                                    }
                                        
                                    ?>
                                    </tbody>
                                </table>
                            <div style="padding: 1vh 52vh; margin: auto; display: flex; flex-wrap: wrap;">
                                
                                <?php
                                for ($i=1; $i <= $tope; $i++) {
                                        echo '
                                        <div style="margin: 0 1vh 0 1vh;">
                                            <a href="paises.php?pag='.$i.'">
                                            <button type="button" class="btn btn-block btn-outline-light">'.$i.'</button>
                                            </a>
                                        </div>
                                        ';
                                    }
                                ?>
                                
                            </div>
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
    <script src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/jquery.js"></script>
    <!-- Bootstrap tether Core JavaScript -->
    <script src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/popper.js"></script>
    <script src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/bootstrap.js"></script>
    <!-- apps -->
    <script src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/app_002.js"></script>
    <script src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/app.js"></script>
    <script src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/app-style-switcher.js"></script>
    <!-- slimscrollbar scrollbar JavaScript -->
    <script src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/perfect-scrollbar.js"></script>
    <script src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/sparkline.js"></script>
    <!--Wave Effects -->
    <script src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/waves.js"></script>
    <!--Menu sidebar -->
    <script src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/sidebarmenu.js"></script>
    <!--Custom JavaScript -->
    <script src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/custom.js"></script>
    <!-- This Page JS -->
    <script src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/jquery-jvectormap-2.js"></script>
    <script src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/jquery-jvectormap-world-mill-en.js"></script>
    <script src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/jquery-jvectormap-in-mill.js"></script>
    <script src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/jquery-jvectormap-us-aea-en.js"></script>
    <script src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/jquery-jvectormap-uk-mill-en.js"></script>
    <script src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/jquery-jvectormap-au-mill.js"></script>
    <script src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/chartist.js"></script>
    <script src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/chartist-plugin-tooltip.js"></script>
    <script src="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/dashboard3.js"></script>

    <script src="fa/js/all.js" crossorigin="anonymous"></script>

<div class="jvectormap-tip" style="display: none; left: 624px; top: 709.5px;">Georgia</div></body></html>