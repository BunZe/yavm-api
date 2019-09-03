const utils = require('./utils');
const VATSIMParser = async (rawData) => {
    const sectionHeader = '!CLIENTS:'
    rawData = rawData.slice(rawData.indexOf(sectionHeader) + sectionHeader.length);
    rawData = rawData.slice(0, rawData.indexOf(';\r\n'));
    
    const splitRawData = rawData.split('\r\n');
    
    const parsedData = {pilots: [], atc: []};

    /* 
    IMPORTANT - Fetching, Parsing and Inserting data takes time...
    It is important you capture the time ONCE, and use it as a timestamp for all
    stations in the current operation. This timestamp is then used in various other places.
    */
    const time = Date.now();

    for (const string of splitRawData) {
        let splitData = string.split(':');

        if(getField(splitData, "clienttype") === "PILOT"){
            const flightObject = {
                callsign: getField(splitData, "callsign"),
                name: getField(splitData, "realname"),
                cid: getField(splitData, "cid"),
                airlineImage: null,
                dep: await utils.getAirportInfo(getField(splitData, "plannedDepAirport")),
                arr: await utils.getAirportInfo(getField(splitData, "plannedDestAirport")),
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
                name: getField(splitData, "realname"),
                cid: getField(splitData, "cid"),
                frequency: getField(splitData, "frequency"),
                timestamp: time,
                type: "atc",
            }
            parsedData.atc.push(atcObject);
        }
    }
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

module.exports = VATSIMParser;