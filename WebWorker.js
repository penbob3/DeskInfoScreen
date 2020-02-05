self.importScripts('SongUpdater.js');

onmessage = function(e) {
	var accesstoken;
    getNowPlaying();
}