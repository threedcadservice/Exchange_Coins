const express = require('express');
const apiCtrl = require('../controller/apiCtrl.js');
const router = express.Router();
// trending

router.get('/track', apiCtrl.GetPrice);
router.post('/search', apiCtrl.GetToken);
router.post('/optionlist', apiCtrl.GetOptionlist);
router.post('/getChartData', apiCtrl.getChartData);
router.post('/tradingHistory', apiCtrl.getTradingHistory);

module.exports = router;