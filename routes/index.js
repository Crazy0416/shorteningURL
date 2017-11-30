var express = require('express');
var router = express.Router();
var shorten = require('../modules/shorten')
var shortenAlg = require('../modules/shortenAlg')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:subdomain', function(req, res, next){
    shortenAlg.shortening("http://localhost/" + req.params.subdomain, function(n_url){
        console.log(n_url['data']);
        res.redirect(n_url['data']);
    });
})

router.post('/short', function(req, res, next){
    shortenAlg.shortening(req.body.o_url, function(n_url){
        if(n_url['success'] === true){
            res.send({
                "SUCCESS" : true,
                "n_url" : n_url['data']
            });
        }else {
            res.statusCode(204);
            res.send({
                "SUCCESS" : false
            })
        }
    });
})

module.exports = router;
