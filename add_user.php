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
    <link rel="icon" type="image/png" sizes="16x16" href="https://ampleadmin.wrappixel.com/assets/images/favicon.png">
    <title>Ample admin Template - The Ultimate Multipurpose admin template</title>
	<link rel="canonical" href="https://www.wrappixel.com/templates/ampleadmin/">
    <!-- This Page CSS -->
    <link href="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/chartist.css" rel="stylesheet">
    <link href="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/chartist-plugin-tooltip.css" rel="stylesheet">
    <link href="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/jvector.css" rel="stylesheet">
    <link href="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/jquery-jvectormap-2.css" rel="stylesheet">
    <!-- needed css -->
    <link href="Ample%20admin%20Template%20-%20The%20Ultimate%20Multipurpose%20admin%20template_archivos/style.css" rel="stylesheet">
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
</style>
</head>

<body data-theme="dark">
    
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
                    <a class="navbar-brand" href="index.html">
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
                            <a class="sidebar-link has-arrow waves-effect waves-dark active" href="javascript:void(0)" aria-expanded="false">
                                <i class="fa fa-chart-line"></i>
                                <span class="hide-menu">Dashboard</span> 
                                
                            </a>
                            <ul aria-expanded="false" class="collapse first-level in">
                                <li class="sidebar-item">
                                    <a href="index.html" class="sidebar-link">
                                        <i class="fa fa-flag"></i>
                                        <span class="hide-menu"> Paises </span>
                                    </a>
                                </li>
                                <li class="sidebar-item active">
                                    <a href="dashboard.php" class="sidebar-link active">
                                        <i class="fa fa-users"></i>
                                        <span class="hide-menu"> Users </span>
                                    </a>
                                </li>
                                <li class="sidebar-item">
                                    <a href="index3.html" class="sidebar-link">
                                        <i class="fa fa-file"></i>
                                        <span class="hide-menu"> Publicaciones </span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        
                    </ul>  
                  
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
                                <h5 class="card-title text-uppercase mb-0">Agregar usuario</h5>
                            </div>
                            <div class="table-responsive">
                                <table class="table no-wrap user-table mb-0">
                                  <thead>
                                    <tr>
                                        <th scope="col" class="border-0 text-uppercase font-medium pl-4"></th>
                                        <th scope="col" class="border-0 text-uppercase font-medium">Usuario</th>
                                        <th scope="col" class="border-0 text-uppercase font-medium">Contraseña</th>
                                        <th scope="col" class="border-0 text-uppercase font-medium">Email</th>
                                        <th scope="col" class="border-0 text-uppercase font-medium">Tipo</th>
                                        <th scope="col" class="border-0 text-uppercase font-medium">Opciones</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <form action="add.php" method="post">
                                        <tr>
                                        <td class="pl-4"></td>   
                                        <td>
                                            <label for="inp" class="inp">
                                                <input type="text" value="" name="user" id="inp" placeholder="Nombre de usuario">
                                                <span class="label"></span>
                                                <span class="border"></span>
                                            </label>
                                            
                                        </td>
                                        <td>
                                            <label for="inp" class="inp">
                                                <input type="text" value="" name="password" id="inp" placeholder="Contraseña">
                                                <span class="label"></span>
                                                <span class="border"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <label for="inp" class="inp">
                                                <input type="text" value="" name="email" id="inp" placeholder="ejemplo@mail.com">
                                                <span class="label"></span>
                                                <span class="border"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <select name="type" class="form-control category-select" id="exampleFormControlSelect1">
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td>  
                                             <button type="submit" class="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"><i class="fa fa-check"></i> </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                                
                    
                   
                       
                        
                    
                
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

    <script src="https://kit.fontawesome.com/614bbff60b.js" crossorigin="anonymous"></script>

    <script>
      $(function() {
        $('#usa').vectorMap({
          map : 'world_millx',
          backgroundColor : 'transparent',
          zoomOnScroll: false,
          regionStyle : {
              initial : {
                  fill : '#2cabe3'
              }
          }
        });
      });
    </script>
<div class="jvectormap-tip" style="display: none; left: 624px; top: 709.5px;">Georgia</div></body></html>