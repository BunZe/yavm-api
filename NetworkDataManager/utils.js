const networkDataController = require('../controllers/networkDataController')

const getAirportInfo = async (airport) => {
    const airportObject = {
        lat: null,
        long: null,
        name: null,
        code: {
            iata: null,
            icao: null,
        },
        region: {
            city: null,
            country: null
        }
    }

    const result = networkDataController.getAirportByICAO(airport);
    if (result != null) return result
    return airportObject

    
}

module.exports = {getAirportInfo}