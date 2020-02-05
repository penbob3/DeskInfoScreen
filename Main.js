var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	var SpotWorker = new Worker("WebWorker.js");
	
	function updateTime() {
		var currDate = new Date();
		var year = currDate.getFullYear();
		var month = currDate.getMonth();
		var date = currDate.getDate();
		var day = currDate.getDay();
		var hours = currDate.getHours();
		var mins = currDate.getMinutes();
		var secs = currDate.getSeconds();
		var datestring = "";
		datestring = datestring.concat(hours, ":", mins, ":", secs, " - ", days[day], ", ", date, " ", months[month], ", ", year);
		document.getElementById("datestring").innerHTML = datestring;
	}
	
	function startClock() {
		var t = setInterval(updateTime,1000);
	}

	function sendMoveSong(nextSong) {
		if (nextSong == true) {
			SpotWorker.postMessage("nextsong");
		} else {
			SpotWorker.postMessage("prevsong");
		}
	}

	function sendTogglePlayback() {
		SpotWorker.postMessage("togplayback");
	}
	
	function getWeather() {
		var link = "https://api.openweathermap.org/data/2.5/weather?id="+"7302259"+"&units=metric&apikey="+"||PUT OPEN WEATHER API KEY HERE||";
		var request = new XMLHttpRequest();
		request.open('GET',link,true);
		request.onload = function() {
			var obj = JSON.parse(this.response);
			if (request.status >= 200 && request.status < 400) {
				var temp = obj.main.temp;
				temp = "Current: "+temp+"°C";
				document.getElementById("temp").innerHTML = temp;
				var humid = obj.main.humidity;
				humid = "Humidity: "+humid+"%"
				document.getElementById("humid").innerHTML = humid;
				var rawdscrpt = obj.weather[0].description;
				var firstlet = rawdscrpt.slice(0,1);
				var restof = rawdscrpt.slice(1);
				firstlet = firstlet.toUpperCase();
				var descript = firstlet+restof
				document.getElementById("descript").innerHTML = descript;
				var icon = obj.weather[0].icon;
				document.getElementById("weathericon").src = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
				console.log("http://openweathermap.org/img/wn/"+icon+"@2x.png");
				document.getElementById("bigweathericon").src = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
				var city = obj.name;
				var country = obj.sys.country;
				var citycountry = city+", "+country;
				var mintemp = obj.main.temp_min;
				mintemp = "Min Temp: "+mintemp+"°C";
				var maxtemp = obj.main.temp_max;
				maxtemp = "Max Temp: "+maxtemp+"°C";
				var feelslike = obj.main.feels_like;
				feelslike = "Feels like: "+feelslike+"°C";
				var pressure = obj.main.pressure;
				pressure = "Pressure: "+pressure+" hPa";
				document.getElementById("mintext").innerHTML = mintemp;
				document.getElementById("maxtext").innerHTML = maxtemp;
				document.getElementById("feelsliketext").innerHTML = feelslike;
				document.getElementById("pressuretext").innerHTML = pressure;
				document.getElementById("locationtext").innerHTML = citycountry;
			} else {
				console.log("Weather error!");
			}
		}
		request.send();
	}

	function startWeather() {
		var t = setInterval(updateTime,900000);
	}

	function fadeOutLoading() {
		$("#closediv").css("zIndex", 100);
		var loading = $('#loadscreen');
		loading.fadeOut(2000)
		document.getElementById("closex").classList.add("fadeinload");
		document.getElementById("timebar").classList.add("fadeinload");
		document.getElementById("wrapper").classList.add("fadeinload");
	}

	function bringXForward() {
		$("#closediv").css("zIndex", 2001);
	}

	function pageBoot() {
		updateTime();
		startClock();
		getWeather();
		var weatherWorker = setInterval(getWeather, 1200000);
		SpotWorker.postMessage("11");
		var loadDelay = setTimeout(fadeOutLoading, 3000);
		var loadXDelay = setTimeout(bringXForward, 3000);
	}

	var weatheropen = false;
	var spotifyopen = false;

	function openspotify() {
	var songarrow = $('#songarrow');
	var songextra = $('#songextra');
	document.getElementById("background").classList.add('backblur');
	document.getElementById("background").classList.remove('backnotblur');
	document.getElementById("weatherbar").classList.remove('nonblur');
	document.getElementById("weatherbar").classList.add('blur');
	document.getElementById("timebar").classList.remove('nonblur');
	document.getElementById("timebar").classList.add('blur');
	document.getElementById("spotifybar").classList.add('shadow');
	document.getElementById("spotifybar").classList.remove('noshadow');
	songarrow.fadeIn();
	songextra.fadeIn();
	$("#exitmenu").css("zIndex", 1000);
	$(".frontspotify").css("zIndex", 2000);
	$(".frontweather").css("zIndex", 2000);
	}
	
	function closespotify() {
	var songarrow = $('#songarrow');
	var songextra = $('#songextra');
	document.getElementById("background").classList.remove('backblur');
	document.getElementById("background").classList.add('backnotblur');
	document.getElementById("weatherbar").classList.add('nonblur');
	document.getElementById("weatherbar").classList.remove('blur');
	document.getElementById("timebar").classList.add('nonblur');
	document.getElementById("timebar").classList.remove('blur');
	document.getElementById("spotifybar").classList.remove('shadow');
	document.getElementById("spotifybar").classList.add('noshadow');
  	songarrow.fadeOut();
	songextra.fadeOut();
	$("#exitmenu").css("zIndex", -1);
	$(".frontspotify").css("zIndex", 1000);
	$(".frontweather").css("zIndex", 1000);
	}
	
	function openweather() {
	var weatherarrow = $('#weatherarrow');
	var weatherextra = $('#weatherextra');
	document.getElementById("background").classList.add('backblur');
	document.getElementById("background").classList.remove('backnotblur');
	document.getElementById("spotifybar").classList.remove('nonblur');
	document.getElementById("spotifybar").classList.add('blur');
	document.getElementById("timebar").classList.remove('nonblur');
	document.getElementById("timebar").classList.add('blur');
	document.getElementById("weatherbar").classList.add('shadow');
	document.getElementById("weatherbar").classList.remove('noshadow');
  	weatherarrow.fadeIn();
	weatherextra.fadeIn();
	$("#exitmenu").css("zIndex", 1000);
	$(".frontspotify").css("zIndex", 2000);
	$(".frontweather").css("zIndex", 2000);
	}
	
	function closeweather() {
	var weatherarrow = $('#weatherarrow');
	var weatherextra = $('#weatherextra');
	document.getElementById("background").classList.remove('backblur');
	document.getElementById("background").classList.add('backnotblur');
	document.getElementById("spotifybar").classList.add('nonblur');
	document.getElementById("spotifybar").classList.remove('blur');
	document.getElementById("timebar").classList.add('nonblur');
	document.getElementById("timebar").classList.remove('blur');
	document.getElementById("weatherbar").classList.remove('shadow');
	document.getElementById("weatherbar").classList.add('noshadow');
  	weatherarrow.fadeOut();
	weatherextra.fadeOut();
	$("#exitmenu").css("zIndex", -1);
	$(".frontweather").css("zIndex", 1000);
	$(".frontspotify").css("zIndex", 1000);
	}
	
	function togweather() {
		if (weatheropen == true) {
			closeweather();
			weatheropen = false;
		} else {
			if (spotifyopen == true) {
				closespotify();
				spotifyopen = false;
			}
			openweather();
			weatheropen = true;
		}
	}
	
	function togspotify() {
		if (spotifyopen == true) {
			closespotify();
			spotifyopen = false;
		} else {
			if (weatheropen == true) {
				closeweather();
				weatheropen = false;
			}
			openspotify();
			spotifyopen = true;
		}
	}

	function closeAll() {
		if (spotifyopen == true) {
			closespotify();
			spotifyopen = false;
		}
		if (weatheropen == true) {
			closeweather();
			weatheropen = false;
		}
	}

	SpotWorker.onmessage = function(event){
		switch(event.data[0]) {
			case "html":
				document.getElementById(event.data[1]).innerHTML = event.data[2];
				if (event.data[1] == "albumname" || event.data[1] == "songname" || event.data[1] == "artistname") {
					$('h3').quickfit({ min: 18, max: 22, truncate: true })
				}
				break;
			case "src":
				document.getElementById(event.data[1]).src = event.data[2];
				break;
			case "jhtml":
				$(event.data[1]).html(event.data[2]);
				if (event.data[1] == "albumname" || event.data[1] == "songname" || event.data[1] == "artistname") {
					$('h3').quickfit({ min: 18, max: 22, truncate: true })
				}
				break;
			case "jwidth":
				$(event.data[1]).width(event.data[2]);
				break;
			case "localstore":
				window.localStorage.setItem(event.data[1], event.data[2]);
				break;
			case "localget":
				var temp = window.localStorage.getItem(event.data[1]);
				SpotWorker.postMessage(temp);
				break;
		}
	}; 


$('.spotifyclick').on('click', function(e) {
  if (e.target !== this)
    return;
  togspotify();
});

$('.weatherclick').on('click', function(e) {
  if (e.target !== this)
    return;
  togweather();
});