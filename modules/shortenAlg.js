var mysql = require('mysql-promise')();
var pub_ip = require('../config/ip_config')
var pri_ip = require('ip');
var base62 = require('./base62');

const table = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// config file
var mysql_config = require('../config/db_config.json');
// mysql config tab
mysql.configure(mysql_config);

exports.visit = function(o_url){
   mysql.query('UPDATE url SET visit_cnt=visit_cnt+1 WHERE o_url=?', o_url)
       .spread(function(rows) {
           console.log("UPDATE ok");
       })
       .catch(function (err) {
           console.log("DB_ERR visit_cnt++");
       });
}

/*
* 기능 : 1. 서버 도메인/[shorturl] => 본래의 url
*        2. 다른 url
*          2-1. 원래 있는 url이면 있는 short url 리턴
*          2-2. DB에 없다면 DB에 넣고 생성한 short url 리턴
* */
exports.shortening = function(o_url, callback){
    if(o_url.split('/')[2].indexOf(pub_ip['host']) >= 0){  // short url 이 들어왔을 때
        var shortUrl = o_url.split('/')[3];
        console.log('POST /short shorturl: ' + typeof(shortUrl) + " " + shortUrl.length + " " + shortUrl);
        if(typeof(shortUrl) === "undefined" || shortUrl.length === 0){  // short index 오류
            callback({
                "SUCCESS": false,
                "MSG" : "주소를 다시 입력하세요",
                "ERR" : "WRONG_URL"
            });
        }
        else{
            base62.fromBase62(shortUrl, function (index) {
                console.log("index : " + index)
                mysql.query('SELECT o_url FROM url WHERE url_id=?', index)
                    .then(function (rows) {
                        console.log(rows);
                        if(rows[0].length === 0){    // DB에 short url을 가지는 o_url이 존재하지 않음
                            callback({
                                "SUCCESS": false,
                                "MSG" : "데이터 없음",
                                "ERR" : "NO_DATA_IN_DB"
                            });
                        }else{      // mysql에 short url 정보가 있음
                            var o_url = rows[0][0]['o_url'];
                            console.log("o_url : " + o_url);
                            callback({
                                "SUCCESS": true,
                                "MSG" : o_url,
                                "VISIT_CNT": rows[0][0]['visit_cnt']
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                        callback({
                            "SUCCESS": false,
                            "MSG": "DB 오류",
                            "ERR": "DB_ERR"
                        });
                    })
            });
        }
    }else{      // 새로운 url이 들어왔을 때
        var base64arr = [];
        mysql.query('SELECT * FROM url WHERE o_url=?', o_url)
            .then(function(rows){
                if(rows[0].length === 0){      // DB에 값이 없을 때 DB에 값을 넣음
                    mysql.query('INSERT INTO url (o_url, visit_cnt) Values (?,?)', [o_url, 0])
                        .then(function (rows) {
                            console.log('insertId : ' + rows[0].insertId);
                            var urlcode = "";
                            base62.toBase62(rows[0].insertId, base64arr, function () {
                                base64arr.forEach(function(elem, index){
                                    urlcode += table[elem];
                                    if(index === base64arr.length - 1) {
                                        callback({
                                            "SUCCESS": true,
                                            "MSG" : "http://" + pub_ip['host'] + "/" + urlcode,
                                            "VISIT_CNT": rows[0][0]['visit_cnt']
                                        });
                                    }
                                })
                            });
                        })
                        .catch(function (err) {
                            console.log("INSERT URL ERR: " + err);
                            callback({
                                "SUCCESS": false,
                                "MSG" : "DB INSERT 오류",
                                "ERR" : "INSERT_ERR_IN_DB"
                            });
                        })
                }
                else{           // DB에 o_url이 존재
                    var urlcode = "";
                    base62.toBase62(rows[0][0]['url_id'], base64arr, function () {
                        base64arr.forEach(function(elem, index){
                            urlcode += table[elem];
                            if(index === base64arr.length - 1) {
                                callback({
                                    "SUCCESS": true,
                                    "MSG" : "http://" + pub_ip['host'] + "/" + urlcode,
                                    "VISIT_CNT": rows[0][0]['visit_cnt']
                                });
                            }
                        })
                    });
                }
            })
    };
}