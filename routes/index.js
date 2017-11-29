var express = require('express');
var router = express.Router();
var shorten = require('../modules/shorten')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:subdomain', function(req, res, next){
    var o_url = shorten.shortening("http://localhost/" + req.params.subdomain, function(n_url){
        console.log(n_url);
        res.redirect(n_url);
    });
})

router.post('/short', function(req, res, next){
    shorten.shortening(req.body.o_url, function(n_url){
        if(n_url != null){
            res.send({
                "SUCCESS" : true,
                "n_url" : n_url
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
