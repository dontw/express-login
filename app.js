//NODE MODULES
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const logger = require('morgan')
const request = require('request')
const cookieSession = require('cookie-session')
//PROJECT FILES
const config = require('./config')
const crypt = require('./crypt')
const check = require('./check')

//=========
// SETTINGS
//=========
const port = process.env.PORT || 8080;
app.set('view engine', 'ejs');
app.use(logger('dev'))
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())
app.use(cookieSession({
    name: 'LoginSession',
    secret: 'LoginCookieKey',
    domain: 'localhost',
    maxAge: config['COOKIE_EXPIRE_HOURS']
}))

//=========
// ROUTERS
//=========
app.get('/', function (req, res) {
    res.render('login')
})

app.post('/login', function (req, res) {
    let sessionVal
    let loginName = req.body.userAcc 
    let loginPwd = req.body.userPwd 
    let cryptPwd = crypt.getEncrypt(crypt.md5(loginPwd), config['LOGIN_API_KEY'])

    let options = {
        url: `${config['API_URL']}/user/login`,
        headers: {
            'k-token': config['LOGIN_API_TOKEN'],
            'Content-Type': 'application/json'
        },
        body: {
            user: loginName,
            pwd: cryptPwd
        },
        json: true
    };

    request.post(options, function (error, response, body) {

        if (error) throw new Error(error)

        if (!error && response.statusCode == 200) { //login success
            req.session.data = crypt.getEncrypt(body.data.session, config['COOKIE_DATA_KEY']) //add crypt session data to cookie
            res.redirect('login_ok')
        }

        if (!error && response.statusCode == 401) { //login fail
            res.render('login_fail')
        }
    });
})

app.get('/login_ok', function (req, res) {
    check.checkLogin(res, req.session.data, function (statusCode) {
        if (statusCode === 200) {
            res.render('login_ok')
        } else {
            res.redirect('/')
        }
    })
})

app.get('*', function (req, res) {
    res.send('WOOPS 404 PAGE NOT FOUND!')
})

//=========
// SERVER
//=========
app.listen(port)
console.log(`Server is running on http://localhost:${port}`)