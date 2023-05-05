const { Events } = require("discord.js");
const config = require('../config.json');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    // console.log(message.content);
  },
};