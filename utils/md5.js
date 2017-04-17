/**
 * Created by lei on 2017/3/5.
 */

const crypto = require('crypto');

module.exports = text => crypto.createHash('md5').update(text).digest('hex');
