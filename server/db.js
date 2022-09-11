const fs = require('fs')
const path = require('path')
const sqlite = require('better-sqlite3')

const user_sqlite_path = path.join(__dirname, '../database.db')
const img_sqlite_path = path.join(__dirname, '../img.db')

const user_db = new sqlite(user_sqlite_path, {})
const img_db = new sqlite(img_sqlite_path, {})

// establish user table
if(!fs.existsSync(user_sqlite_path)) { 
    const sql =`create table Users (
        id integer primary key autoincrement,
        user text not null, 
        passwd text not null,
        passwd_hash text not null
    );`

    user_db.exec(sql)
    console.log('initialize user sql table')
}

// establish image table
if(!fs.existsSync(img_sqlite_path)) { 
    const sql =`create table Images (
        capture_time integer primary key autoincrement not null, 
        img text not null
    );`
    img_db.exec(sql)
    console.log('initialize image sql table')
}

const getUserDb = () => user_db
const getImageDb = () => img_db

module.exports = { getUserDb, getImageDb }