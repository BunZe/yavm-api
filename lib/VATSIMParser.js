// const fetch = require("node-fetch");
// const rawData = fetch()

const parse = (rawData) => {
    const sectionHeader = '!CLIENTS:'
    rawData = rawData.slice(rawData.indexOf(sectionHeader) + sectionHeader.length);
    rawData = rawData.slice(0, rawData.indexOf(';\r\n'));
    
    const splitRawData = rawData.split('\r\n');
    
    const parsedData = [];
    splitRawData.forEach(string => {
        let splitData = string.split(':');

        if(getField(splitData, "clienttype") !== "PILOT"){
            return;
        }

        const flightObject = {
            callsign: getField(splitData, "callsign"),
            airlineImage: null,
            dep: {
                lat: null,
                long: null,
                name: null,
                code: {
                    iata: null,
                    icao: getField(splitData, "plannedDepAirport"),
                }
            },
            arr: {
                lat: null,
                long: null,
                name: null,
                code: {
                    iata: null,
                    icao: getField(splitData, "plannedDestAirport"),
                }
            },
            aircraft: getField(splitData, "plannedAircraft"),
            coords: {
                lat: getField(splitData, "Latitude", "float"),
                long: getField(splitData, "Longitude", "float")
            },
            altitude: getField(splitData, "altitude", "int"),
            speed: getField(splitData, "groundspeed", "int"),
            heading: getField(splitData, "heading", "int")
        };
        parsedData.push(flightObject);
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