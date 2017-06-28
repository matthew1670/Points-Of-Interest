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
<?php 
	$connection = curl_init();
 curl_setopt($connection, CURLOPT_URL, "193.63.200.53:8005/review");
  // This option ensures that the HTTP response is *returned* from curl_exec(),
  // (see below) rather than being output to screen.
  curl_setopt($connection,CURLOPT_RETURNTRANSFER,1);
  // Do not include the HTTP header in the response.
  curl_setopt($connection,CURLOPT_HEADER, 0);
  $postdata =  "id=".$_POST["id"]."&review=" . $_POST["review"];
  curl_setopt($connection, CURLOPT_POSTFIELDS, $postdata);
  // Actually connect to the remote URL. The response is
  // returned from curl_exec() and placed in $response.
  $response = curl_exec($connection);
  $httpCode = curl_getinfo($connection,CURLINFO_HTTP_CODE);
  // Close the connection.
  curl_close($connection);
//Decode the returned json.
  $data = json_decode($response);
  
switch ($httpCode){
	case 201:
		echo "<p>Your Review has been added</p>";
		break;
	case 400:
		echo "<p>There was something wrong with your request please try again</p>";
		break;
	default:
		echo "<p>An Unknown error has occured</p>";
		break;
}
?>

</div>
</div>
</div>
 <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <script  src="http://code.jquery.com/ui/1.12.0/jquery-ui.js" integrity="sha256-0YPKAwZP7Mp3ALMRVB2i8GXeEndvCq3eSl/WsAl1Ryk=" crossorigin="anonymous"></script>
    <script src="js/script.js" charset="utf-8"></script>
  </body>
</html>