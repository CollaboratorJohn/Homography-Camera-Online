const { getDb } = require('../db')

const loginUsrCallback = app => {
    app.get('/login',(req, res) => {
        const user = req.query.user
        const passwd = req.query.passwd
        // search db
        const sql_search = `select * from Users where user = \'${user}\'`
        const result = getDb().prepare(sql_search)

        if(result.all().length === 0) {
            res.json({message: '该用户不存在'})
            return
        } else if(result.all()[0].passwd !== passwd) {
            res.json({message: '密码错误'})
            return
        } else {
            res.cookie('user_id', result.all()[0].passwd_hash, { maxAge: 60000000 })
            res.cookie('user', result.all()[0].user, { maxAge: 60000000 })
            res.json({message: '登录成功'})
        }
    })
}

module.exports = { loginUsrCallback }