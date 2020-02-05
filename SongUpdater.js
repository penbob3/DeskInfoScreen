	var newToken;
	var isPlaying = false;
	var songLength;
	var currentSongTime;
	var timePercent;
	var barUpdateHasRun = false;
	var realtimeBar;
	var songName;
	var songUpdateCount = 0;
	var pausedUpdater;
	var noSongUpdater;
	var humanSongLength;
	var humanSongProgress;
    var localSecProgress;
	var hasGottenToken = false;
	var tokenValidUntil = 0;
	var noSong;
	var returnedSongAvailable;
	var firstTokenGrab = true;
	var prevValue;
	var formattedToken;
	var recievedToken;
	var previousToken;
	var recievedValidUntil;
	var wantedValue;

	var currentToken = currentToken;
	var currentValidUntil = currentValidUntil;
	 	
	function msToMinSec(millis) {
    	var minutes = Math.floor(millis / 60000);
    	var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
	}

	function togglePlayback() {
		if (isPlaying == true) {
			console.log("Tried to pause!")
		} else {
			console.log("Tried to resume!")
		}
		var token1 = getSpotifyToken();
		songUpdateCount = 0;
		if (isPlaying == true) {
			var link = "https://api.spotify.com/v1/me/player/pause";
		} else {
			var link = "https://api.spotify.com/v1/me/player/play";
		}
		var request = new XMLHttpRequest();
		request.open('PUT',link,false);
		var formattoken = ("Bearer "+token1);
		request.setRequestHeader("Authorization", formattoken);
		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 204) {
				isPlaying = !isPlaying;
				if (isPlaying == true) {
					sendMsg("src", "playpauseicon", "pause.png");
					//document.getElementById("playpauseicon").src = "pause.png";
					clearInterval(pausedUpdater);
					songupdatecount = 0;
					console.log("Launched Playing Updater");
					realtimeBar = setInterval(updatePlayStatus, 500, true);
				} else {
					sendMsg("src", "playpauseicon", "play.png");
					//document.getElementById("playpauseicon").src = "play.png";
					clearInterval(realtimeBar);
					songupdatecount = 0;
					console.log("Launched Paused Updater");
					pausedUpdater = setInterval(updateWhilePaused, 750);
				}
			}
		}
		request.send();
	}

	function moveSong(nextSong) {
		var validToken = getSpotifyToken();
		songUpdateCount = 0;
		if (nextSong == true) {
			var link = "https://api.spotify.com/v1/me/player/next";
		} else {
			var link = "https://api.spotify.com/v1/me/player/previous";
		}
		var request = new XMLHttpRequest();
		request.open('POST',link,false);
		var formattoken = "Bearer " + validToken;
		request.setRequestHeader("Authorization", formattoken);
		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 204) {
				setTimeout(getNowPlaying, 250)
			}
		}
		request.send();
	}

	function getSpotifyToken() {
		var d = new Date();
		var time = d.getTime();
		if (currentValidUntil < time || firstTokenGrab == true) {
			firstTokenGrab = false;
			var data;
			var link = "https://accounts.spotify.com/api/token";
			var request = new XMLHttpRequest();
			request.open('POST',link,false);
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			request.setRequestHeader("Authorization", "Basic ||PUT USER UID & APP CLIENT ID IN BASE64 HERE||");
			request.onreadystatechange = function() {
				if (request.readyState == 4) {
					data = request.responseText; 
				}
			}
			request.send("grant_type=refresh_token&refresh_token=||PUTSPOTIFYREFRESHTOKENHERE||");
			console.log(data);
			var splitData = data.split('"');
			var token = splitData[3];
			console.log("Access Token = "+token);
			currentToken = token;
			var newd = new Date();
			var newtime = newd.getTime();
			var validUntil = newtime + 3300000;
			currentValidUntil = validUntil;
			console.log("Token Expires at: "+(validUntil / 60000).toString());
			console.log("Current Time: "+(newtime / 60000).toString());
			//window.localStorage.setItem('tokenValidUntil', validUntilString);
			//sendMsg("localstore", "tokenValidUntil", validUntilString);
			return token;
		} else {
			return currentToken;
		}
		
	}

	function getNowPlaying() {
		console.log("Ran getNowPlaying?");
		songUpdateCount = 0;
		clearInterval(realtimeBar);
		clearInterval(pausedUpdater);
		clearInterval(noSongUpdater);
		newToken = getSpotifyToken();
		var data;
		var link = "https://api.spotify.com/v1/me/player/currently-playing";
		var request = new XMLHttpRequest();
		request.open('GET',link,false);
		request.setRequestHeader("Content-Type", "application/json");
		request.setRequestHeader("Accept", "application/json");
		var formattoken = "Bearer " + newToken;
		request.setRequestHeader("Authorization", formattoken);
		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 200) {
				data = request.responseText;
			}
		}
		request.send();
		try {data = JSON.parse(data);
			var name = data.item.name;
			songName = name;
			var album = data.item.album.name;
			var artist = data.item.album.artists[0].name;
			var cover = data.item.album.images[1].url;
			var bigcover = data.item.album.images[0].url;
			isPlaying = data.is_playing;
			console.log(data.is_playing.toString());
			songLength = data.item.duration_ms;
			currentSongTime = data.progress_ms;
			humanSongLength = msToMinSec(songLength);
			humanSongProgress = msToMinSec(currentSongTime);
		    localSecProgress = currentSongTime / 1000;
			sendMsg("jhtml", "#finalsongtimetext", humanSongLength);
			//$("#finalsongtimetext").html(humanSongLength);
			noSong = false;
			console.log(data);
		}
		catch(err) {
			var name = "";
			var album = "Nothing Playing!";
			var artist = "";
			var cover = "nosong.png";
			var bigcover = "nosong.png"
			noSong = true;
			sendMsg("jhtml", "#currentsongtimetext", "0:00");
			sendMsg("jhtml", "#finalsongtimetext", "0:00");
			sendMsg("jwidth", "#songprogress", 0);
			
		}
		//document.getElementById("songname").innerHTML = name;
		sendMsg("html", "songname", name);
		console.log("Tried to set Page valyes");
		//document.getElementById("albumname").innerHTML = album;
		sendMsg("html", "albumname", album);
		//document.getElementById("artistname").innerHTML = artist;
		sendMsg("html", "artistname", artist);
		//document.getElementById("albumcover").src = cover;
		sendMsg("src", "albumcover", cover);
		//document.getElementById("bigalbcover").src = bigcover;
		sendMsg("src", "bigalbcover", bigcover);
		if (isPlaying == true) {
			//document.getElementById("playpauseicon").src = "pause.png";
			sendMsg("src", "playpauseicon", "pause.png");
		} else {
			//document.getElementById("playpauseicon").src = "play.png";
			sendMsg("src", "playpauseicon", "play.png");
		}
		if (noSong == true) {
			noSongUpdater = setInterval(updateWhileNoSong, 750);
		} else {
			if (isPlaying == true) {
				realtimeBar = setInterval(updatePlayStatus, 500, true);
			} else {
				pausedUpdater = setInterval(updateWhilePaused, 750);
			}
		}
	}

	function checkSongDiff() {
		var newToken = getSpotifyToken();
		var data;
		var link = "https://api.spotify.com/v1/me/player/currently-playing";
		var request = new XMLHttpRequest();
		request.open('GET',link,false);
		request.setRequestHeader("Content-Type", "application/json");
		request.setRequestHeader("Accept", "application/json");
		var formattoken = "Bearer " + newToken;
		request.setRequestHeader("Authorization", formattoken);
		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 200) {
				data = request.responseText;
			}
		}
		request.send();
		console.log("Checked for Song Change...");
		try {data = JSON.parse(data);
			var spotServTime = data.progress_ms;
			spotHumanSongProgress = msToMinSec(spotServTime);
			currentSongTime = data.progress_ms;
			var spotServSeconds = spotServTime / 1000;
			var upperBound = spotServSeconds + 2;
			var lowerBound = spotServSeconds - 2;
			var isPlayingNow = data.is_playing;
			var name = data.item.name;
			if (name == songName) {
				if (isPlayingNow == isPlaying) {
					if (localSecProgress <= upperBound && localSecProgress >= lowerBound) {
						return false;
					} else {
						return true;
					}
				} else {
					return true;
				}
			} else {
				return true;
			}
		}
		catch(err) {
			return true;
		}
	}

	function checkSongAvailable() {
		var newToken = getSpotifyToken();
		var data;
		var link = "https://api.spotify.com/v1/me/player/currently-playing";
		var request = new XMLHttpRequest();
		request.open('GET',link,false);
		request.setRequestHeader("Content-Type", "application/json");
		request.setRequestHeader("Accept", "application/json");
		var formattoken = "Bearer " + newToken;
		request.setRequestHeader("Authorization", formattoken);
		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 200) {
				returnedSongAvailable = true;
			} else if (request.readyState == 4 && request.status == 204) {
				returnedSongAvailable = false;
			} else {
				returnedSongAvailable = false;
			}
		}
		request.send();
		console.log("Checked for Song Available...");
	}


	function updateWhilePaused() {
		if (barUpdateHasRun == false) {
			barUpdateHasRun = true;
		}
			songUpdateCount = songUpdateCount + 1;
			humanSongProgress = msToMinSec(currentSongTime);
			if (songUpdateCount >= 8 ) {
				var didSongChange = checkSongDiff();
				if (didSongChange == true) {
					updatePlayStatus(false);
					getNowPlaying();
				}
				songUpdateCount = 0;
			}
		}

	function updateWhileNoSong() {
			songUpdateCount = songUpdateCount + 1;
			if (songUpdateCount >= 8 ) {
				checkSongAvailable();
				var didSongChange = returnedSongAvailable;
				if (didSongChange == true) {
					noSong = false;
					getNowPlaying();
				}
				songUpdateCount = 0;
			}
		}

	function updatePlayStatus(live) {
		if (barUpdateHasRun == false) {
			barUpdateHasRun = true;
		}
		timePercent = Math.floor((currentSongTime / songLength) * 100);
		var barProgress = (250 *(timePercent / 100));
		//$("#songprogress").width(barProgress);
		sendMsg("jwidth", "#songprogress", barProgress);
		humanSongProgress = msToMinSec(currentSongTime);
		//$("#currentsongtimetext").html(humanSongProgress);
		sendMsg("jhtml", "#currentsongtimetext", humanSongProgress);
		localSecProgress = currentSongTime / 1000;
		console.log(humanSongProgress);
		if (live == true) {
			currentSongTime = currentSongTime + 500;
			songUpdateCount = songUpdateCount + 1;
			if (currentSongTime >= songLength) {
				songUpdateCount = 0;
				getNowPlaying();
				return;
			}
			if (songUpdateCount >= 8 ) {
				var didSongChange = checkSongDiff();
				if (didSongChange) {
					songUpdateCount = 0;
					getNowPlaying();
					return;
				}
				songUpdateCount = 0;
			}
		}
	}

	function sendMsg(type, element, value) {
		var message = [type, element, value];
		self.postMessage(message);
	}

	self.addEventListener("message", (event) => {
		if (event.data == "nextsong") {
   			
  		} else if (event.data == "prevsong") {
			
		}
	});

	self.addEventListener("message", (event) => {
		if (event.data == "nextsong") {
			moveSong(true);
		} else if (event.data == "prevsong") {
			moveSong(false);
		} else {
			togglePlayback();
		}
	});
