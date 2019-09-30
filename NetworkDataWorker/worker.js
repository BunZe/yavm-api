/* eslint-disable no-undef */
var db = require('../db')
var  runJob = require('./manager')
let url = 'mongodb://localhost:27017/'
if (process.env.NODE_ENV === 'production'){
  url = process.env.MONGO_URI;
}
const WAITING_TIME = 30;

async function wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
}

async function main() {
    db.connect(url, function(err) {
        if (err) {
          console.log('Unable to connect to Mongo.')
          process.exit(1);
        }
    })

    // eslint-disable-next-line no-constant-condition
    while(true){
        await runJob()
        await wait(WAITING_TIME*1000)
    }
}

main()