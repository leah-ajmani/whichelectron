
var ElectronsBot = require('../lib/index.js');

var token = process.env.BOT_API_KEY;
var name = process.env.BOT_NAME;

var electronsbot = new ElectronsBot({
    token: token,
    name: name
});

electronsbot.run();