# DeskInfoScreen

Ever wanted to have weather, Spotify, and other (coming soon) data endpoints available at all times?

Me too.

So here a barely working, HTML/Javascript based web-app (or desktop app, with a few tweaks it works great in Electron) that pulls Spotify and local weather information and displays it in an easy to read and realtively good looking way. It also supports Spotify media controls, allowing for song pause/playing and skipping.

# Missing Features

- Custom data retrieval (RSS feeds, Twitter trends, etc.)
- Spotify volume control
- Nicer, SVG weather icons
- Code polish and readability :(

# Making it work

The fact that it loads at all is a miracle enough, but for data to be pulled and displayed, you're gonna have to add a couple strings here and there:

- You need to make a Spotify Developer account and app, then use that to obtain a refresh token for the 'user-read-currently-playing' and 'user-modify-playback-state' scopes. In SongUpdater.js, you need to put a Base64 encoded string of your User ID and Client ID with a colon (:) inbetween them (on line 106 replacing the ||'s and words inside) and the refresh token on line 112

- You also need an OpenWeatherAPI account and key, with the key going in line 37 of Main.js, plus replacing the City ID (currently 7302259) on the same line with your local City ID.

Once that's done, it should work! (Hopefully...). Please lodge any issues or requests here and I'll try to get around to them. Or make commits yourself!
