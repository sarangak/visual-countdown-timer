import "./normalize.css";
import "./barebones.css";
import "./style.css";
import dingSound from "./ding.wav";
import $ from "jquery";
import NoSleep from "nosleep.js";

var body;
var noSleep = new NoSleep();
var hours;
var minutes;
var seconds;
var hoursElem;
var minutesElem;
var secondsElem;
var startButton;
var stopButton;
var resumeButton;
var clearButton;
var total;
var viewInterval;
var updateInterval;
var ding;
var speedMultiplier = 1;
var fastModeToggle;
var isRunning = false;

function drawTimer(frac) {
  $("div.timer").html(
    '<div class="frac"></div><div id="slice"' +
      (frac > 0.5 ? ' class="gt50"' : "") +
      '><div class="pie"></div>' +
      (frac > 0.5 ? '<div class="pie fill"></div>' : "") +
      "</div>"
  );

  var deg = 360 * frac;

  $("#slice .pie").css({
    "-moz-transform": "rotate(" + deg + "deg)",
    "-webkit-transform": "rotate(" + deg + "deg)",
    "-o-transform": "rotate(" + deg + "deg)",
    transform: "rotate(" + deg + "deg)",
  });

  $(".frac").html(frac);
}

function viewTimeRemaining() {
  // Set clock
  document.getElementById("timerClock").innerHTML =
    ("00" + hours).slice(-2) +
    ":" +
    ("00" + minutes).slice(-2) +
    ":" +
    ("00" + seconds).slice(-2);

  // console.log("Current: " + current + " Total: " + total);
  var current = +hours * 3600 + +minutes * 60 + +seconds;

  // Ding on early warning
  if (
    current * 2 == total ||
    current * 2 == total + 1 ||
    current == 120 ||
    current == 60 ||
    current == 30 ||
    current == 20 ||
    current == 10
  ) {
    ding.play();
  }

  // Draw pie
  var frac = 1.0 - current / total;
  drawTimer(frac);

  // Set pie color
  var pieElem = $(".timer.fill > #slice > .pie");
  if (current > 120) {
    pieElem.css("background-color", "green");
  } else if (current <= 120 && current > 30) {
    pieElem.css("background-color", "yellow");
  } else {
    pieElem.css("background-color", "red");
  }
}

function keepUpdatingTimer() {
  if (seconds > 0) {
    seconds--;
  } else if (seconds == 0 && minutes > 0) {
    minutes--;
    seconds = 59;
  } else if (seconds == 0 && minutes == 0 && hours > 0) {
    hours--;
    minutes = 59;
    seconds = 59;
  } else {
    //(seconds, minutes, and hours, all equal zero.)
    clearIntervals();
    updateInterval = setInterval(keepUpdatingTimer, 1000);
    settings.gray();
    showControls();
    ding.play();
  }
}

function startTimer() {
  ding.play(); // this is a hack to force iOS browsers to play the alarm when the timer ends
  ding.pause(); // because iOS does not allow sound to play unless triggered by a user action, like a click
  noSleep.enable();
  clearIntervals();
  hours = hoursElem.value;
  minutes = minutesElem.value;
  seconds = secondsElem.value;
  if (hours > 0 || minutes > 0 || seconds > 0) {
    if (minutes < 60 && seconds < 60) {
      total = +hours * 3600 + +minutes * 60 + +seconds;
      startIntervals();
      [stopButton, clearButton].forEach((e) => (e.disabled = false));
      [startButton, resumeButton].forEach((e) => (e.disabled = true));
      var hidden = document.getElementById("hideBox").checked;
      if (hidden) {
        hideControls();
      }
    }
  } else if (hours < 0 || minutes < 0 || seconds < 0) {
    alert("No negatives allowed!");
  } else {
    //(inputs are all zero.)
    alert("Please enter desired time first.");
  }
}

function hideControls() {
  $(".hideable").css("visibility", "hidden");
}

function showControls() {
  $(".hideable").css("visibility", "visible");
}

function startIntervals() {
  viewInterval = setInterval(viewTimeRemaining, 500 / speedMultiplier);
  updateInterval = setInterval(keepUpdatingTimer, 1000 / speedMultiplier);
  isRunning = true;
}

function clearIntervals() {
  clearInterval(viewInterval);
  clearInterval(updateInterval);
  isRunning = false;
}

function resumeTimer() {
  startIntervals();
  [stopButton, clearButton].forEach((e) => (e.disabled = false));
  [startButton, resumeButton].forEach((e) => (e.disabled = true));
}

function stopTimer() {
  clearIntervals();
  stopButton.disabled = true;
  [startButton, resumeButton].forEach((e) => (e.disabled = false));
}

function clearTimer() {
  clearIntervals();
  settings.default();
  startButton.disabled = false;
  [stopButton, clearButton, resumeButton].forEach((e) => (e.disabled = true));
  hoursElem.value = 0;
  minutesElem.value = 0;
  secondsElem.value = 0;
  document.getElementById("timerClock").innerHTML = "";
  drawTimer(0.0);
}

var settings = {
  default: function defaultColors() {
    body.style.backgroundColor = "white";
    body.style.color = "#222222";
  },
  gray: function gray() {
    body.style.backgroundColor = "#232B2B";
    body.style.color = "#DC3D24";
  },
};

function setUpEventListeners() {
  startButton.addEventListener("click", startTimer);
  stopButton.addEventListener("click", stopTimer);
  resumeButton.addEventListener("click", resumeTimer);
  clearButton.addEventListener("click", clearTimer);
  if (fastModeToggle) {
    fastModeToggle.addEventListener("change", function () {
      speedMultiplier = fastModeToggle.checked ? 10 : 1;
      if (isRunning) {
        clearIntervals();
        startIntervals();
      }
    });
  }
}

window.onload = function () {
  body = document.querySelector("body");
  ding = document.getElementById("ding");
  ding.src = dingSound;
  hoursElem = document.getElementById("inputHours");
  minutesElem = document.getElementById("inputMinutes");
  secondsElem = document.getElementById("inputSeconds");
  startButton = document.getElementById("startButton");
  stopButton = document.getElementById("stopButton");
  resumeButton = document.getElementById("resumeButton");
  clearButton = document.getElementById("clearButton");
  fastModeToggle = document.getElementById("fastMode");
  if (fastModeToggle) {
    var hostname = window.location.hostname;
    var isLocal =
      hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
    if (isLocal) {
      document.querySelectorAll(".local-only").forEach(function (node) {
        node.style.display = "block";
      });
    }
    speedMultiplier = fastModeToggle.checked ? 10 : 1;
  }
  setUpEventListeners();
  clearTimer();
};
