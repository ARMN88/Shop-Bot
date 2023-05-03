const crypto = require("node:crypto");

const express = require("express");
const app = express();

app.listen(3030, () => {
  console.log("Node server running...");
});

app.use(express.static("public"));

const fs = require('node:fs');
const path = require('node:path');

const config = require("./config.json");

const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
});

client.buttons = new Collection();
const buttonsPath = path.join(__dirname, 'buttons');
const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));

for (const file of buttonFiles) {
  const filePath = path.join(buttonsPath, file);
  const button = require(filePath);
  if ('customId' in button && 'execute' in button) {
    client.buttons.set(button.customId, button);
  } else {
    console.log(`[WARNING] The button at ${filePath} is missing a required "customId" or "execute" property.`);
  }
}

client.modals = new Collection();
const modalsPath = path.join(__dirname, 'modals');
const modalFiles = fs.readdirSync(modalsPath).filter(file => file.endsWith('.js'));

for (const file of modalFiles) {
  const filePath = path.join(modalsPath, file);
  const modal = require(filePath);
  if ('customId' in modal && 'execute' in modal) {
    client.modals.set(modal.customId, modal);
  } else {
    console.log(`[WARNING] The modal at ${filePath} is missing a required "customId" or "execute" property.`);
  }
}

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(config.token);

// console.log(crypto.randomUUID());