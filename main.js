$('.alert').hide();

$('#cast-vote-alert').css('margin-left',-$('#cast-vote-alert').outerWidth(true)*.5+'px');
$('#cast-vote-alert-success').css('margin-left',-$('#cast-vote-alert-success').outerWidth(true)*.5+'px');


var alertSymbol = '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>';
var timer, currentRollNo, currentClass, currentSection, currentHouse, candidatesVoted = {}, candidateNo;


$("[data-hide]").click(function(){
    $(this).closest("." + $(this).attr("data-hide")).hide();
});

$("#sidebar_button").click(function(e){	
    e.preventDefault();
    $("#wrapper").toggleClass("active");
    $("#sidebar_button a").toggleClass("active");
});



$(window).on('load',function(){
    prepareCandidatesDisplay();
    checkCandidateNo();
});


function checkCandidateNo() {
    $.ajax({
        type: "POST",
        url: "candidates.php",
        data: {task: "checkNo"},
        success: function (response) {
            candidateNo = response;
        }
    });
}


$('#class').change(function () {
    $.ajax({
        type: "POST",
        url: "class_details.php",
        data: {class: document.getElementById('class').value, task: "getSections"},
        success: function (response) {
			$('#section').html("<option disabled selected>Select Section</option>");
            if(response > 1)
                for(var i=65; i<(65+parseInt(response)); i++)
					$('#section').html($('#section').html()+"<option>"+String.fromCharCode(i)+"</option>");
            else
				$('#section').html("<option>None</option>");
			$('.selectpicker').selectpicker('refresh');
        }
    });
});



function prepareCandidatesDisplay(){
    var displayHtml="";

    $.ajax({
        type: "POST",
        url: "castVote.php",
        dataType: "JSON",
        data: {task: "getCandidateDetails"},
        success: function (response) {
            for(var i=0; i<response.length; i++){
                if(response[i]['captain'].length > 0 || response[i]['vice-captain'].length > 0){
                    displayHtml = displayHtml +
                        '<div id="' +response[i]['house']+ '" class="election-type">' +
                            '<img src="images/' +response[i]['house']+ '.PNG" class="img-circle medium-image"/>' +
                            '<div class="candidates">' +
                                '<div class="captains">' +
                                    '<h2><em>Captains</em></h2>';
                    for(var j=0; j<response[i]['captain'].length; j++){
                        var radioName1 = response[i]['house'] + '_captain';
                        displayHtml = displayHtml+
                                    '<div>' +
                                        '<input type="radio" name="'+radioName1+'" value="'+response[i]['captain'][j]['id']+'">' +
                                        '<img src="'+response[i]['captain'][j]['img_src']+'" style="cursor: pointer" class="img-circle small-image" onclick="checkRadioButton(\''+radioName1+'\','+j+')">' +
                                        '<div class="candidate_name">'+response[i]['captain'][j]['name']+'</div>' +
                                    '</div>';
                    }
                    displayHtml = displayHtml +
                                '</div>' +
                                '<div class="vice-captains">' +
                                    '<h2><em>Vice Captains</em></h2>';
                    for(var j=0; j<response[i]['vice-captain'].length; j++){
                        var radioName2 = response[i]['house'] + '_vice_captain';
                        displayHtml = displayHtml+
                                    '<div>' +
                                        '<input type="radio" name="'+radioName2+'" value="'+response[i]['vice-captain'][j]['id']+'">' +
                                        '<img src="'+response[i]['vice-captain'][j]['img_src']+'" style="cursor: pointer" class="img-circle small-image" onclick="checkRadioButton(\''+radioName2+'\','+j+')">' +
                                        '<div class="candidate_name">'+response[i]['vice-captain'][j]['name']+'</div>' +
                                    '</div>';
                    }
                    displayHtml = displayHtml +
                                '</div>' +
                            '</div>' +
                        '</div>' ;
                }
            }
            $('#displayCandidates').html(displayHtml);
        }
    });
}

function checkRadioButton(name,index) {
    var radioBtn = document.getElementsByName(name)[index];
    radioBtn.checked=true;
    if(name === 'School_captain')
        candidatesVoted['school_cap'] = radioBtn.value;
    if(name === 'School_vice_captain')
        candidatesVoted['school_vcap'] = radioBtn.value;
    if(name === (currentHouse + '_captain'))
        candidatesVoted['house_cap'] = radioBtn.value;
    if(name === (currentHouse + '_vice_captain'))
        candidatesVoted['house_vcap'] = radioBtn.value;
}



function login() {
    var username = document.getElementsByName('username')[0].value, pword = document.getElementsByName('password')[0].value;

    if(username !== "" && pword !== ""){
        $('#admin-login-modal-alert').hide();

        $.ajax({
            type: "POST",
            url: "login.php",
            data: {task: "login", username: username, pword: pword},
            success: function (response) {
                if(response === "Done"){
                    $('#admin-login-modal').modal('hide');
                    location.href = "admin.html";
                }
                else{
                    $('#admin-login-modal-alert dummy').html(alertSymbol + response);
                    $('#admin-login-modal-alert').show();
                }
            }
        });
    }
    else{
        $('#admin-login-modal-alert dummy').html(alertSymbol + "Please Enter both 'Username' and 'Password'");
        $('#admin-login-modal-alert').show();
    }
}



$('#voting-modal-submit').click(function (){
    var rollNo = document.getElementById('roll-number').value, classSelected = document.getElementById('class').value, section = document.getElementById('section').value, house = document.getElementById('house').value;
    currentRollNo = rollNo; currentClass = classSelected; currentSection = section; currentHouse = house;
    var alertDisplay = "";
    
    if(isNaN(rollNo) || (rollNo.indexOf('.') !== -1) || (rollNo < 1) || (rollNo > 50))
        alertDisplay = alertDisplay + alertSymbol + "Invalid 'Roll Number' <br>";
    if(classSelected === "Select Class")
        alertDisplay = alertDisplay + alertSymbol + "Select 'Class'!! <br>";
    if(section === "Select Section")
        alertDisplay = alertDisplay + alertSymbol + "Select 'Section'!! <br>";
    if(house === "Select House")
        alertDisplay = alertDisplay + alertSymbol + "Select 'House'!! <br>";
	if(candidateNo === "0")
        alertDisplay = alertSymbol + "There are no candidates present to vote.";
    if(alertDisplay !== ""){
        $("#voting-modal-alert dummy").html(alertDisplay);
        $("#voting-modal-alert").show();
    }
    else{

        $.ajax({
            type: "POST",
            url: "voter.php",
            data: {rno: rollNo, class: classSelected, section: section, task: "checkRollNo"},
            success: function(access){
                if (access === "Denied"){
                    $("#voting-modal-alert dummy").html(alertSymbol + "You have already voted !");
                    $("#voting-modal-alert").show();
                }
                else{
					if(document.getElementById('School') === null && document.getElementById(document.getElementById('house').value) === null){
						$('#voting-modal-alert dummy').html(alertSymbol + "There are no candidates in your house for you to vote !");
						$('#voting-modal-alert').show();						
					}
					else{
						$('#voting-modal-alert').hide();
						$('#cast-vote-alert-success').hide();

						$('input:radio').each(function () {
							this.checked = false;
						});

						candidatesVoted['school_cap'] = candidatesVoted['school_vcap'] = candidatesVoted['house_cap'] = candidatesVoted['house_vcap'] = "none";

						document.getElementById('navbar-pages').style.display='none';
						document.getElementById('cast-vote').style.display='';
						document.getElementById('display-votes').style.display='none';
						clearInterval(timer);
						var election_types = document.getElementsByClassName('election-type');
						election_types[0].style.display='-webkit-box';
						for(var i=0; i<election_types.length; i++)
							election_types[i].style.display='none';
						if(document.getElementById('School') !== null)
							document.getElementById('School').style.display='-webkit-box';
						if(document.getElementById(document.getElementById('house').value) !== null)
							document.getElementById(document.getElementById('house').value).style.display='-webkit-box';					
						$('#voting-modal').modal('hide');
					}
                }
            }
        });
    }
});



$('#cast-vote_submit').click(function () {
    var i, alertDiplay = "", cap=0, vcap=0, capnames = document.getElementsByName(currentHouse + '_captain'), vcapnames = document.getElementsByName(currentHouse + '_vice_captain');

    if (!$("input[name='School_captain']:checked").val() && (document.getElementsByName('School_captain').length > 0))
        alertDiplay = alertDiplay + "<li>School Captain</li>";
    if (!$("input[name='School_vice_captain']:checked").val() && (document.getElementsByName('School_vice_captain').length > 0))
        alertDiplay = alertDiplay + "<li>School Vice Captain</li>";

    for(i=0; i<capnames.length; i++)
        if(capnames[i].checked)
            cap++;
    for(i=0; i<vcapnames.length; i++)
        if(vcapnames[i].checked)
            vcap++;
    if(cap === 0 && capnames.length > 0)
        alertDiplay = alertDiplay + "<li>House Captain</li>";
    if(vcap === 0 && vcapnames.length > 0)
        alertDiplay = alertDiplay + "<li>House Vice Captain</li>";

    if(alertDiplay === ""){
        $.ajax({
            type: "POST",
            url: "voter.php",
            data: {task: "vote", rno: currentRollNo, class: currentClass, section: currentSection, school_cap: candidatesVoted['school_cap'], school_vcap: candidatesVoted['school_vcap'], house_cap: candidatesVoted['house_cap'], house_vcap: candidatesVoted['house_vcap']},
            success: function (response) {
                if(response === "Done") {
                    $('#cast-vote-alert').hide();
                    $('#cast-vote').css('display','none');
                    $('#navbar-pages').css('display','');
                    $('#cast-vote-alert-success').show();
                }
                else {
                    $('#cast-vote-alert').html(alertSymbol + 'Failed to cast vote. Please try again later.');
                    $('#cast-vote-alert').show();
                }
            }
        });
    }
    else{
        $('#cast-vote-alert-success').hide();
        $('#cast-vote-alert ul').html(alertDiplay);
        $('#cast-vote-alert').show();
    }
});



function displayVotes() {
    var username = $('#username').val(), pword = $('#password').val();

    if(username !== "" && pword !== ""){
        $('#display-votes-modal-alert').hide();

        $.ajax({
            type: "POST",
            url: "login.php",
            data: {task: "login", username: username, pword: pword},
            success: function (response) {
                if(response === "Done"){
                    $('#cast-vote-alert-success').hide();
                    $('#navbar-pages').css('display','none');
                    $('#cast-vote').css('display','none');
                    $('#display-votes').css('display','');
                    $('#username').val('');
                    $('#password').val('');
                    timer = setInterval("$('tr.success').toggleClass('bold');", 500);
                    $('#display-votes-modal').modal('hide');
                }
                else{
                    $('#display-votes-modal-alert dummy').html(alertSymbol + response);
                    $('#display-votes-modal-alert').show();
                }
            }
        });
    }
    else{
        $('#display-votes-modal-alert dummy').html(alertSymbol + "Please Enter both 'Username' and 'Password'");
        $('#display-votes-modal-alert').show();
    }
}



function cancelDisplayVotes() {
    $('#display-votes').css('display','none');
    $('#navbar-pages').css('display','');
    clearInterval(timer);
}

function loadVotes(){
    var displayHtml="";

    $.ajax({
       type: "POST",
       url: "castVote.php",
       dataType: "JSON",
       data: {task: "getCandidateDetails", purpose: "displayVotes"},
       success: function (response) {
           for(var i=0; i<response.length; i++){
               if(response[i]['captain'].length > 0 || response[i]['vice-captain'].length > 0){
                   displayHtml = displayHtml +
                       '<h2 style="text-decoration: underline;">'+response[i]['house']+'</h2>' +
                       '<div class="row" style="margin-bottom: 30px">';
                   if(response[i]['captain'].length > 0){
                       displayHtml = displayHtml +
                           '<div class="col-md-6">' +
                               '<h3>Captain</h3>' +
                               '<table class="table table-striped table-hover table-condensed">' +
                                   '<thead style="background: lightblue">' +
                                       '<tr>' +
                                           '<th>Candidate</th>' +
                                           '<th>No. of Votes</th>' +
                                       '</tr>' +
                                   '</thead>' +
                                   '<tbody style="background: white">';
                       for(var j=0; j<response[i]['captain'].length; j++) {
                           var style;
                           if(j === 0 || response[i]['captain'][j]['votes'] === response[i]['captain'][0]['votes'])
                               style = '<tr class="success bold">';
                           else
                               style = '<tr>';
                           displayHtml = displayHtml +
                                       style +
                                           '<td>'+response[i]['captain'][j]['name']+'</td>' +
                                           '<td>'+response[i]['captain'][j]['votes']+'</td>' +
                                       '</tr>';
                       }
                       displayHtml = displayHtml +
                                   '</tbody>' +
                               '</table>' +
                           '</div>';
                   }
                   if(response[i]['vice-captain'].length > 0){
                       displayHtml = displayHtml +
                           '<div class="col-md-6">' +
                               '<h3>Vice Captain</h3>' +
                               '<table class="table table-striped table-hover table-condensed">' +
                                   '<thead style="background: lightblue">' +
                                       '<tr>' +
                                           '<th>Candidate</th>' +
                                           '<th>No. of Votes</th>' +
                                       '</tr>' +
                                   '</thead>' +
                                   '<tbody style="background: white">';
                       for(var j=0; j<response[i]['vice-captain'].length; j++) {
                           var style;
                           if(j === 0 || response[i]['vice-captain'][j]['votes'] === response[i]['vice-captain'][0]['votes'])
                               style = '<tr class="success bold">';
                           else
                               style = '<tr>';
                           displayHtml = displayHtml +
                                       style +
                                           '<td>'+response[i]['vice-captain'][j]['name']+'</td>' +
                                           '<td>'+response[i]['vice-captain'][j]['votes']+'</td>' +
                                       '</tr>';
                       }
                       displayHtml = displayHtml +
                                   '</tbody>' +
                               '</table>' +
                           '</div>';
                   }
                   displayHtml = displayHtml +
                       '</div>';
               }
           }
           $('#display_of_votes').html(displayHtml);
       }
    });
}



function checkStatus() {
    var i, displayHtml;
    $.ajax({
        type: "POST",
        url: "class_details.php",
        dataType: "JSON",
        data: {task: "getVotingStatus"},
        success: function (response) {
            displayHtml = "";			
			if(response['finished']){
				for(i=0; i<response['finished'].length; i++){
					displayHtml = displayHtml +
						'<div style="color: green;"><span class="glyphicon glyphicon-ok"></span>  '+response['finished'][i]+'</div>';
				}
			}
            $('#finished').html(displayHtml);
            displayHtml = "";
			if(response['pending']){
				for(i=0; i<response['pending'].length; i++){
					displayHtml = displayHtml +
						'<div style="color: red;"><span class="glyphicon glyphicon-remove"></span>  '+response['pending'][i]+'</div>';
				}
			}
            $('#pending').html(displayHtml);
        }
    });
}
