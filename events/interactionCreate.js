const { Events, ButtonStyle, ButtonBuilder, ActionRowBuilder, AttachmentBuilder } = require('discord.js');
const config = require('../config.json');
const Canvas = require('canvas');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if(!interaction.inGuild()) return interaction.reply("This bot cannot be used outside of servers.");
    // if(!config.guilds[interaction.guildId]) return interaction.reply({ content: "This server has not been paid for or set up. If you are an Administrator, please contact <@589877702543147058>. Otherwise, contact the owner of this server.", ephemeral: true });

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

async function VerificationButton(interaction) {
  if(interaction.member.roles.cache.has(config.guilds[interaction.guildId].roles.verified)) return interaction.reply({ content: "Already Verified!", ephemeral: true });
    
  const canvas = Canvas.createCanvas(500, 200);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.font = "110px Times New Roman";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let randomString = '';
  const letters = '1234567890QWERTYUIOPASDFGHJKLZXCVBNM'.split('');
  for(let i = 0; i < 6; i++) {
   randomString += letters[Math.floor(Math.random()*letters.length)];
  }
  for(let i = 0; i < 200; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 500, Math.random() * 200, Math.random() * 5 + 1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillText(randomString, 250, 110);

  // Add "Ready" button and modal
  const readyButton = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('ready')
        .setLabel('Enter Verification')
        .setStyle(ButtonStyle.Primary),
    );
  
  const attachment = new AttachmentBuilder(canvas.createPNGStream(), { name: 'capcha.png', description: randomString });
  const response = await interaction.reply({ files: [attachment], ephemeral: true, components: [readyButton] });
}