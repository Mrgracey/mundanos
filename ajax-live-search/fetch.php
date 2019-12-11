<?php
include("../conexion.php");
$output = '';
if(isset($_POST["query"]))
{
	$search = mysqli_real_escape_string($con, $_POST["query"]);
	$query = "
	SELECT * FROM country
	WHERE name LIKE '%".$search."%'";
}

$result = mysqli_query($con, $query);
if(mysqli_num_rows($result) > 0)
{
	$output .= '<table class="table no-wrap user-table mb-0 sortable">
					<thead>
						<tr>
							<th scope="col" class="border-0 text-uppercase font-medium pl-4">#</th>
							<th scope="col" class="border-0 text-uppercase font-medium">Codigo</th>
							<th scope="col" class="border-0 text-uppercase font-medium">Nombre</th>
							<th scope="col" class="border-0 text-uppercase font-medium">Portada</th>
							<th scope="col" class="border-0 text-uppercase font-medium">Activo</th>
							<th scope="col" class="border-0 text-uppercase font-medium">Opciones</th>
						</tr>
					</thead>';
	while($A_row = mysqli_fetch_array($result))
	{
		$output .= '<tr>
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
							echo '<input type="file" placeholder="'.$A_url[$A_row['id']].'" name="fileToUpload" id="fileToUpload">';
						}else{
							echo '<input type="file" placeholder="No hay archive" name="fileToUpload" id="fileToUpload">';
						}
						echo '</td>
						<td>
						<label class="switch">';        
							if ($A_row['tf_active']==1) {
								echo   '<input type="checkbox" name="tf_active" value="1" checked>';
							}else{
								echo   '<input type="checkbox" name="tf_active" value="1" >';
							}
							echo     '<span class="slider round"></span>
							</label>
						</td>
						<td>
							<button type="submit" name="submit" class="btn btn-outline-info btn-circle btn-lg btn-circle ml-2"><i class="fa fa-check"></i> </button>
						</td>
						</form>
					</tr>';
	}
	echo $output;
}
else
{
	echo 'Data Not Found';
}
?>