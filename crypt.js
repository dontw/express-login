//
// CRYPT
// 加解密的fucntion區
//
const crypto = require('crypto');
const md5 = require('md5')
const jwt = require('jsonwebtoken')

/**
 * 加密
 * @memberof  ToolsKit
 * @param  {String} str   要加密的字串
 * @param  {String} dsKey key，自己定一個 (24字)
 * 
 * @return {String}       加密結果
 */
function getEncrypt(str, dsKey) {
    const cipher = crypto.createCipheriv('des-ede3', new Buffer(dsKey), new Buffer(0));
    let encrypted = cipher.update(str, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

/**
 * des-ede3解密
 * @memberof  ToolsKit
 * @param  {String} tkn   要解密的字串
 * @param  {String} dsKey Key
 * @return {String}       解密結果
 */
function decryptTkn(tkn, dsKey) {
    const decipher = crypto.createDecipheriv('des-ede3', new Buffer(dsKey), new Buffer(0));
    let txt = decipher.update(tkn, 'base64', 'utf8');
    txt += decipher.final('utf8');
    return txt
}

module.exports = { getEncrypt, decryptTkn, md5, jwt }