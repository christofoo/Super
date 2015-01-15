//declares variable we will be using.
var jquery_set_links;


// creates a function called fakeClick that has (obj) parameter
function fakeClick(obj) {
	//creates a variable evObj that is the instance of a 'MouseEvent' (Not Mickey's Bday Party Unfortunately :O )
	var evObj = document.createEvent('MouseEvents');
	//uses variable and uses initEvent with the 'mousedown' event type (a depression of a mouse's left-clicker) 
	//with bubbles and cancelable set to true so it bubbles up through the event chain and can be canceled. 
	evObj.initEvent('mousedown', true, true);
	//executes the evObj event on the 'obj' parameter
	obj.dispatchEvent(evObj);
}
//Fires when the extension or this script make requests from one another. Registers an event listener callback to an event
chrome.extension.onRequest.addListener(function(request, sender, callback) {
	//switches what block runs depending on the .action attribute of request (1 of 3)
	switch (request.action) {
		//when the request has the attribute 'openLinkedInLinks' run the code block
		case 'openLinkedInLinks':
			

			// linkcounter = $("#results-col a.title:visible");
			// defines a variable to be the contents of a jQuery that pulls links on LinkedIn's search page 
			jquery_set_links = $("#results-col a.title:visible");
			// tabslimit = localStorage["tabslimit"];
			// if(tabslimit > jquery_set_links.length) {				

			// }
			// creates a variable called 'data' that operates like the Array() function
			var data = Array();
			// declares var i for the upcoming for loop
			var i;
			//for loop that starts at 0; stops at the highest # of page links; and increments by one
			for( i = 0; i < jquery_set_links.length; i++) {
				// takes the 'data' array made and adds new items to it conisting of both the text and hyperlink
				// makes an array of arrays. the internal arrays are .length 2 because they have text and hyperlink
				data.push(new Array(jquery_set_links[i].text, jquery_set_links[i].href));
			}
			// if the data array has more than zero arrays in it
			if(data.length > 0) {
				// I think this calls back the openAllUrls from backgroundpageScript.js 
				// which has the line openUrl(response.urls, 0, 0, response.tabid); and fills the response.'s with
				// the contents of 'data' for urls and the tab.id that openAllUrls already has.  
				callback({
					urls : data,
					tabid : request.tabid
				});
			}
			break;
		//this is run in the case that the request has the attribute 'openNextPage'. so it has to do with the
		// openUrl function from backgroundpageScript.js
		
		case 'openNextPage':
			//window.location.href is the url of the current page. This assignment uses jQuery to find 
			// the 'next' button on the bottom of the page and sets the page url to that instead. 
			window.location = $('.next a[rel~="next"]').attr("href");

			break;

		// case 'getMore':

		// 	window.location = $('.next a[rel~="next"]').attr("href");
			
		// this is run in the case that the request has the attribute 'scrapeInfoCompanionBar' so it has to do with
		// a request from openUrl on backgroundpageScript.js	
		case 'scrapeInfoCompanionBar':
			// this uses the fakeClick function to execute a click on the link(s) whose index is(are) defined by 
			//request 
			fakeClick(jquery_set_links[request.index]);
			break;

		default:
			break;
	}
});

