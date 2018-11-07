const createError = require('http-errors')
const express = require('express')
const passport = require('passport')

const admin = require('firebase-admin')
const { mongodb } = require('./src/config')
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DB_URL
})
admin.firestore().settings({
  timestampsInSnapshots: true
})

const app = express()

// Development environment configurations
if (app.get('env') === 'development') {
  console.log('Currently in dev mode')
  require('dotenv').config({
    debug: true,
  })
} else if (app.get('env') === 'production') {
  require('@google-cloud/debug-agent').start()
}

app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((obj, done) => {
  done(null, obj)
})

// view engine setup
app.set('views', './views')
app.set('view engine', 'pug')
app.set('trust proxy', 1)

app.use(require('./src'))

// 404 Fallback
app.use((req, res, next) => {
  next(createError(404))
})

// Error Handling
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  if (req.accepts('json') || app.get('env') === 'development') {
    res.send(err)
    return
  }
  if (req.accepts('html')) {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') !== 'production' ? err : undefined
    res.render('error')
    return
  }
  res.send(error.message)
})


// Use connect method to connect to the Server
mongodb.connect(err => {
  console.log("Connected successfully to mongodb server")
  // Listening to port on dev server
  const PORT = process.env.PORT || '3000';
  app.listen(PORT, () => {
    console.debug(`App listening on port ${PORT}`)
    console.debug('Press Ctrl+C to quit.')
  })
})
