
function scroll_to_class(chosen_class) {
	var nav_height = $('nav').outerHeight();
	var scroll_to = $(chosen_class).offset().top - nav_height;

	if($(window).scrollTop() != scroll_to) {
		$('html, body').stop().animate({scrollTop: scroll_to}, 1000);
	}
}


jQuery(document).ready(function() {
	var dev_url = "http://localhost:5001/covid19indiaorg/us-central1/api";
	var prod_url = "https://us-central1-covid19indiaorg.cloudfunctions.net/api";
	/*
	    Fullscreen background
	*/
	var medicine_count = 0;
	$.backstretch("assets/img/backgrounds/1.jpg");

	/*
	    Multi Step Form
	*/
	$('.msf-form form fieldset:first-child').fadeIn('slow');

	// next step
	$('.msf-form form .btn-next').on('click', function() {
		var url = prod_url + "/getDoctorDetails";
		if ($(this).attr("id") == "step_1"){
			$.ajax({
				url: url + "?emailid="+$("#doctor_email").val(),
				type: "GET",
				success: function(result){
					$("#doctor_name").val("Dr. " + result.fields.Name);
					$("#doctor_designation").val(result.fields.Qualifications);
					$("#medical_reg_no").val(result.fields.Medical_Council_Registration_Number);
					$("#doctor_location").val(result.fields.State);
				},
				error: function(error){
				}
			});
		}
		$(this).parents('fieldset').fadeOut(400, function() {
	    	$(this).next().fadeIn();
			scroll_to_class('.msf-form');
	    });
	});

	// previous step
	$('.msf-form form .btn-previous').on('click', function() {
		$(this).parents('fieldset').fadeOut(400, function() {
			$(this).prev().fadeIn();
			scroll_to_class('.msf-form');
		});
	});

	// Add step
	$('.msf-form form .btn-plus').on('click', function () {
		medicine_count++;
        var html = '';
        html += '<div class="medicine"> \
					<div class="form-group"> \
			            <label>Medicine Name:</label><br> \
			            <input type="text" name="medicine_name_'+ medicine_count + '" class="form-control" required> \
			        </div> \
			        <div class="form-group short"> \
			            <label>Duration (days):</label><br> \
			            <input type="number" name="duration_'+ medicine_count + '" class="form-control short" required> \
			        </div> \
			        <br> \
			        <div class="radio-buttons-1"> \
			        	<label>Frequency (per day):</label><br> \
			            <label class="radio-inline"> \
			            	<input type="radio" name="frequency_'+ medicine_count + '" value="1" required> 1 time(s) \
			            </label> \
			            <label class="radio-inline"> \
			            	<input type="radio" name="frequency_'+ medicine_count + '" value="2"> 2 time(s) \
			            </label> \
			            <label class="radio-inline"> \
			            	<input type="radio" name="frequency_'+ medicine_count + '" value="3"> 3 time(s) \
			            </label> \
					</div> \
					<br> \
			        <div class="radio-buttons-1"> \
			        	<label>Usage:</label><br> \
			            <label class="radio-inline"> \
			            	<input type="radio" name="usage_' + medicine_count + '" value="Before meal(s)" required> Before meal(s) \
			            </label> \
			            <label class="radio-inline"> \
			            	<input type="radio" name="usage_' + medicine_count + '" value="After meal(s)"> After meal(s) \
			            </label> \
			            <label class="radio-inline"> \
			            	<input type="radio" name="usage_' + medicine_count + '" value="Empty stomach"> Empty stomach \
			            </label> \
					</div> \
					<br> \
					<button type="button" class="btn btn-minus"><i class="fa fa-minus-circle"></i> Remove</button> \
					<hr> \
				</div>'
        $('#medicine_group').append(html);
    });

	// remove row
    $(document).on('click', '.btn-minus', function () {
        $(this).closest('.medicine').remove();
    });

    var data;
    // Submit Step
    $('form').submit(function(e) {
    	e.preventDefault();
    	data = $(this).serializeArray();

    	var request_json = new Object();

    	// Create doctor JSON object.
    	var doctor_json = new Object();
    	doctor_json.name = data[1].value;
    	doctor_json.designation = data[2].value;
    	doctor_json.registration_number = data[3].value;
    	doctor_json.location = data[4].value;

		// Create patient JSON object.
    	var patient_json = new Object();
    	patient_json.name = data[5].value;
    	patient_json.age = data[6].value;
    	patient_json.gender = data[7].value;
    	patient_json.location = data[8].value;
    	patient_json.blood_group = data[9].value;

    	// Create prescription JSON object.
    	var prescription_json = new Object();
    	prescription_json.issued_on = new Date().toLocaleDateString();
    	// To be fetched from the tawkto ticket ID.
    	prescription_json.id = "12345";
    	prescription_json.symptoms = data[10].value;
    	prescription_json.diagnosis = data[11].value;
    	prescription_json.additional_remarks = data[data.length-2].value;
    	prescription_json.follow_up_advice = data[data.length-1].value;
    	prescription_json.medicines = [];

    	for (i = 12; i < data.length - 2; i = i + 4){
    		var medicine_json = new Object();
    		medicine_json.name = data[i].value;
    		medicine_json.duration = data[i+1].value;
    		medicine_json.frequency = data[i+2].value;
    		medicine_json.usage = data[i+3].value;
    		prescription_json.medicines.push(medicine_json);
    	}


    	request_json.doctor = doctor_json;
    	request_json.patient = patient_json;
    	request_json.prescription = prescription_json;
    	console.log(request_json);

    	var request = JSON.stringify(request_json);
    	// TODO: Should make the below variable as environment variable

    	// Update this to use dev_url if running locally.
		var url = prod_url + "/generateReport";
    	var xhr = new XMLHttpRequest();
		xhr.open('POST', url, true);
		xhr.responseType = 'arraybuffer';
		xhr.onload = function () {
		    if (this.status === 200) {
		        var filename = "";
		        var disposition = xhr.getResponseHeader('Content-Disposition');
		        if (disposition && disposition.indexOf('attachment') !== -1) {
		            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
		            var matches = filenameRegex.exec(disposition);
		            if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
		        }
		        var type = xhr.getResponseHeader('Content-Type');

		        var blob;
		        if (typeof File === 'function') {
		            try {
		                blob = new File([this.response], filename, { type: type });
		            } catch (e) { /* Edge */ }
		        }
		        if (typeof blob === 'undefined') {
		            blob = new Blob([this.response], { type: type });
		        }

		        if (typeof window.navigator.msSaveBlob !== 'undefined') {
		            // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
		            window.navigator.msSaveBlob(blob, filename);
		        } else {
		            var URL = window.URL || window.webkitURL;
		            var downloadUrl = URL.createObjectURL(blob);

		            if (filename) {
		                // use HTML5 a[download] attribute to specify filename
		                var a = document.createElement("a");
		                // safari doesn't support this yet
		                if (typeof a.download === 'undefined') {
		                    window.location = downloadUrl;
		                } else {
		                    a.href = downloadUrl;
		                    a.download = filename;
		                    document.body.appendChild(a);
		                    a.click();
		                }
		            } else {
		                window.location = downloadUrl;
		            }

		            setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
		        }
		    }
		};
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(request);
	});
});






