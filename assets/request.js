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
    database.ref("/maintenance_contact").on("child_added" , function(snapshot) {
        //Logging the value of the snapshot to see what it returns
        console.log(snapshot.val());

        //Stores the value of the snapshot into html elements and displays them in the browser
        $("#displayAddress").append(
           "<a class='dropdown-item address' href='#'>" + snapshot.val().fb_addressInput + "</a>"
        );

        }, // If any errors are experienced, log them to console.
        function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });


});
