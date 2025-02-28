const express = require("express");
require('dotenv').config()
const raceStore = require('./races')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 8088)

app.get("/races", (req, res, next) => {
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 3
    
    let firstIndex = (page-1)*pageSize
    let lastIndex = page*pageSize
    let arr = raceStore.races.slice(firstIndex, lastIndex) 
    res.send({
        count: raceStore.races.length,
        races: [...arr]
    });
});

app.post("/races", (req, res, next) => {
    const race = req.body;
    let maxId = Math.max(...raceStore.races.map(r => r.id))
    race.id = ++maxId
    raceStore.races.push(race)
    console.log('Adding:' + race)
    res.send(race)
});

app.put("/races/:id", (req, res, next) => {
    const id = req.params.id;
    let race = req.body;
    let updatedRace = raceStore.races.find(r=>r.id == id)
    race = { ...updatedRace, ...race}
    raceStore.races = raceStore.races.filter(r => r.id != id)
    raceStore.races.push(race)
    console.log('Updated:' + race)
    res.send(race)
});

app.get('/races/:id', (req, res, next) => {
    const id = req.params.id;
    console.log('Fetching:', id)
    let race = raceStore.races.find(r => r.id == id)
    res.send(race);
});

app.delete('/races/:id', (req, res, next) => {
    const id = req.params.id;
    console.log('Deleting:', id)
    const deletedRace = raceStore.races.find(r => r.id == id)
    raceStore.races = raceStore.races.filter(r => r.id != id)
    res.send(deletedRace);
});

app.listen(app.get('port'), () => {
    console.log(`Express web app listening http://localhost:${app.get('port')}`)
});

module.exports = app

/* 
GET /races
GET /races/:id
POST /races
PUT /races/:id
DELETE /races/:id
*/