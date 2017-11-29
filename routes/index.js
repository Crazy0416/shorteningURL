var express = require('express');
var router = express.Router();
var shorten = require('../modules/shorten')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:subdomain', function(req, res, next){
    var o_url = shorten.shortening(req.param.subdomain);
    res.redirect(o_url);
})

router.post('/short', function(req, res, next){
    var n_url = shorten.shortening(req.body.o_url);
    console.log("url : " + n_url);

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
})

module.exports = router;
