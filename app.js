const express = require("express");
require('dotenv').config()
const raceStore = require('./races')
const Race = require('./db').Race
const bodyParser = require('body-parser')
const cors = require('cors')
const authRouter = require('./authRouter');
const middlewareAuth = require("./middlewareAuth");


const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/auth', authRouter)

app.set('port', process.env.PORT || 8088)


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

app.get("/races", async (req, res, next) => {
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 3

    await sleep(500);

    let firstIndex = (page - 1) * pageSize
    let lastIndex = page * pageSize

    Race.getAll((err, allRacesList) => {
        if (err) {
            return next(err)
        }

        if (!allRacesList || allRacesList.length === 0)
            res.status(404).send('Не найдено ни одной расы')
        else {
            let arr = allRacesList.slice(firstIndex, lastIndex)
            res.send({
                count: allRacesList.length,
                races: [...arr]
            });
        }
    })
});

app.post("/races", middlewareAuth, (req, res, next) => {
    const race = req.body;
    let insertedRace
    Race.insert(race, (err) => {
        if (err) {
            return next(err)
        }

        console.log('Adding race:' + race.id)
        Race.getAll((err, allRacesList) => {
            if (err) return next(err)

            insertedRace = allRacesList[allRacesList.length - 1]
            res.send(insertedRace);
        })
    })
});


app.put("/races/:id", (req, res, next) => {
    const id = req.params.id;
    let race = req.body;

    Race.get(id, (err, foundedRace) => {
        if (err)
            return next(err)

        if (!foundedRace)
            res.status(404).send(`Раса id=${id} не найдена`)
        else {
            Race.update(id, race, (err) => {
                if (err)
                    return next(err)

                console.log('Updated race:' + race.id)

                Race.get(id, (err, updatedRace) => {
                    if (err) return next(err);

                    res.send(updatedRace);
                })
            })
        }
    })


});

app.get('/races/:id', (req, res, next) => {
    const id = req.params.id;
    console.log('Fetching:', id)
    Race.get(id, (err, race) => {
        if (err)
            return next(err)

        if (!race)
            res.status(404).send(`Раса id=${id} не найдена`)
        else
            res.send(race);
    })
});

app.delete('/races/:id', (req, res, next) => {
    const id = req.params.id;
    console.log('Deleting race:', id)
    let raceToDelete

    Race.get(id, (err, race) => {
        if (err)
            return next(err)

        if (!race)
            res.status(404).send(`Раса id=${id} не найдена`)
        else
            raceToDelete = race;
    })

    Race.delete(id, (err) => {
        if (err)
            return next(err)

        res.send(raceToDelete);
    })
});

app.listen(app.get('port'), () => {
    console.log(`Express web app listening http://localhost:${app.get('port')}`)
});

module.exports = app
