/* eslint-disable no-undef */
const dotenv = require('dotenv').config()
const Papa = require('papaparse');
const fetch = require('node-fetch');
const MongoClient = require('mongodb').MongoClient;
const airportURL = 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat';
const airlineURL = 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat';

const fetchData = async (url) => {
    let rawData = await fetch(url)
    rawData = await rawData.text();
    return rawData;
}

const connectToDB = async () => {
    try {
        const client = await MongoClient.connect(process.env.MONGO_URI,  { useNewUrlParser: true });
        return client;
    } catch (error) {
        return error;
    }
    

}


const main = async () => {
    const airports = [];
    const airlines = []
    let rawData = await fetchData(airportURL);
    let results = Papa.parse(rawData, {
        step: (result) => {
            result = result.data;
            const airport = {
                name: result[1],
                region: {
                    city: result[2],
                    country: result[3]
                },
                code: {
                    iata: result[4],
                    icao: result[5]
                },
                lat: parseFloat(result[6], 10),
                long: parseFloat(result[7], 10),
                altitude: parseFloat(result[8], 10),
            }

            airports.push(airport);
        }
    });

    // Implement airline data prasing.
    rawData = fetchData(airlineURL);
    results = [];


    const db = await connectToDB();
    try {
        await db.db(process.env.DB_NAME).collection('airports').insertMany(airports)
    } catch (error) {
        console.log(error);
    } finally {
        await db.close();
    }
}


main()