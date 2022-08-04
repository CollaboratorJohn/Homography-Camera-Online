const fs = require('fs')
const path = require('path')
const sqlite = require('better-sqlite3')

const sqlite_path = path.join(__dirname, '../database.db')

const db = new sqlite(sqlite_path, {})

if(!fs.existsSync(sqlite_path)) { 
    const sql =`create table Users (
        id integer primary key autoincrement,
        user text not null, 
        passwd text not null,
        passwd_hash text not null
    );`
    db.exec(sql)
    console.log('initialize sql table')
}

const getDb = () => db

module.exports = { getDb }