$(document).ready(function () {

    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyBXxt23fhtW6YNk8iu_J2m9qg_ivp58RxY",
      authDomain: "property-management-aa43d.firebaseapp.com",
      databaseURL: "https://property-management-aa43d.firebaseio.com",
      projectId: "property-management-aa43d",
      storageBucket: "property-management-aa43d.appspot.com",
      messagingSenderId: "272832416557"
    };

    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();


    $(document).on('change', '.status-dropdown', function () {
      var selectedText = $(this).find("option:selected").attr('value');
      console.log(selectedText)

      // removes from database

      var row_val = $(this).attr('row_val')
      row_val = parseInt(row_val)

      var abc = firebase.database().ref('/issue_request');
      var key_to_delete = row_val;
      var query = abc.orderByChild('fb_issueID').equalTo(key_to_delete);
      query.on('child_added', function (snapshot) {
        snapshot.ref.update({
          fb_issueStatus: selectedText
        })
      });
    })


    // Firebase watcher .on("child_added"
    database.ref('/issue_request').on("child_added", function (snapshot) {
      // storing the snapshot.val() in a variable for convenience
      var sv = snapshot.val();


      // Change the HTML to reflect

      $(".add-records").append(
        "<tr class='remove-tr' row_val='" + sv.fb_issueID + "' role='row'>" +
        "<td class='addressRow' row_val='" + sv.fb_issueID + "'>" + sv.fb_address + "</td>" +
        "<td class='unitRow' row_val='" + sv.fb_issueID + "'>" + sv.fb_unit + "</td>" +
        "<td class='issueTypeRow' row_val='" + sv.fb_issueID + "'>" + sv.fb_issueType + "</td>" +
        "<td class='issuerNameRow' row_val='" + sv.fb_issueID + "'>" + sv.fb_issuerName + "</td>" +
        "<td class='issuerEmailRow' row_val='" + sv.fb_issueID + "'>" + sv.fb_issuerEmail + "</td>" +
        "<td class='issuerPhoneRow' row_val='" + sv.fb_issueID + "'>" + sv.fb_issuerPhone + "</td>" +
        "<td class='enterPremise' row_val='" + sv.fb_issueID + "'>" + sv.fb_enterHome + "</td>" +
        "<td class='createdDateRow' row_val='" + sv.fb_issueID + "'>" + moment(sv.fb_createdDate).format('MM/DD/YYYY') + "</td>" +
        "<td class='issueStatusRow' row_val='" + sv.fb_issueID + "'>" +
        "<select class='form-control status-dropdown' row_val='" + sv.fb_issueID + "'>" +
        "<option class='rowval' fb_value=" + sv.fb_issueStatus + " value='0'>Pending Review</option>" +
        "<option class='rowval' fb_value=" + sv.fb_issueStatus + "  value='1'>Resolved</option>" +
        "<option class='rowval' fb_value=" + sv.fb_issueStatus + "  value='2'>Rejected</option>" +
        "<option class='rowval' fb_value=" + sv.fb_issueStatus + "  value='3'>Confirmed</option>" +
        "</select>" +
        "</td>" +
        "<td>" + "<button row_val='" + sv.fb_issueID + "' class='btn btn-primary remove-record'>Remove</button" + "</td>" +
        "</tr>"
      );



      $.expr[':'].attrEqual = function (obj, index, meta, stack) {
        var attrs = meta[3].split(" ");
        return $(obj).attr(attrs[1]) == $(obj).attr(attrs[0]);
      };

      $('.rowval:attrEqual(fb_value value)').attr('selected', 'selected')


      // Handle the errors
    }, function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });


    // runs with firebase
    database.ref('/issue_request').on("value", function (value) {
      $('#displayRequest').DataTable()
    })


    $(document).on('click', '.remove-record', function () {

      // removes from database

      var row_val = $(this).attr('row_val')
      row_val = parseInt(row_val)

      var abc = firebase.database().ref('/issue_request');
      var key_to_delete = row_val;
      var query = abc.orderByChild('fb_issueID').equalTo(key_to_delete);
      query.on('child_added', function (snapshot) {
        snapshot.ref.remove();
      });

      // removes row from front end
      $(this).closest('.remove-tr').remove()

    });


    $(document).on('click', 'tr', function () {

      $("#form_name").val($(this).find($('.issuerNameRow')).text());
      $("#form_email").val($(this).find($('.issuerEmailRow')).text());
      $("#Subject").val($(this).find($('.addressRow')).text());
      $("#form_message").attr('row_val', $(this).attr('row_val'));

      var row_val = $("#form_message").attr('row_val')
      row_val = parseInt(row_val)

      var abc = firebase.database().ref('/issue_request');
      var key_to_delete = row_val;
      var query = abc.orderByChild('fb_issueID').equalTo(key_to_delete);
      query.on('child_added', function (snapshot) {
        var sv = snapshot.val();

        $("#form_message").text(sv.fb_message);
        $("#form_message").attr('placeholder',sv.fb_message);
      });

    });


    $('#contact-form').submit(function (e) {

    // save record
      e.preventDefault();

      var row_val = $("#form_message").attr('row_val')
      row_val = parseInt(row_val)

      var abc = firebase.database().ref('/issue_request');
      var key_to_delete = row_val;
      var query = abc.orderByChild('fb_issueID').equalTo(key_to_delete);
      query.on('child_added', function (snapshot) {
        snapshot.ref.update({
          fb_message: $("#form_message").val()
        })
      });
    
    if ($("#checkbox").is(':checked')) {
    // email record
      // Change to your service ID, or keep using the default service
      var myform = $("form#contact-form");
      var service_id = "default_service";
      var template_id = "trackeremailer";

      myform.find("button").text("Sending...");
      emailjs.sendForm(service_id,template_id,myform[0])
        .then(function(){ 
          alert("Sent!");
          myform.find("button").text("Send");
        }, function(err) {
          alert("Send email failed!\r\n Response:\n " + JSON.stringify(err));
          myform.find("button").text("Send");
        });
      return false;
    };

    $("#form_message").val("")


    });


  });