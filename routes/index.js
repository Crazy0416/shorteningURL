var express = require('express');
var router = express.Router();
var mysql = require('mysql-promise')();
var ip = require('ip');
var shorten = require('../modules/shorten')
var shortenAlg = require('../modules/shortenAlg')

// config file
var mysql_config = require('../config/db_config.json');
// mysql config tab
mysql.configure(mysql_config);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:subdomain', function(req, res, next){
    shortenAlg.shortening("http://" + ip.address() + "/" + req.params.subdomain, function(n_url){
        console.log("n_url : " + n_url['data']);
        shortenAlg.visit(n_url['data']);
        return res.redirect(n_url['data']);
    });
})

router.post('/short', function(req, res, next){
    shortenAlg.shortening(req.body.o_url, function(n_url){
        if(n_url['success'] === true){
            return res.send({
                "SUCCESS" : true,
                "n_url" : n_url['data']
            });
        }else {
            //res.status(204);
            return res.send({
                "SUCCESS" : false,
                "n_url": n_url['data']
            })
        }
    });
})

module.exports = router;
