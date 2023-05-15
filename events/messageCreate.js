const { Events, EmbedBuilder } = require('discord.js');

const config = require("../config.json");

// const sqlite3 = require('sqlite3').verbose();

module.exports = {
  name: Events.MessageCreate,
  execute(message) {
    // const db = new sqlite3.Database('./database/users.db');
  },
};