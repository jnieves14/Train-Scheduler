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
  
  // OnClick function that adds the train schedule to the Current Train Schedule
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Variables created for the user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var firstTrainTime= $("#first-train-input").val().trim();
    var trainFrequency = $("#frequency-input").val().trim();
  
    // Varibale to hold the new train's information
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      firstTime: firstTrainTime,
      frequency: trainFrequency
    };
  
    // push the new trains information to the database
    database.ref().push(newTrain);
  
    // console log the values that were just pushed to the database
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTime);
    console.log(newTrain.frequency);
  
    // after values have been stored, clear the values from the form so another input can be made
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  });
  
  // firebase event for adding all new trains' data and populating them on the comain
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
  
    // calculate the Next Arrival and Minutes Away fields
    var firstTrainTimeConv = moment(firstTrainTime, "hh:mm a").subtract(1, "years");
    // store variable for current time
    var currentTime = moment().format("HH:mm a");
    console.log("Current Time:" + currentTime);
    // store variable for difference of current time and first train time
    var trainTimeCurrentTimeDiff = moment().diff(moment(firstTrainTimeConv), "minutes");
    // store the time left
    var timeLeft = trainTimeCurrentTimeDiff % trainFrequency;
    // calculate and store the minutes until next train arrives
    var minutesAway = trainFrequency - timeLeft;
    // calculate the next arriving train
    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");
  
    // add the data
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
  });

});