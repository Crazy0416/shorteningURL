var mysql = require('mysql-promise')();
var bitlyconf = require('../config/bitly_cofig.json');
var request = require('request');

// config file
var mysql_config = require('../config/db_config.json');
// mysql config tab
mysql.configure(mysql_config);

var changeURL = function(data, host){
    var n_url="";
    return new Promise(function(callback){
        data.split('/').forEach(function (elem, i, arr) {
            if(i === arr.length - 1){
                n_url += (elem);
                callback(n_url);
            }
            else if (i === 2)
                n_url += (host + '/');
            else
                n_url += (elem + '/');

        })
    })
}

exports.shortening = function(o_url, callback) {
    var bitlyObj = {
        "login":bitlyconf.login,
        "apiKey":bitlyconf.apiKey
    };
    var n_url = "";
    // TODO : url shortening

    if(o_url.split('/')[2].indexOf("localhost") >= 0){
        changeURL(o_url, "bit.ly")
            .then(function(m_url){
                bitlyObj.shortUrl = m_url;
                request({
                    "qs" : bitlyObj,
                    "url" : "https://api-ssl.bitly.com/v3/expand"
                }, function(err, res, body){
                    var rbody = JSON.parse(body);
                    if(err && rbody.status_txt !== "OK"){
                        var err_code = "ERR_bitly";
                        callback(err_code);
                    }else{
                        callback(rbody['data']['expand'][0]['long_url']);
                    }
                })
            })
    }else{
        bitlyObj.longUrl = o_url;
        request({
            "qs" : bitlyObj,
            "url" : "https://api-ssl.bitly.com/v3/shorten"
        }, function(err, res, body){
            var rbody = JSON.parse(body);
            if(err || rbody['status_txt'] !== "OK"){
                var err_code = "ERR_bitly";
                callback(err_code);
            }else{
                changeURL(rbody['data']['url'], "localhost")
                    .then(function(n_url){
                        callback(n_url);
                    })
            }
        })
    }
}