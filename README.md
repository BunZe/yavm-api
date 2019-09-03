[![forthebadge](https://forthebadge.com/images/badges/60-percent-of-the-time-works-every-time.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
  
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
  
# Yet Another Airplane Map - API / Backend  
  

YAAM is an open-source map for flight simmers.  
  

This repository holds the backend that powers YAAM.  
  
  
  

## Why does YAAM need an API?  
  

The backend (including the API) was made in an attempt to reduce the load off the client when it comes to parsing data. In addition to that, combined with MongoDB it allows us to implement cool features like flight-history tracking.  
  

Currently, the backend ships with support for the VATSIM network. To integrate your own data, see LINK.  

## Installation  
  Before installing, make sure you have the following and configured on your machine.  
  

 - NodeJS
 - MongoDB

  
```bash  
git clone https://github.com/BunZe/yavm-api  
  
cd yavm-api  
  
npm install  
```  

## Usage  

To start the app, run:  

```bash  
npm start  
```  

The app will be available at `http://localhost:5000/`.  
Data for all stations is served at `/data`.  
Data for a specific aircraft is served at `/data/<callsign>`.  
  

## Integrating your own data
Yet Another Airplane Maps backend is powered by Node, Express.js, and MongoDB and is written completely in Javascript. I've split the fetching and parsing code to make it easier to integrate your own data into the API, which will then be served to the map client. 
The `NetworkManager`  folder is where you should be looking around. It is structured like this:

`fetcher.js` is responsible for fetching raw data from a provider, and pass it on as-is to the parser. VATSIM data is served as a large text file, but JSONs, XMLs or whatever will do just fine. This is up to you because the data is interacted with only in the next step.

`parser.js` is responsible for parsing the data into the object structure YAAM is familiar with. The parser must return a list, with objects in the following structures:

##### Pilots:
```
{
	callsign: (String) *Required*,
	name: (String),
	cid: (String),
	dep: { 
	    name (String),
	    region: {
	        city: (String),
	        country: (String) 
	    },
	    code: {
	        icao: (String) *Required*,
	        iata: (String) 
	    },
	    lat: (String),
	    long: (String),
	    altitude: (String) 
	},
	arr {
	    name (String),
	    region: {
	        city: (String),
	        country: (String) 
	    },
	    code: {
	        icao: (String) *Required*,
	        iata: (String) 
	    },
	    lat: (String),
	    long: (String),
	    altitude: (String) 
	},
	aircraft,
	coords: {
	    lat: (Float) *Required*
	    long: (Float) *Required*
	},
	altitude: (Int),
	speed: (Int),
	heading: (Int) *Required*,
	timestamp: (Int) *Required*,
	type: "pilot"
}
```

##### ATC:
```
{
	callsign: (String) *Required*,
	name: (String),
	cid: (String),
	frequency: (String),
	timestamp: (Int),
	type: "atc" ,
}
```

Only the required fields are, well, required, but you'll be missing on a lot of cool features, depending on what you leave out. 

`manager.js` contains the basic "job" that runs and connects everything. This includes fetching, parsing, updating and cleaning the database of old data. You can have a look, but its recommended not to touch it.

## Airport Data
You probably noticed the `dep` and `arr` objects back in the object structure we defined. Using the amazing [OpenFlights](https://openflights.org/data.html)  YAAM can add some useful airport data. To get this working, first run `scripts/insertAirporsAndAirlineData.js`, which will create a new collection in MongoDB called "airports", containing all the data we need. You need to run this script ONCE, ever. To use this data, you'll need to head over to `NetworkDataManager/utils.js`, which contains `getAirportInfo(ICAO)`. This function simply returns that exact object structure, with the airport data for the given ICAO code. 

See the VATSIM implementation if you need help implementing it yourself.


## Support:
Reach out for me on support the [YAAM facebook page](https://www.facebook.com/yetanotherairplanemap)or on Discord: ****BunZe #2032****

## Roadmap
Workin on it...

## Contributing
YAAM is a community-driven project and is always looking for contributions. Feel free to review the code, fork and add features, fix bugs, etc. If you need to reach me checkout the Support sections.

## Shoutouts
You should check out OpenFlights, a lot of their data is used in this project, and I couldn't be more grateful for using them. 
[https://openflights.org/](https://openflights.org/)
