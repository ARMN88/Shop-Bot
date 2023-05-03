const { Events } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if(!config.guilds[interaction.guildId]) return;

    // Commands //
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
  
      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }
  
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);
      }
    }

    // Buttons //
    if(interaction.isButton()) {
      const button = interaction.client.buttons.get(interaction.customId);
      
      if (!button) {
        console.error(`No button matching ${interaction.customId} was found.`);
        return;
      }
  
      try {
        await button.execute(interaction);
      } catch (error) {
        console.error(`Error executing ${interaction.customId}`);
        console.error(error);
      }
    }

    // Modals //
    if(interaction.isModalSubmit()) {
      const modal = interaction.client.modals.get(interaction.customId);
      
      if (!modal) {
        console.error(`No modal matching ${interaction.customId} was found.`);
        return;
      }
  
      try {
        await modal.execute(interaction);
      } catch (error) {
        console.error(`Error executing ${interaction.customId}`);
        console.error(error);
      }
    }
  },
};