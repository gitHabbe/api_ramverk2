var express     = require('express');
var router      = express.Router();

router.get('/', function(req, res, next) {
    
    const data = {
        data: "test"
    };

    return res.json(data).sendStatus(200);
});

module.exports = router;
