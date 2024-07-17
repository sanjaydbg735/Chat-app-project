const moment  = require('moment');

function formatMsg(userName, msg){
    return {
        msg : msg,
        username : userName,
        time : moment().format('h:mm a')
    }
}

module.exports = formatMsg;