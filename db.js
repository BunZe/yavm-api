/* eslint-disable no-undef */
var MongoClient = require('mongodb').MongoClient

var state = {
  db: null,
}

exports.connect = function(url, done) {
  if (state.db) return done()

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) return done(err)
    state.db = db
    done()
  })
}

exports.get = function() {
  if(process.env.NODE_ENV === 'production' && state.db !== null){
    return state.db.db(process.env.DB_NAME);
  } else {
    try {
      const db = state.db.db('yaam')
      return db
    } catch (error) {
      return null
    }
  }
  
}

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}