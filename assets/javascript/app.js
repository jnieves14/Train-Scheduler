$(document).ready(function () {

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
  
  // Create a variable to reference the database
  var database = firebase.database();
  
  // Create an on click function that adds trains to the top table
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // create variables with the user input from form
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var firstTrainTime= $("#first-train-input").val().trim();
    var trainFrequency = $("#frequency-input").val().trim();
  
    // create a temporary object for holding the new train data
    var newTrn = {
      name: trainName,
      destination: trainDestination,
      firstTime: firstTrainTime,
      frequency: trainFrequency
    };
  
    // upload the new train data to the database
    database.ref().push(newTrn);
  
    // console log the values that were just pushed to the database
    console.log(newTrn.name);
    console.log(newTrn.destination);
    console.log(newTrn.firstTime);
    console.log(newTrn.frequency);
  
    // clear the form values after values have been stored
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  });
  
  // create a firebase event for adding the data from the new trains and then populating them in the DOM.
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
  
    // store snapshot changes in variables
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var firstTrainTime= childSnapshot.val().firstTime;
    var trainFrequency = childSnapshot.val().frequency;
  
    // log the values
    console.log(trainName);
    console.log(trainDestination);
    console.log(firstTrainTime);
    console.log(trainFrequency);
  
    // process for calculating the Next Arrival and Minutes Away fields...
    // make sure the first train time is after the eventual current time
    var firstTrainTimeConv = moment(firstTrainTime, "hh:mm a").subtract(1, "years");
    // store variable for current time
    var currentTime = moment().format("HH:mm a");
    console.log("Current Time:" + currentTime);
    // store variable for difference of current time and first train time
    var trnTimeCurrentTimeDiff = moment().diff(moment(firstTrainTimeConv), "minutes");
    // store the time left
    var timeLeft = trnTimeCurrentTimeDiff % trainFrequency;
    // calculate and store the minutes until next train arrives
    var minutesAway = trainFrequency - timeLeft;
    // calculate the next arriving train
    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");
  
    // add the data into the DOM/html
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
  });

});