const fetch = require('node-fetch');
const networkFetch = async () => {

    const servers = [
        'http://info.vroute.net/vatsim-data.txt',
        'http://vatsim-data.hardern.net/vatsim-data.txt',
        'http://info.vroute.net/vatsim-data.txt'
    ]

    try {
        //Request the data from a random VATSIM data server, to reduce load, I guess.
        let rawData = await fetch(servers[randomInt(servers.length)]);
        rawData =  await rawData.text();
        return rawData
    } catch (error) {
        console.log(error)
    }
}

const randomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {networkFetch}