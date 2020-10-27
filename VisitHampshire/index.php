<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="Second Site For Assingment AE2">
    <meta name="author" content="Matthew Wood">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Vist Hampshire</title>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="http://code.jquery.com/ui/1.11.4/themes/black-tie/jquery-ui.css">
    <link rel="stylesheet" href="css/main.css">
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.2/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
<div class="container-fluid">
  <div class="row" id="Header">
    <div class="col-xs-12">
      <h1>Vist Hampshire</h1>
    </div>
  <div class="col-xs-12">
    <p>Welcome To Vist Hampshire a website dedicated to torist infomation for the good old county of Hampshire</p>
  </div>
</div>
<div class="row">
  <div class="col-xs-12">
    <p>What Type of POI do you want to view ?</p>
<form class="" action="index.php" method="post">
  <select name="type" id="Search-Type">
    <option value="">Any Type</option>
    <option value="pub">Pub</option>
    <option value="restaurant">Restaurant</option>
    <option value="city">City</option>
    <option value="town">Town</option>
  </select>
<button type="submit" name="button" id="searchPOI">Search</button>
</form>
  </div>
</div>
<div class="row equal-height" id="results">
<!-- CURL request to show hampshire POI's depending on users selected info -->
<!-- if Any type is sellected and when on load all POI's are shown regardless of type -->
<?php
if ($_POST && $_POST["type"]){
  $type = $_POST["type"];
    echo "<div class='col-xs-12'><p>Currently Showing All Hampshire $type's</p></div>";
}else{
  $type = "";
  echo "<div class='col-xs-12'><p>Currently Showing All Hampshire POI's</p></div>";
}
  // Initialise the cURL connection
  $connection = curl_init();
  // Specify the URL to connect to
  curl_setopt($connection, CURLOPT_URL, "localhost:8005/search?region=Hampshire&type=$type");
  // This option ensures that the HTTP response is *returned* from curl_exec(),
  // (see below) rather than being output to screen.
  curl_setopt($connection,CURLOPT_RETURNTRANSFER,1);
  // Do not include the HTTP header in the response.
  curl_setopt($connection,CURLOPT_HEADER, 0);
  // Actually connect to the remote URL. The response is
  // returned from curl_exec() and placed in $response.
  $response = curl_exec($connection);
  $httpCode = curl_getinfo($connection,CURLINFO_HTTP_CODE);
  // Close the connection.
  curl_close($connection);
//Decode the returned json.
  $data = json_decode($response);
//Output the Json in a user friendly way.
if ($httpCode == 200){
  for ($i = 0; $i < count($data); $i++){
      echo "<div class='col-xs-12 col-sm-4 col-md-3 POI'>";
      echo "<p><strong>name: </strong>" . $data[$i]->name . "</br>";
      echo "<strong>type: </strong>" . $data[$i]->type . "</br>";
      echo "<strong>LatLan: </strong>" . $data[$i]->lat . " / " . $data[$i]->lon . "</br>";
      echo "<strong>Desc: </strong>" . $data[$i]->description  . "</br>";
      echo "<button class='reviewBtn' id='btn_" . $data[$i]->_id ."'> review this place</button>";
      echo "</p>";
      echo "</div>";
  }
}

else if ($httpCode == 204){
  echo "<div class='col-xs-12'><p>There are no POI's Maching your request im sooooo sorry :(</p></div>";
}

else if ($httpCode == 400){
  echo "<div class='col-xs-12'><p>There Was a Error With your Request</p></div>";
}

?>
</div>
</div>

<!--  -->
<div id="dialog-form" title="Add a Review">
<p class="validateTips">All form fields are required.</p>
<form id="addreviewform" action="addreview.php" method="POST">
  <input type="text" name="id" id="id" readonly disabled>
  <label for="review">review</label>
  <textarea name="review" rows="8" cols="10" id="review"></textarea>
</form>
</div>
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <script  src="http://code.jquery.com/ui/1.12.0/jquery-ui.js" integrity="sha256-0YPKAwZP7Mp3ALMRVB2i8GXeEndvCq3eSl/WsAl1Ryk=" crossorigin="anonymous"></script>
    <script src="js/script.js" charset="utf-8"></script>
  </body>
</html>
