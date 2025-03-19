const sqlite3 = require('sqlite3').verbose()
const dbName = 'darkForest.sqlite'
const db = new sqlite3.Database(dbName)

db.serialize(()=> {
    const sql = `
        CREATE TABLE IF NOT EXISTS races
        (id integer primary key, 
        name TEXT,
        streight integer,
        health integer,
        description TEXT)
    `
    db.run(sql)
})

class Race {
    static getAll(callback) {
        db.all('SELECT * FROM races', callback)
    }

    static get(id, callback) {
        db.get('SELECT * FROM races WHERE id=?', id, callback)
    }

    static insert(race, callback) {
        const sql = 'INSERT INTO races (name, streight, health, description) VALUES (?, ?, ?, ?)'
        db.run(sql, race.name, race.streight, race.health, race.description, callback)
    }
    
    static delete(id, callback) {
        if(!id)
             return callback(new Error('Parameter "id" in delete query is not defined'))
        
        db.run('DELETE FROM races WHERE id=?', id, callback)
    }
    
    static update(id, race, callback) {
        if(!id) 
            return callback(new Error('Parameter "id" in update query is not defined'))

        const sql = 'UPDATE races SET name = ?, streight = ?, health = ?, description = ? WHERE id = ?'
        db.run(sql, race.name, race.streight, race.health, race.description, race.id, callback)
    }
}

module.exports = db
module.exports.Race = Race