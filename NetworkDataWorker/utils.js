const controller = require('./controller')

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

    const result = await controller.getAirportByICAO(airport);
    if (result != null) return result
    return airportObject

    
}

module.exports = {getAirportInfo}