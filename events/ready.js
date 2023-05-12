const { Events } = require('discord.js');
const config = require("../config.json");
const fs = require('node:fs');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}!`);
    if(!fs.existsSync(__dirname + "/../nohup.out")) return;
    fs.writeFile(__dirname + "/../nohup.out", '', function (err) { if (err) throw err });
  },
};