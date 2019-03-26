var express     = require('express');
var router      = express.Router();

router.get('/', function(req, res, next) {
    
    const data = {
        data: "test"
    };

    return res.status(200).json(data);
});

module.exports = router;
