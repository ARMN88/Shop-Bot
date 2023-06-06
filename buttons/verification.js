const { ActionRowBuilder, AttachmentBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder, Colors } = require('discord.js');
const Canvas = require('canvas');
const { Sequelize, DataTypes } = require('sequelize');

const database = new Sequelize({
  dialect: 'sqlite',
  storage: 'database/users.db',
  logging: false,
  query: {
    raw: true
  }
});

const Info = require('../models/Infos.js')(database, DataTypes);
const infoTypes = ['channel', 'role', 'webhook'];

module.exports = {
	customId: "verification",
	async execute(interaction) {
    const verificationRoleId = await Info.findOne({ where: { guildId: interaction.guildId, name: 'verified', type: infoTypes.indexOf('role') }, attributes: ['identifier'] });
    if(!verificationRoleId) {
      const errorEmbed = new EmbedBuilder().setDescription(`Verification role is not setup, please contact <@${interaction.guild.ownerId}>.`).setColor(Colors.Red);
      return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
    if(interaction.member.roles.cache.has(verificationRoleId.identifier)) return interaction.reply({ content: "Already Verified!", ephemeral: true });
    
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

    const readyButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('ready')
          .setLabel('Enter Verification')
          .setStyle(ButtonStyle.Primary),
      );
    
    const attachment = new AttachmentBuilder(canvas.createPNGStream(), { name: 'capcha.png', description: randomString });
	  return await interaction.reply({ files: [attachment], ephemeral: true, components: [readyButton] });
	},
};