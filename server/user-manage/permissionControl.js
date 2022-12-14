const { getUserDb } = require('../db')
const cookieParser = require('cookie-parser')

const checkLoginMiddleware = (req, res, next) => {
    if (req.cookies.user && req.cookies.user_id) {
        const user = req.cookies.user
        const user_id = req.cookies.user_id
        const sql_search = `select * from Users where user = \'${user}\' and passwd_hash = \'${user_id}\'`
        const result = getUserDb().prepare(sql_search)
        if(result.all().length !== 0) {
            next();
        } else {
            res.status(401).send({ message: 'unauthenticated' });
        }
    } else {
      res.status(401).send({ message: 'unauthenticated' });
    }
  };

const permissionCallback = app => {
    app.use(cookieParser());
    
    app.get('/api/permission',checkLoginMiddleware, (req, res) => {
        res.json({ message: 'authenticated' })
    })
}


module.exports = { permissionCallback, checkLoginMiddleware }