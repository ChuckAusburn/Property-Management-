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

    //Submits email, password, location, and issue(s) to firebase
    $("#submitRequest").on("click", function(event) {
        event.preventDefault();
        var tenantName = $("#tenantName").val().trim();
        console.log(tenantName);
        var email = $("#inputEmail").val().trim();
        console.log(email);
        var phoneNum = $("#inputPhoneNum").val().trim();
        console.log(phoneNum);
    });


    //Refers to the parent node("maintenance_issue") location in our database and returns a snapshot of its info
    database.ref('/maintenance_contact').on("child_added" , function(snapshot) {
        //Logging the value of the snapshot to see what it returns


        //Stores the value of the snapshot into html elements and displays them in the browser
        $("#selectAddress").append(
           "<option addressval='"+snapshot.val().fb_addressInput+"'>" + snapshot.val().fb_addressInput + "</option>"
        );

        }, // If any errors are experienced, log them to console.
        function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });


    $(document).on('change', '#selectAddress', function () {
        var selectedaddress  = $(this).find("option:selected").attr('addressval');
        var abc = firebase.database().ref('/maintenance_contact');
        var query = abc.orderByChild('fb_addressInput').equalTo(selectedaddress);
        query.on('child_added', function(snapshot){
            var snap = snapshot.val();
            $("#managerInfo").empty();
            $("#managerInfo").append(
            "<h5 class='card-title'> Property Manager Details </h5>" +
            "<p class='card-text'>Manager Name: " + snap.fb_managerNameInput + "</p>" +
            "<p class='card-text'>Manager Number: " + snap.fb_telInput + "</p>" +
            "<p class='card-text'>Manager Email: " + snap.fb_emailInput + "</p>" +
            "<p class='card-text'>Property Address: " + snap.fb_addressInput + "</p>" +
            "<p class='card-text'>City, State: " + snap.fb_cityInput + ", " + snap.fb_stateInput + "</p>" +
            "<p class='card-text'>Zip Code: " + snap.fb_zipInput + "</p>"
        );
        });
      });

    $()

});
