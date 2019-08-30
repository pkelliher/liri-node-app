// Env variables
require("dotenv").config();

// Imort node-spotify-api
const Spotify = require("node-spotify-api");

// Import API keys
const keys = require("./keys.js");

// Import axios.
const axios = require("axios");

// Import moment.
const moment = require("moment");

// Import FS.
const fs = require("fs");

const spotify = new Spotify(keys.spotify);


const getArtistNames = function(artist) {
    return artist.name;
  };
  
  const getMeSpotify = function(songName) {
    if (songName === undefined) {
      songName = "What's my age again";
    }
  
    spotify.search({
      type: "track",
      query: songName
    }, (err, data) => {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }

      const songs = data.tracks.items;

      for (let i = 0; i < songs.length; i++) {
        console.log(i);
        console.log("artist(s): " + songs[i].artists.map(getArtistNames));
        console.log("song name: " + songs[i].name);
        console.log("preview song: " + songs[i].preview_url);
        console.log("album: " + songs[i].album.name);
        console.log("-----------------------------------");
      }
    });
  };
  
  const getMyBands = function(artist) {
    const queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
  
    axios.get(queryURL).then(response => {
      const jsonData = response.data;

      if (!jsonData.length) {
        console.log("No results found for " + artist);
        return;
      }

      console.log("Upcoming concerts for " + artist + ":");

      for (let i = 0; i < jsonData.length; i++) {
        const show = jsonData[i];


        console.log(
            show.venue.city +
            "," +
            (show.venue.region || show.venue.country) +
            " at " +
            show.venue.name +
            " " +
            moment(show.datetime).format("MM/DD/YYYY")
        );
      }
    });
  };
  
  const getMeMovie = function(movieName) {
    if (movieName === undefined) {
      movieName = "Mr Nobody";
    }
  
    const urlHit =
      "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";
  
    axios.get(urlHit).then(response => {
      const jsonData = response.data;

      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("Rated: " + jsonData.Rated);
      console.log("IMDB Rating: " + jsonData.imdbRating);
      console.log("Country: " + jsonData.Country);
      console.log("Language: " + jsonData.Language);
      console.log("Plot: " + jsonData.Plot);
      console.log("Actors: " + jsonData.Actors);
      console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
    
    });
  };
  
  const doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", (error, data) => {
      console.log(data);
  
      const dataArr = data.split(",");
  
      if (dataArr.length === 2) {
        pick(dataArr[0], dataArr[1]);
      } else if (dataArr.length === 1) {
        pick(dataArr[0]);
      }
    });
  };
  
  const pick = function(caseData, functionData) {
    switch (caseData) {
    case "concert-this":
      getMyBands(functionData);
      break;
    case "spotify-this-song":
      getMeSpotify(functionData);
      break;
    case "movie-this":
      getMeMovie(functionData);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log("LIRI doesn't know that");
    }
  };
  
  const runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
  };
  
  runThis(process.argv[2], process.argv.slice(3).join(" "));

  