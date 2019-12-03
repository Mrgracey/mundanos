<!DOCTYPE html>
<html>
<head>
<style>
.grid-container {
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 10px;
  background-color: #2196F3;
  padding: 10px;
}

.grid-container > div {
  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
  padding: 20px 0;
  font-size: 30px;
}

.item1 {
  grid-row-start: 1;
  grid-row-end: 2;
}
</style>
</head>
<body>

<h1>Grid Lines</h1>

<div class="grid-container">
<?php
for($i=1; $i<7; $i++){
	echo '<div class="item'.$i.'">'.$i.'</div>';
}
?>
  
</div>

<p>You can refer to line numbers when placing grid items.</p>

</body>
</html>
