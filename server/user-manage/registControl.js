const bcrypt = require('bcrypt');
const { getDb } = require('../db')

const registUsrCallback = app => {
    app.get('/regist',(req, res) => {
        const user = req.query.user
        const passwd = req.query.passwd
        // search db
        const sql_search = `select * from Users where user = \'${user}\'`
        const result = getDb().prepare(sql_search)
        if(result.all().length > 0) {
            res.json({message: '该用户已注册'})
            return
        }
        // add to db
        const hash_key = bcrypt.hashSync(passwd, bcrypt.genSaltSync())
        const sql_add = `INSERT INTO Users (user, passwd, passwd_hash) VALUES (\'${user}\', \'${passwd}\', \'${hash_key}\')`
        const result_regist = getDb().prepare(sql_add)
        res.json({message: '注册成功'})
    })
}

module.exports = { registUsrCallback }