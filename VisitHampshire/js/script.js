var webserverURL = "//localhost:8005";
//var webserverURL = "//192.168.0.200:8005";
$("Document").ready(function(){
	//INIT FOR SITE JS
	$(".reviewBtn").on("click", this, Addreview);

	//Set Up Dialog
	$( "#dialog-form" ).dialog({
	  autoOpen: false,
	  modal: true,
	  buttons:
	  { 'OK' : reviewSubmit,
	  'Cancel' : reviewCanceled}
	});
});

function Addreview(e){
	var poiID = e.target.id.substring(4);
	$('#addreviewform > #id').val(poiID);
	$('#dialog-form').dialog("open");
}

function reviewSubmit(e){
	var poireview = $('#addreviewform > #review').val();
	var poiID = $('#addreviewform > #id').val();

	if (!poireview){
	$('#addreviewform > #review').addClass("error");
	alert("Review is required");
	return;
	}

	$("#addreviewform").submit();
	$('#dialog-form').dialog("close");
	$('#addreviewform > #review').empty();
	$('#addreviewform > #id').empty();
}

function reviewCanceled(e){
	e.preventDefault();
	console.log("Cancel was Clicked");
	 $('#dialog-form').dialog("close");
	$('#addreviewform > #review').empty();
	$('#addreviewform > #id').empty();
}
