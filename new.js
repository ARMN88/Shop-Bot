const { randomInt } = require('crypto');
const fs = require('fs');
const { randomUUID } = require("node:crypto");

const newGuild =  {
  "channels": {
    "verify": "",
    "bots": "",
    "welcome": "",
    "rules": "",
    "gift-bases": "",
    "bases": "",
    "lt2-cash": "",
    "wood": "",
    "transactions": "",
    "logs": ""
  },
  "roles": {
    "verified": ""
  },
  "shop": {
    "gift-bases": [],
    "bases": [],
    "lt2-cash": [],
    "wood": []
  },
  "webhooks": "",
  "auth": randomUUID()
};

let data = JSON.parse(fs.readFileSync(__dirname + "/config.json", {encoding: 'utf-8'}));
data.guilds[' '] = newGuild;

fs.writeFileSync('./config.json', JSON.stringify(data, null, 2));