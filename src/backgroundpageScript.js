			//this makes the updateSettings function which interacts with the optionsScript.js options page
			function updateSettings() {
				//gets the current window 
				chrome.windows.getCurrent(function(win) {
					// get an array of the tabs in the window
					chrome.tabs.getAllInWindow(win.id, function(tabs) {
						for(i in tabs)// loop over the tabs
						{
							// sends a request to other listeners within the extension for tab ids based on index
							chrome.tabs.sendRequest(tabs[i].id, {
								action : 'updateSettings',
							});
						}
					});
				});
			}

			
			function openSearchPages(tab) {
				var tabslimit = localStorage["tabslimit"];

				if(tabslimit >= 10) {
					chrome.tabs.sendRequest(tab.id, {
							action : 'openNextPage'					
				});
				
				}

			}
			//makes openAllUrls function that takes 'tab' argument
			function openAllUrls(tab) {
				// this sends a request for the listeners in contentScript based on tab.id
							
				chrome.tabs.sendRequest(tab.id, {
					action : 'openLinkedInLinks',
					tabid : tab.id
					//function runs based on response
				}, function(response) {
					//runs openUrl with the urls from the response and the tabid from the response. 0s for index and count
					openUrl(response.urls, 0, 0, response.tabid);
				});
			}
			//pretty sure 'urls' gets populated by the 'data' variable in contentScript.js... not sure about 
			// index or count. They're just zeroes to start I believe. tabid is just tab.id from response. 
			function openUrl(urls, index, count, tabid) {

				// var tabslimit = localStorage["tabslimit"];
				// if(urls.length < tabslimit) {
				// 	window.location = $('.next a[rel~="next"]').attr("href");
				// 	jquery_set_links.append( $("#results-col a.title:visible") );
				// }
				// var tabslimit = localStorage["tabslimit"];
				// if(index == urls.length && tabslimit > index) {
				// 	chrome.tabs.sendRequest(tabid, {
				// 		action : 'openNextPage'
				// 	})
				// }
				if(index == urls.length) {
					var next = $('.next a[rel~="next"]').attr("href");
					function OpenInNewTab(url) {
						var win = window.open()
					}
					window.open(next);
				}

				// if(index == urls.length) {
				// // // 	// if(count == 0) {
				// 		chrome.tabs.sendRequest(tabid, {
				// 			action : 'openNextPage'
				// // 		},	function(tab) {   
				// // 			openAllUrls(tab);												
				// });

				// // // 	// }
				// // // 	return;
				// }

				// declares variable url as urls with an index
				var url = urls[index];
				//if the url with index 1 doesn't have javascript:. in it
				if(!url[1].match("javascript:.*")) {
					//creates a variable that means the localstorage value of openvisitedlinks is true
					var openvisitedlinks = (localStorage["openvisitedlinks"] == "true");
					//creates a variable that says tabslimit means the localStorage value of tabslimit
					var tabslimit = localStorage["tabslimit"];
					
					//if the count is greater than or equal to tabslimit
					if(count >= tabslimit) {
						//run the openUrl function with urls, index + 1, count, and tabid.... this doesn't
						//help me understand what's going on ...
						openUrl(urls, index + 1, count, tabid);
						return;
					}
					//assigns url[1] to be historyItemUrl
					var historyItemUrl = url[1];
					//retrieves information about visits to a URL
					chrome.history.getVisits({
						//sets the url attribute to historyItemUrl
						url : historyItemUrl
						//function runs based on visitItems
					}, function(visitItems) {
						//if openvisitedlinks is not true or the number of visitItems is not zero
						if(!(openvisitedlinks || (visitItems.length == 0))) {
							//run openUrl function with the following arguments
							openUrl(urls, index + 1, count, tabid);
							return;
						}
						//sends a request for listeners... I commented it out once and stuff still got clicked on so I 
						//have no idea what it does. I'll try that again at some point b/c that doesn't make sense
						chrome.tabs.sendRequest(tabid, {
							action : "scrapeInfoCompanionBar",
							index : index
						});
						//creates a new tab with url index 1
						chrome.tabs.create({
							url : url[1],
							selected : false
						});
						//runs openUrl function like usual but with count +1 this time
						openUrl(urls, index + 1, count + 1, tabid);
					});
				}
			}
			function openOptions(){
				chrome.tabs.create({
					url : "options.html",
					selected : true
				})
			}
			
			//initializes stuff
			function init() {
				// sets variables assigned to their localStorage values
				var openvisitedlinks = localStorage["openvisitedlinks"];
				var tabslimit = localStorage["tabslimit"];
				//if openvisitedlinks is false
				if(!openvisitedlinks) {
					//local storage of openvisitedlinks is false
					localStorage["openvisitedlinks"] = "false";
				}
				// if tabslimit is not entered
				if(!tabslimit) {
					//local storage for tabslimit is assigned to 25
					localStorage["tabslimit"] = 25;
				}
				//makes it so clicking the icon runs openAllUrls based on the open tab you're in
				chrome.browserAction.onClicked.addListener(function(tab) {
					openAllUrls(tab);
				});
				//Fires when the extension or this script make requests from one another. 
				//Registers an event listener callback to an event. not sure why its in this file tbh
				//oh I guess it's for the checkVersion crap 
				
				openOptions();
			}
//adds an event listener that waits for the page to load and then runs the init function.
document.addEventListener('DOMContentLoaded', function () {
  init();
});

