
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
  
        // Initial Values
        var addressInput;
        var cityInput;
        var stateInput;
        var zipInput;
  
        var managerNameInput;
        var emailInput;
        var telInput;
        var contactID = 0;
  
        var issueInput;
        var issueInputID = 0;
  
  // Add Property
        // Capture Button Click
        $(".add-property-button").on("click", function (event) {
          event.preventDefault();
  
  
          // Increment rownum
          contactID++;
  
          // Grabbed values from text boxes
          addressInput = $("#addressInput").val().trim();
          cityInput = $("#cityInput").val().trim();
          stateInput = $("#stateInput").val().trim();
          zipInput = $("#zipInput").val().trim();
          managerNameInput = $("#managerNameInput").val().trim();
          emailInput = $("#emailInput").val().trim();
          telInput = $("#telInput").val().trim();
  
  
  
          // Code for handling the push
          database.ref('/maintenance_contact').push({
            fb_addressInput: addressInput,
            fb_cityInput: cityInput,
            fb_stateInput: stateInput,
            fb_zipInput: zipInput,
            fb_managerNameInput: managerNameInput,
            fb_emailInput: emailInput,
            fb_telInput: telInput,
            fb_contactID: contactID
          });
  
          //Clear text on submission
          $("#addressInput").val("");
          $("#cityInput").val("");
          $("#stateInput").val("");
          $("#zipInput").val("");
          $("#nameInput").val("");
          $("#emailInput").val("");
          $("#telInput").val("");
          $("#managerNameInput").val("");
  
        });
  
        // Firebase watcher .on("child_added"
        database.ref('/maintenance_contact').on("child_added", function (snapshot) {
          // storing the snapshot.val() in a variable for convenience
          var sv = snapshot.val();
  
          contactID = sv.fb_contactID;
  
  
  
  
          // Console.loging the last user's data
  
          // Change the HTML to reflect
          $(".add-records").append(
            "<tr class='remove-tr'>" +
            "<td class='addressRow' row_val='" + contactID + "'>" + sv.fb_addressInput + "</td>" +
            "<td class='cityRow' row_val='" + contactID + "'>" + sv.fb_cityInput + "</td>" +
            "<td class='stateRow' row_val='" + contactID + "'>" + sv.fb_stateInput + "</td>" +
            "<td class='zipRow' row_val='" + contactID + "'>" + sv.fb_zipInput + "</td>" +
            "<td class='managerNameRow' row_val='" + contactID + "'>" + sv.fb_managerNameInput + "</td>" +
            "<td class='emailRow' row_val='" + contactID + "'>" + sv.fb_emailInput + "</td>" +
            "<td class='telRow' row_val='" + contactID + "'>" + sv.fb_telInput + "</td>" +
            "<td>" + "<button row_val='" + sv.fb_contactID + "' class='btn btn-primary remove-record'>Remove</button" + "</td>" +
            "</tr>");
  
          // Handle the errors
        }, function (errorObject) {
          console.log("Errors handled: " + errorObject.code);
        });
  
        $(document).on('click', '.remove-record', function () {
  
          // removes from database
  
          var row_val = $(this).attr('row_val')
          row_val = parseInt(row_val)
  
          var abc = firebase.database().ref('/maintenance_contact');
          var key_to_delete = row_val;
          var query = abc.orderByChild('fb_contactID').equalTo(key_to_delete);
          query.on('child_added', function (snapshot) {
            snapshot.ref.remove();
          });
  
          // removes row from front end
          $(this).closest('.remove-tr').remove()
  
        })
  
  // Add Issue
        // Capture Button Click
        $(".add-Issue-Input-btn").on("click", function (event) {
          event.preventDefault();
  
  
          // Increment rownum
          issueInputID++;
  
          // Grabbed values from text boxes
          issueInput = $("#issueInput").val().trim();
  
          // Code for handling the push
          database.ref('/maintenance_issue').push({
            fb_issueInput: issueInput,
            fb_issueInputID: issueInputID
          });
  
          //Clear text on submission
          $("#issueInput").val("");
  
        });
  
        // Firebase watcher .on("child_added"
        database.ref('/maintenance_issue').on("child_added", function (snapshot) {
        // storing the snapshot.val() in a variable for convenience
        var sv = snapshot.val();
  
        issueInputID = sv.fb_issueInputID;
  
        // Change the HTML to reflect
        $(".add-issue").append(
        // "<tr class='remove-tr'>" +
        "<li class='issueRow list-group-item list-group-item-action' row_val='" + issueInputID + "'>" + sv.fb_issueInput + "</li>" 
        // "<td>" + "<button row_val='" + sv.fb_issueInputID + "' class='btn btn-primary remove-record'>Remove</button" + "</td>" 
        // "</tr>"
        );
  
        //                   // <ul class="list-group list-group-flush add-issue">
        //                   //   <li class="list-group-item">Cras justo odio</li>
  
  
        // Handle the errors
        }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
        });
  
        $(document).on('click', '.issueRow', function () {
  
          // removes from database
  
          var row_val = $(this).attr('row_val')
          row_val = parseInt(row_val)
  
          var abc = firebase.database().ref('/maintenance_issue');
          var key_to_delete = row_val;
          var query = abc.orderByChild('fb_issueInputID').equalTo(key_to_delete);
          query.on('child_added', function (snapshot) {
            snapshot.ref.remove();
          });
  
          // removes row from front end
          $(this).remove()
  
        })
      });