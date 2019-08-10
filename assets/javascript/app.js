$(document).ready(function () {

// Global Variables
var trainName = "";
var trainDestination = "";
var trainTime = "";
var trainFrequency = "";
var nextArrival = "";
var minutesAway = "";

// Global variables for jQuery functions
var inputTrain = $("#train-name");
var inputTrainDestination = $("#train-destination");
var inputTrainTime = $("#train-time").mask("00:00");
var inputTrainFreq = $("#time-freq").mask("00");


// Initialize Firebase
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyClrzrzpUHUf_HtQJ_5PMBt-3titFPmfOo",
    authDomain: "train-scheduler-d7b27.firebaseapp.com",
    databaseURL: "https://train-scheduler-d7b27.firebaseio.com",
    projectId: "train-scheduler-d7b27",
    storageBucket: "",
    messagingSenderId: "811827800250",
    appId: "1:811827800250:web:f300b8eeac96eac0"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

// Assign the reference to the database to a variable named 'database'
var database = firebase.database();

database.ref().on("child_added", function(snapshot) {

    //  local variables to store the data if data was already present from firebase
    var trainDiff = 0;
    var trainRemainder = 0;
    var minutesUntilArrival = "";
    var nextTrainTime = "";
    var frequency = snapshot.val().frequency;

    // calculate the difference in time from 'now' and the first train using UNIX timestamp, store in var and convert to minutes
    trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");

    // get the remainder of time by using modulus operator with the frequency & time difference, store in var
    trainRemainder = trainDiff % frequency;

    // ubtract the remainder from the frequency and store store in var to get how long next train will take to arrive
    minutesUntilArrival = frequency - trainRemainder;

    // add minutesUntilArrival to now, to find next train's arrival time & convert to standard time format 
    nextTrainTime = moment().add(minutesUntilArrival, "m").format("hh:mm A");

    // append to our table of trains, inside tbody, with a new row of the train data
    $("#table-info").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + minutesUntilArrival + "</td>" +
        // "<td>" + nextTrainTime + "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
        "<td>" + timeOfNextTrain+ "  " + "</td></tr>"
    );

    $("span").hide();

    // Handle the errors
    // }, function(errorObject) {
    //     console.log("Errors handled: " + errorObject.code);

    // Hover view of delete button
    $("tr").hover(
        function() {
            $(this).find("span").show();
        },
        function() {
            $(this).find("span").hide();
        });

    // STARTED BONUS TO REMOVE ITEMS ** not finished **
    $("#table-info").on("click", "tr span", function() {
        console.log(this);
        var trainRef = database.ref();
        console.log(trainRef);
    });
});

// function to call the button event, and store the values that were entered in the input form
var storeInputs = function(event) {
    // prevent from from reseting
    event.preventDefault();

    // get & store input values
    trainName = inputTrain.val().trim();
    trainDestination = inputTrainDestination.val().trim();
    trainTime = moment(inputTrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
    //the following line continues to console Uncaught TypeError: Cannot read property 'trim' of undefined
    //although the variable is defined
    trainFrequency = inputTrainFreq.val().trim();

    // add to firebase databse
    database.ref().push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    //  alert that train was added
    alert("Train added!");

    //  empty form once submitted
    inputTrain.val("");
    inputTrainDestination.val("");
    inputTrainTime.val("");
    inputTrainFreq.val("");
};

// Calls storeInputs function if submit button clicked
$("#btn-add").on("click", function(event) {
    // form validation - if empty - alert
    if (inputTrain.val().length === 0 || inputTrainDestination.val().length === 0 || inputTrainTime.val().length === 0 || inputTrainFreq === 0) {
        alert("Please Complete All Required Fields");
    } else {
        // if form is completely filled out, run function
        storeInputs(event);
    }
});

// Calls storeInputs function if enter key is clicked
$('form').on("keypress", function(event) {
    if (event.which === 13) {
        // form validation - if empty - alert
        if (inputTrain.val().length === 0 || inputTrainDestination.val().length === 0 || inputTrainTime.val().length === 0 || inputTrainFreq === 0) {
            alert("Please Complete All Required Fields");
        } else {
            // iif form is completely filled out, run function
            storeInputs(event);
        }
    }
});

});