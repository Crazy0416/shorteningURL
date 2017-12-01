var express = require('express');
var router = express.Router();
var base62 = require('../modules/base62');
var mysql = require('mysql-promise')();
var pri_ip = require('ip')
var shorten = require('../modules/shorten')
var shortenAlg = require('../modules/shortenAlg')

// config file
var mysql_config = require('../config/db_config.json');
// mysql config tab
mysql.configure(mysql_config);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ShortUrl' });
});

/*
* 기능 : 1.축약된 url DB에 있는지 확인
*         1-1. 없으면 home page render
*         1-2. 있으면 본래의 url redirect & 본래의 url 페이지 방문 횟수 증가
*      ※ favicon.ico 처리 필요
**/
router.get('/:subdomain', function(req, res, next){
    if(req.params.subdomain === "favicon.ico"){
        // favicon.ico 처리
        res.status(400);
        res.send('favicon.ico');
    }else{      // shortURL 처리
        shortenAlg.shortening("http://" + pri_ip.address() + "/" + req.params.subdomain, function(resObj){
            console.log("n_url : " + resObj['MSG']);
            if(resObj['SUCCESS'] === false){
                console.log("subdomain ERR : " + resObj['ERR']);
                console.log("subdomain INFO: " + resObj['MSG']);
                res.redirect('/');
            }else{
                shortenAlg.visit(resObj['MSG']);
                return res.redirect(resObj['MSG']);
            }
        });
    }
})

/*
* 기능 : shortenAlg 실행
* */
router.post('/short', function(req, res, next){
    shortenAlg.shortening(req.body.o_url, function(resObj){
        res.send(resObj);
    });
})

module.exports = router;
