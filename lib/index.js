var util = require('util');
var path = require('path');
var fs = require('fs');
var data = require('./data.json');
var Bot = require('slackbots');

var ElectronsBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'electronsbot';
    this.user = null;
};

ElectronsBot.prototype.run = function () {
    ElectronsBot.super_.call(this, this.settings);
    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

ElectronsBot.prototype._onStart = function () {
    this._loadBotUser();
};

ElectronsBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

ElectronsBot.prototype._welcomeMessage = function () {
    this.postMessageToChannel(this.channels[0].name, 'Hi guys, need to know which electrons member is on a project?' +
        'Just say ' + this.name + '` and then a subteam name or project name to invoke me!',
        {as_user: true});
};

ElectronsBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

ElectronsBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === ('C' || 'G');
};

ElectronsBot.prototype._isFromElectronsBot = function (message) {
    return message.user === this.user.id;
};

ElectronsBot.prototype._isMentioning = function (message, str) {
	return (message.text.toLowerCase().indexOf(str.toLowerCase()) > -1);
};

ElectronsBot.prototype._replyWithName = function (message) {
	var self = this;
    var ret = '';
	for (var key in data) {
		if (this._isMentioning(message, key)) {
			ret += data[key] + ' is working on ' + key + '\n';
        }
	}
	var channel = self._getChannelById(message.channel);
    self.postMessageToChannel(channel.name, ret, {as_user: true});
};


ElectronsBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

ElectronsBot.prototype._onMessage = function (message) {
    console.log('I have received a message ' + JSON.stringify(message));
    if (this._isChatMessage(message) &&
        //this._isChannelConversation(message) &&
        //!this._isFromElectronsBot(message) &&
        this._isMentioning(message, '@U6NG93J7N')
    ) {
        this._replyWithName(message);
    }
};

// inherits methods and properties from the Bot constructor
util.inherits(ElectronsBot, Bot);

module.exports = ElectronsBot;