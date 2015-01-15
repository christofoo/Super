			// Saves options to localStorage.
			function save_options() {
				// Creates variables based on values entered in the options fields
				var checkbox_openvisitedlinks = document.getElementById("openvisitedlinks");
				var input_tabslimit = document.getElementById("tabslimit");
				// Makes an alert box pop up for user if the "tabs limit" field entry is not a number
				if(isNaN(input_tabslimit.value)) {
					alert("Only Integer for New Tabs Limit !");
					input_tabslimit.value = localStorage["tabslimit"];
					return;
				}
				// Checks "tabs limit" value and whether the "open visited links" box was checked; saves to local storage.
				localStorage["openvisitedlinks"] = checkbox_openvisitedlinks.checked;
				localStorage["tabslimit"] = input_tabslimit.value;
				// Creates a new variable that retrieves the background page we declared in manifest.json
				var bg = chrome.extension.getBackgroundPage();
				// Runs 'updateSettings' From backgroundpageScript.js 
				bg.updateSettings();
				// Creates a variable 'status' that represents the 'status' id element from options.html
				var status = document.getElementById("status");
				// Uses the 'innerHTML' function to flash a message on page when save_options() is run
				status.innerHTML = '<span style="color:#FF0000">Options Saved.</span><br>';
				// Blanks out the 'Options Saved' message after .75 seconds
				setTimeout(function() {
					status.innerHTML = "";
				}, 750);
			}
			//function to populate the options that were saved in local storage already
			function restore_options() {
				//Creates a variable that contains the contents of local storage
				var openvisitedlinks = localStorage["openvisitedlinks"];
				var tabslimit = localStorage["tabslimit"];
				// Creates variables that pull from the contents of the fields in options.html
				var checkbox_openvisitedlinks = document.getElementById("openvisitedlinks");
				var input_tabslimit = document.getElementById("tabslimit");
				// uses the checkbox field variable and sets "checked" condition to the local storage value
				checkbox_openvisitedlinks.checked = (openvisitedlinks == "true");
				// gets the value of the 'tabs limit' field and sets it equal to the local storage value
				input_tabslimit.value = tabslimit;
			}
//Makes a function that executes save_options() function after 0 seconds have passed.
function clickHandler(e) {
  setTimeout(save_options, 0);
}
//Makes an event happen when the page loads that runs a function
document.addEventListener('DOMContentLoaded', function () {
	//Selects the first 'button' tag from the html page and adds an event so when it's clicked the clickHandler function runs
  document.querySelector('button').addEventListener('click', clickHandler);
  //runs the restore_options function. (occurs when page content loads)
  restore_options();
});