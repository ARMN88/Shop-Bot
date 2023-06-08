const { Events } = require('discord.js');
const fs = require('node:fs');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}!`);
  },
};
