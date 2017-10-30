//
// CHECK
// 讀取頁面cookie以確認是否登入
//
const config = require('./config')
const crypt = require('./crypt')
const request = require('request')

function checkLogin(res, userSessionData, cb) {
    if (userSessionData) {
        let decryptData = crypt.decryptTkn(userSessionData, config['COOKIE_DATA_KEY'])
        let sessionUserVal = crypt.jwt.verify(decryptData, config['JWT_KEY']).uacc
        let options = {
            url: `${config['API_URL']}/user/checksess`,
            headers: {
                'k-user': sessionUserVal,
                'k-session': decryptData
            },
            json: true
        }

        request
            .post(options)
            .on('error', function (err) {
                console.log(err)
            })
            .on('response', function (response) {
                cb(response.statusCode)
            })
    } else {
        res.send('COOKIE AUTH FAIL!')
    }
}

module.exports.checkLogin = checkLogin