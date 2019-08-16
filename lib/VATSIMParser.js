// const fetch = require("node-fetch");
// const rawData = fetch()

const parse = (rawData) => {
    const sectionHeader = '!CLIENTS:'
    rawData = rawData.slice(rawData.indexOf(sectionHeader) + sectionHeader.length);
    rawData = rawData.slice(0, rawData.indexOf(';\r\n'));
    
    const splitRawData = rawData.split('\r\n');
    
    const parsedData = {pilots: [], atc: []};
    const time = Date.now();
    splitRawData.forEach(string => {
        let splitData = string.split(':');

        if(getField(splitData, "clienttype") === "PILOT"){

            const flightObject = {
                callsign: getField(splitData, "callsign"),
                cid: getField(splitData, "cid"),
                airlineImage: null,
                dep: {
                    lat: null,
                    long: null,
                    name: null,
                    code: {
                        iata: null,
                        icao: getField(splitData, "plannedDepAirport"),
                    },
                    region: {
                        city: null,
                        country: null
                    }
                },
                arr: {
                    lat: null,
                    long: null,
                    name: null,
                    code: {
                        iata: null,
                        icao: getField(splitData, "plannedDestAirport"),
                    },
                    region: {
                        city: null,
                        country: null
                    }
                },
                aircraft: getField(splitData, "plannedAircraft"),
                coords: {
                    lat: getField(splitData, "Latitude", "float"),
                    long: getField(splitData, "Longitude", "float")
                },
                altitude: getField(splitData, "altitude", "int"),
                speed: getField(splitData, "groundspeed", "int"),
                heading: getField(splitData, "heading", "int"),
                timestamp: time,
                type: "pilot",
            };

            parsedData.pilots.push(flightObject);
        } else {
            const atcObject = {
                callsign: getField(splitData, "callsign"),
                cid: getField(splitData, "cid"),
                frequency: getField(splitData, "frequency"),
                timestamp: time,
                type: "atc",
            }
            parsedData.atc.push(atcObject);
        }

    });
    return parsedData;
}

const getField = (splitData, field, type) => {
    if(type === "int"){
        return parseInt(splitData[allfields.indexOf(field)]);
    } else if (type === "float") {
        return parseFloat(splitData[allfields.indexOf(field)]);
    } else {
        return splitData[allfields.indexOf(field)];
    }
}

const fetchFieldFromExternalSource = (type) => {
    // TODO: Implement
}


const allfields = [
    "callsign",
    "cid",
    "realname",
    "clienttype",
    "frequency",
    "Latitude",
    "Longitude",
    "altitude",
    "groundspeed",
    "plannedAircraft",
    "plannedTasCruise",
    "plannedDepAirport",
    "plannedAltitude",
    "plannedDestAirport",
    "server",
    "protrevision",
    "rating",
    "transponder",
    "facilityType",
    "visualRange",
    "plannedRevision",
    "plannedFlightType",
    "plannedDepTime",
    "plannedActDepTime",
    "plannedHrsEnroute",
    "plannedMinEnroute",
    "plannedHrsFuel",
    "plannedMinFuel",
    "plannedaltAirport",
    "plannedremarks",
    "plannedroute",
    "plannedDepAirportLat",
    "plannedDepAirportLon",
    "plannedDestAirportLat",
    "plannedDestAirportLon",
    "atisMessage",
    "timeLastAtisReceived",
    "timeLogon",
    "heading",
    "QNHiHg",
    "QNHMb",
]


const addDetails = () => {
    // TODO: implement
}

module.exports = parse;