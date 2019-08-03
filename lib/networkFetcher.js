const fetch = require('node-fetch')
const parse = require('./VATSIMParser');



const networkFetch = async () => {

    const servers = [
        'http://info.vroute.net/vatsim-data.txt',
        'http://vatsim-data.hardern.net/vatsim-data.txt',
        'http://info.vroute.net/vatsim-data.txt'
    ]

    try {
        let rawData = await fetch(servers[0]);
        rawData =  await rawData.text();
        return parse(rawData);


    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    networkFetch
}