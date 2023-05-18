const { Events, EmbedBuilder, Colors } = require('discord.js');

const config = require("../config.json");

const sqlite3 = require('sqlite3').verbose();

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;
  },
};