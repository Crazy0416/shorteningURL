var mysql = require('mysql-promise')();
var ip = require('../config/ip_config')
BASE = 62;
const table = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// config file
var mysql_config = require('../config/db_config.json');
// mysql config tab
mysql.configure(mysql_config);

var changeURL = function(data, host){
    var n_url="";
    return new Promise(function(callback){
        data.split('/').forEach(function (elem, i, arr) {
            if(i === arr.length - 1){   // end
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

var toBase62 = function(id, base62Alg, callback){
    var arr = base62Alg;
    do{
        var mod = Number(id % BASE);
        console.log('mod : ' + mod);
        arr.push(mod);
        id = Math.floor(id / BASE);
        console.log('id :' + id);
        if(id === 0)
            callback();
    }while(id)
}

var fromBase62 = function(shorturl, callback){
    var result = 0;
    var pos = 0;
    var mul = 1;
    for(var i = 0; i < shorturl.length; i++)
    {
        pos = table.indexOf(shorturl[i]);
        result += pos * mul;
        mul *= BASE;
        if(i === (shorturl.length - 1)){
            callback(result);
        }
    }
    return -1;
}

exports.visit = function(o_url){
   mysql.query('UPDATE url SET visit_cnt=visit_cnt+1 WHERE o_url=?', o_url)
       .spread(function() {
           console.log("UPDATE ok");
       })
       .catch(function (err) {
           console.log("DB_ERR visit_cnt++");
       });
}

exports.shortening = function(o_url, callback){
    var n_url = "";
    if(o_url.split('/')[2].indexOf(ip['host']) >= 0){  // mysql에 데이터 있음
        var shortUrl = o_url.split('/')[3];
        console.log('shorturl: ' + typeof(shortUrl) + " " + shortUrl.length + " " + shortUrl)
        if(typeof(shortUrl) === "undefined" || shortUrl.length === 0 || shortUrl == "favicon.ico"){
            return callback({
                "success": false,
                "data" : "주소를 다시 입력하세요"
            });
        }else{
            fromBase62(shortUrl, function (index) {
                mysql.query('SELECT o_url FROM url WHERE url_id=?', index)
                    .spread(function (rows) {
                        var o_url = rows[0]['o_url'];
                        console.log("o_url : " + o_url);
                        callback({
                            "success": true,
                            "data" : o_url
                        });
                    })
                    .catch(function (err) {
                        console.log(err);
                        callback({
                            "success": false,
                            "data" : "DB_ERR"
                        });
                    })
            });
        }
    }else{      // 새로 생성해야함
        var n_url;
        var base64arr = [];
        mysql.query('SELECT * FROM url WHERE o_url=?', o_url)
            .spread(function(rows){
                if(rows.length === 0){      // DB에 값이 없을 때
                    mysql.query('INSERT INTO url (o_url, visit_cnt) Values (?,?)', [o_url, 0])
                        .then(function (rows) {
                            console.log('insertId : ' + rows[0].insertId);
                            var urlcode = "";
                            toBase62(rows[0].insertId, base64arr, function () {
                                base64arr.forEach(function(elem, index){
                                    urlcode += table[elem];
                                    if(index === base64arr.length - 1) {
                                        callback({
                                            "success": true,
                                            "data" : "http://" + ip.address() + "/" + urlcode
                                        });
                                    }
                                })
                            });
                        })
                        .catch(function (err) {
                            callback({
                                "success": false,
                                "data" : "DB_ERR"
                            });
                        })
                }
                else{
                    var urlcode = "";
                    toBase62(rows[0]['url_id'], base64arr, function () {
                        base64arr.forEach(function(elem, index){
                            urlcode += table[elem];
                            if(index === base64arr.length - 1) {
                                callback({
                                    "success": true,
                                    "data" : "http://" + ip['host'] + "/" + urlcode
                                });
                            }
                        })
                    });
                }
            })
    };
}