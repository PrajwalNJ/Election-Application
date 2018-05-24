$('.alert').hide();

var alertSymbol = '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>';

$("[data-hide]").click(function(){
    $(this).closest("." + $(this).attr("data-hide")).hide();
});

$(window).on('load',function(){
    updateCandidates();
});


function changePassword(){
    var cur_pword = $('#cur-password').val(), new_pword = $('#new-password').val(), new_conf_pword = $('#conf-new-password').val();

    if(cur_pword === "" || new_pword === "" || new_conf_pword === "" || (new_pword !== new_conf_pword) || cur_pword === new_pword) {
        if(cur_pword === "" || new_pword === "" || new_conf_pword === "")
            var alertDisplay = alertSymbol + "Please Enter All Fields!";
        else if(new_pword !== new_conf_pword)
            var alertDisplay = alertSymbol + "New password and confirm password do not match!";
        else if(cur_pword === new_pword)
            var alertDisplay = alertSymbol + "New password and Current password are the Same!";
        $('#password-modal-alert dummy').html(alertDisplay);
        $('#password-modal-alert').show();
        $('#password-modal-alert-success').hide();
    }
    else {
        $('#password-modal-alert').hide();
        $('#changing').css('display','block');

        $.ajax({
            url: "login.php",
            type: "POST",
            data: {task: "changePword", cur_pword: cur_pword, new_pword: new_pword, new_conf_pword: new_conf_pword},
            success: function (response) {
                $('#changing').css('display','none');
                if(response === "Done"){
                    $('#cur-password').val('');
                    $('#new-password').val('');
                    $('#conf-new-password').val('');
                    $('#password-modal-alert-success').show();
                    $("#password-modal-alert-success").fadeTo(2000, 500).slideUp(500);
                }
                else {
                    if(response === "Incorrect Current Password!")
                        $('#password-modal-alert dummy').html(alertSymbol + response);
                    else
                        $('#password-modal-alert dummy').html(alertSymbol + "Failed to change password!");
                    $('#password-modal-alert').show();
                    $('#password-modal-alert-success').hide();
                }
            }
        });
    }
}



document.getElementById('candidate_pic').onchange = function () {
    document.getElementById('image-text').value=this.value;
};

function add(){
	var type = document.getElementById('election-type').value, name = document.getElementById('candidate-name').value;
	var formData = new FormData(addCandidateForm);
	formData.append('type',type);
	formData.append('name',name);
	formData.append('task',"add");
	
	if(name !== "" && type !== "Select Election Type") {
		$('#candidate-add-modal-alert').hide();
		$('#adding').css('display','block');
		
		$.ajax({
			url: "candidates.php",
			type: "POST",
			data: formData,
			contentType: false,
			cache: false,
			processData:false,
			success: function (response) {
				$('#adding').css('display','none');				
				if(response === "Done"){
					$('#candidate-add-modal-alert-success').show();
					$("#candidate-add-modal-alert-success").fadeTo(2000, 500).slideUp(500);
					updateCandidates();
				}
				else{
					if(response === "Error Occured" || response === "Image not found !")
						$('#candidate-add-modal-alert dummy').html(alertSymbol + response);
					else
						$('#candidate-add-modal-alert dummy').html(alertSymbol + "Failed to add. Please check all entries or try again later.");
					$('#candidate-add-modal-alert').show();
					$('#candidate-add-modal-alert-success').hide();
				}
			}
		});
	}
	else {
		var alertDisplay="";
        if (type === "Select Election Type")
            alertDisplay = alertDisplay + alertSymbol + "  Select Election Type !!  <br> ";
        if(name === "")
            alertDisplay = alertDisplay + alertSymbol + "  Enter Candidate Name !!  <br> ";
        $('#candidate-add-modal-alert dummy').html(alertDisplay);
        $('#candidate-add-modal-alert').show();
        $('#candidate-add-modal-alert-success').hide();
	}	
}



function updateCandidates() {
	$.ajax({
		type: "POST",
		url: "candidates.php",
		dataType: "JSON",
		data: {task: "getCandidates"},
		success: function (response) {
			var i;
            $('#candidate-select').html("<option disabled selected>Select Candidate</option>");
			for (i=0; i<response.length; i++)
				$('#candidate-select').html($('#candidate-select').html()+"<option>"+response[i]+"</option>");
            $('.selectpicker').selectpicker('refresh');
        }
	});
}

function remove(){
    var pword = document.getElementById('candidate-remove-password').value, candidate = document.getElementById('candidate-select').value;

    if(pword !== "" && candidate !== "Select Candidate") {
        $('#candidate-remove-modal-alert').hide();
        $('#removing').css('display','block');

        $.ajax({
            type: "POST",
            url: "candidates.php",
            data: {pword: pword, candidate: candidate,task: "remove"},
            success: function (response) {
                $('#removing').css('display','none');
                if(response === "Done"){
                    $('#candidate-remove-modal-alert-success').show();
                    updateCandidates();
                    $("#candidate-remove-modal-alert-success").fadeTo(2000, 500).slideUp(500);
                }
                else if(response === "Image was not found. Done"){
                    $('#candidate-remove-modal-alert dummy').html(alertSymbol + "Image was not found.");
                    $('#candidate-remove-modal-alert').show();
                    $("#candidate-remove-modal-alert").fadeTo(2000, 500).slideUp(500);
                    $('#candidate-remove-modal-alert-success').show();
                    $("#candidate-remove-modal-alert-success").fadeTo(2000, 500).slideUp(500);
                }
                else{
                    if(response === "Incorrect password!")
                        $('#candidate-remove-modal-alert dummy').html(alertSymbol + response);
                    else
                        $('#candidate-remove-remove-alert dummy').html(alertSymbol + "Failed to remove. Please check all entries or try again later.");
                    $('#candidate-remove-modal-alert').show();
                    $('#candidate-remove-modal-alert-success').hide();
                }
            }
        });
    }
    else {
        var alertDisplay="";
        if(pword === "")
            alertDisplay = alertDisplay + alertSymbol + "  Enter Password !!  <br> ";
        if(candidate === "Select Candidate")
            alertDisplay = alertDisplay + alertSymbol + "  Select Candidate !!  <br> ";
        $('#candidate-remove-modal-alert dummy').html(alertDisplay);
        $('#candidate-remove-modal-alert').show();
        $('#candidate-remove-modal-alert-success').hide();
    }
}



$('#class-update').change(function(){ $('#sections-modal-alert-success').hide(); });
$('#section-update').change(function(){ $('#sections-modal-alert-success').hide(); });

function updateSections() {
    var cls=document.getElementById('class-update').value, sec=document.getElementById('section-update').value;
    if(cls!=="Select Class" && sec!=="Select Section"){
        $('#sections-modal-alert').hide();
        $.ajax({
            type: "POST",
            url: "class_details.php",            
            data: {class: cls, sections: sec, task: "updateSections"},
            success: function (response) {
                if(response==="Done")
                    $('#sections-modal-alert-success').show();

                else if(response==="Failed"){
                    $('#sections-modal-alert dummy').html(alertSymbol + "Failed to update.");
                    $('#sections-modal-alert').show();
                    $('#sections-modal-alert-success').hide();
                }
            }
        });
    }
    else{
        $('#sections-modal-alert dummy').html(alertSymbol + "Select both 'Class' and 'Section'");
        $('#sections-modal-alert').show();
        $('#sections-modal-alert-success').hide();
    }
}



function reset() {
    $.ajax({
        type: "POST",
        url: "reset.php",
        success: function (response) {
            if(response === "Done"){
                alert('The database is reset.');
                $('#reset-modal').modal('hide');
            }
        }
    });
}