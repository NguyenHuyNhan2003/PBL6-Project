const db = require('./db/connect_db')
const routes = require('./routes')

const body_Parser = require('body-parser')
const cors = require('cors')
const express = require('express')
require('dotenv').config()

const app = express()

app.use(body_Parser.json())
app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}))

db.connect()

routes(app)

app.listen(process.env.PORT, () => {
    console.log("Backend server running on port", process.env.PORT)
})