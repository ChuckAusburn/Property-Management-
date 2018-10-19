$(document).ready(function() {


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

    var database = firebase.database();

    var issueID = 0;

    database.ref('/issue_request').on("child_added", function (snapshot) {
        // storing the snapshot.val() in a variable for convenience
        var sv = snapshot.val();        
        issueID = sv.fb_issueID;
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });

    
 
    $('.container').submit(function (event) {

        // logic to pull latest ID and increment by 1
        event.preventDefault();         
        
        issueID++

        
          
        var address = $("#selectAddress").val().trim();
        var createdDate = firebase.database.ServerValue.TIMESTAMP;
        var issueType = $("#selectissue").val();
        var issuerEmail = $("#tenantEmail").val().trim();
        var issuerName = $("#tenantName").val().trim();
        var message = "SENDER MESSAGE: " + $("#form_message").val().trim();
        var unit = $("#unitNumber").val().trim();
        var enterHome = $("#checkbox").is(':checked') ? "true" : "false";
        var issuerPhone = $("#tenantPhone").val().trim();

        var postData = {
            fb_address: address,
            fb_createdDate: createdDate,
            fb_issueID: issueID,
            fb_issueType: issueType,
            fb_issuerEmail: issuerEmail,
            fb_issuerName: issuerName,
            fb_unit: unit,
            fb_enterHome: enterHome,
            fb_issuerPhone: issuerPhone,
            fb_message: message,
          }
        var newPostKey = firebase.database().ref('/issue_request').push().key;
        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/issue_request/' + newPostKey] = postData;
        console.log(updates)
        firebase.database().ref().update(updates);
       
          //Clear text on submission
          $("#selectAddress").val("");
          $("#selectissue").val("");
          $("#tenantEmail").val("");
          $("#tenantName").val("");
          $("#unitNumber").val("");
          $("#checkbox").val("");
        $("#form_message").val("");
        $("#tenantPhone").val("");

        return false
    });


    //Refers to the parent node("maintenance_issue") location in our database and returns a snapshot of its info
    database.ref('/maintenance_contact').on("child_added" , function(snapshot) {
        //Logging the value of the snapshot to see what it returns
        var snap1 = snapshot.val();
        //Stores the value of the snapshot into html elements and displays them in the browser
        $("#selectAddress").append(
           "<option addressval='"+snap1.fb_addressInput+"' fulladdressval='"+snap1.fb_addressInput+", "+ snap1.fb_cityInput+", "+snap1.fb_stateInput+"'>" + snapshot.val().fb_addressInput + "</option>"
        );

        }, // If any errors are experienced, log them to console.
        function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    database.ref('/maintenance_issue').on("child_added" , function(snapshot) {
        $("#selectissue").append(
           "<option issueval='"+snapshot.val().fb_issueInput+"'>" + snapshot.val().fb_issueInput + "</option>"
        )}, // If any errors are experienced, log them to console.
        function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });


    $(document).on('change', '#selectAddress', function () {
        $('.collapse').collapse('show')

        var selectedaddress  = $(this).find("option:selected").attr('addressval');
        var fulladdress = $(this).find("option:selected").attr('fulladdressval');
        console.log(selectedaddress)
        var abc = firebase.database().ref('/maintenance_contact');
        var query = abc.orderByChild('fb_addressInput').equalTo(selectedaddress);
        query.on('child_added', function(snapshot){
            var snap = snapshot.val();
            console.log(snap.fb_managerNameInput)
            $("#managerInfo").empty();
            $("#managerInfo").append(
            "<table class='table'>" +
                "<tr>" +
                    "<th class='primary'> <strong>PROPERTY MANAGER DETAILS</strong> </th>" +
                "</tr>" +
                "<tr>" +
                    "<td class='info'> <strong>Manager Name:</strong></td>" + 
                    "<td>" + snap.fb_managerNameInput + "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td class='info'> <strong>Manager Number:</strong></td> " + 
                    "<td>" + snap.fb_telInput + "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td class='info'> <strong>Manager Email:</strong></td> " + 
                    "<td>" + snap.fb_emailInput + "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td class='info'> <strong>Property Address:</strong></td> " + 
                    "<td>" + snap.fb_addressInput + "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td class='info'> <strong>City, State:</strong></td> " + 
                    "<td>" + snap.fb_cityInput + ", " + snap.fb_stateInput + "</td>" +
                "</tr>" +
                "<tr>" +
                    "<td class='info'> <strong>Zip Code:</strong></td> " + 
                    "<td>" + snap.fb_zipInput + "</td>" +
                "</tr>" +
            "</table>"
        );
        });

        var addresssplit = fulladdress.split(" ");
        var addressstring ="";
        console.log(addresssplit)
        for(var i=0;i<addresssplit.length;i++) {
            if(i==addresssplit.length-1){
            addressstring = addressstring+addresssplit[i]
            } else {
            addressstring = addressstring+addresssplit[i]+'+'
            }
        }

        var querylink1 = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
        // 1600+Amphitheatre+Parkway,+Mountain+View,+CA
        var api = '&key=AIzaSyDhFk-q7bicA0ApJ7y3hNc2uLMvYnDre1w';
        var queryURL = querylink1+addressstring+api;
        console.log(queryURL)
        var lata = 0;
        var lnga = 0;
        $.ajax({
            url: queryURL,
            method: "GET"
        })
        // After the data comes back from the API
        .then(function(response) {
            // Storing an array of results in the results variable
            var results = response;
            lata = results.results[0].geometry.location.lat;
            lnga = results.results[0].geometry.location.lng;
            console.log("inside"+lata+" "+lnga);
        });

        // Initialize and add the map
        function initMap() {
        // The location of Uluru
        var uluru = {lat: lata, lng: lnga};
        // The map, centered at Uluru
        var map = new google.maps.Map(
            document.getElementById('map'), {zoom: 15, center: uluru});
        // The marker, positioned at Uluru
        var marker = new google.maps.Marker({position: uluru, map: map});
        }

        setTimeout(initMap, 560);
    });


});
